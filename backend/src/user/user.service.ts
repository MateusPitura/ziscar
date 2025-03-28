import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EncryptPasswordInput, GetCallback } from '../types';
import { encryptPassword } from './user.utils';
import { GET_PERMISSIONS, GET_USER } from './user.constant';
import { verifyDuplicated } from '../utils/verifyDuplicated';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { FRONTEND_URL } from 'src/constants';
import {
  CreateInput,
  FindManyInput,
  FindOneInput,
  GeneratePdfInput,
  GenerateSheetInput,
  GetPermissionsInput,
  Role,
  UpdateInput,
  VerifyDuplicatedInput,
} from './user.type';
import { PdfService } from 'src/pdf/pdf.service';
import { SheetService } from 'src/sheet/sheet.service';
import handlePermissions from 'src/utils/handlePermissions';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly pdfService: PdfService,
    private readonly sheetService: SheetService,
  ) {}

  async create({ userCreateInDto, transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({
      email: userCreateInDto.email,
      cpf: userCreateInDto.cpf ?? undefined,
    });

    const { address, clientId, roleId, ...rest } = userCreateInDto;

    const createPayload = {
      ...rest,
      password: await this.encryptPassword({
        password: this.generateRandomPassword(),
      }),
    };
    if (address) {
      createPayload['address'] = {
        create: address,
      };
    }

    await database.user.create({
      data: {
        ...createPayload,
        client: {
          connect: {
            id: clientId,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    });

    const token = this.jwtService.sign({ email: userCreateInDto.email });

    void this.emailService.sendEmail({
      to: userCreateInDto.email,
      title: 'Confirme a criação da sua conta',
      body: `${FRONTEND_URL}/?token=${token}`,
    });

    return true;
  }

  async findMany({
    userFindManyInDto,
    userId,
    clientId,
    paginate = true,
    select,
  }: FindManyInput) {
    const pagination = {};
    if (paginate) {
      const { page = 1 } = userFindManyInDto;
      pagination['skip'] = (page - 1) * ITEMS_PER_PAGE;
      pagination['take'] = ITEMS_PER_PAGE;
    }

    const findManyWhere = {
      where: {
        isActive: true,
        clientId: clientId,
        NOT: {
          id: userId,
        },
      },
    };
    const orderBy = userFindManyInDto?.orderBy;
    if (orderBy) {
      findManyWhere['orderBy'] = [
        {
          [orderBy as string]: 'asc',
        },
      ];
    }
    const searchByFullName = userFindManyInDto?.fullName;
    if (searchByFullName) {
      findManyWhere.where['fullName'] = {
        contains: searchByFullName.toLocaleLowerCase(),
        mode: 'insensitive',
      };
    }
    const status = userFindManyInDto?.status;
    if (status === 'inactive') {
      findManyWhere.where['isActive'] = false;
    }

    const [data, total] = await Promise.all([
      this.prismaService.user.findMany({
        ...pagination,
        select,
        ...findManyWhere,
      }),
      this.prismaService.user.count(findManyWhere),
    ]);

    return {
      total,
      data,
    };
  }

  async findOne({
    clientId,
    where,
    select,
    onlyActive = true,
    showNotFoundError = true,
  }: FindOneInput) {
    if (onlyActive) {
      where['isActive'] = true;
    }

    if (clientId) {
      where['clientId'] = clientId;
    }

    const user = await this.prismaService.user.findFirst({
      where,
      select,
    });

    if (showNotFoundError && !user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async getPermissions({ clientId, userId }: GetPermissionsInput) {
    const user = await this.findOne({
      clientId,
      where: { id: userId },
      select: GET_PERMISSIONS,
    });

    return handlePermissions({ role: user?.role as Role });
  }

  async update({
    clientId,
    where,
    userUpdateInDto,
    select = GET_USER,
    showNotFoundError = true,
  }: UpdateInput) {
    await this.verifyDuplicated({
      email: userUpdateInDto?.email,
      cpf: userUpdateInDto?.cpf ?? undefined,
    });

    const { address, roleId, ...rest } = userUpdateInDto;

    const updatePayload = {
      ...rest,
    };
    if (address) {
      updatePayload['address'] = {
        upsert: {
          create: {
            ...address,
            cep: address.cep || '',
            number: address.number || '',
          },
          update: address,
        },
      };
    }

    if (userUpdateInDto.password) {
      updatePayload['password'] = await this.encryptPassword({
        password: userUpdateInDto.password,
      });
    }

    if (roleId) {
      updatePayload['role'] = {
        connect: {
          id: roleId,
        },
      };
    }

    if (roleId || userUpdateInDto.password || 'isActive' in userUpdateInDto) {
      updatePayload['jit'] = null;
    }

    try {
      const user = await this.prismaService.user.update({
        where: {
          clientId,
          isActive: !userUpdateInDto.isActive,
          ...where,
        },
        data: updatePayload,
        select,
      });
      return user;
    } catch (error) {
      if ((error as Record<'code', string>)?.code === 'P2025') {
        if (showNotFoundError) {
          throw new NotFoundException('Usuário não encontrado');
        }
        return null;
      }
      throw error;
    }
  }

  async generatePdf({
    clientId,
    userGeneratePdfInDto,
    userId,
  }: GeneratePdfInput) {
    const users = await this.findMany({
      clientId,
      userFindManyInDto: userGeneratePdfInDto,
      userId,
      paginate: false,
      select: {
        fullName: true,
        email: true,
      },
    }); // TODO: talvez aqui permita buscar o próprio usuário

    if (!users.data) {
      throw new BadRequestException('Nenhum dado encontrado');
    }

    let pdfPayload = '<h1>User Report</h1><div class="users">';
    for (const user of users.data) {
      pdfPayload += `
      <div class="user">
        <p><strong>Name:</strong> ${user.fullName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>
    `;
    }
    pdfPayload += '</div>';
    return await this.pdfService.generatePdf({ html: pdfPayload });
  }

  async generateSheet({
    clientId,
    userGenerateSheetInDto,
    userId,
  }: GenerateSheetInput) {
    const users = await this.findMany({
      clientId,
      userFindManyInDto: userGenerateSheetInDto,
      userId,
      paginate: false,
      select: {
        fullName: true,
        email: true,
      },
    }); // TODO: talvez aqui permita buscar o próprio usuário

    if (!users.data) {
      throw new BadRequestException('Nenhum dado encontrado');
    }

    return await this.sheetService.generateSheet('users', (sheet) => {
      sheet.addRow(['Name', 'Email']);
      for (const user of users.data) {
        sheet.addRow([user.fullName, user.email]);
      }
    });
  }

  async verifyDuplicated({ email, cpf }: VerifyDuplicatedInput) {
    await verifyDuplicated({
      properties: { email, cpf },
      getCallback: this.findOne.bind(this) as GetCallback,
    });
  }

  async encryptPassword({ password }: EncryptPasswordInput) {
    return encryptPassword({ password });
  }

  generateRandomPassword() {
    return generateRandomPassword();
  }
}
