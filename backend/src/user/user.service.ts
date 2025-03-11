import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EncryptPasswordInput, GetCallback } from '../types';
import { encryptPassword } from './user.utils';
import { GET_USER, PERMISSIONS } from './user.constant';
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
      body: `${FRONTEND_URL}/sign?token=${token}`,
    });

    return true;
  }

  async findMany({
    userFindManyInDto,
    userId,
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
    where,
    select,
    onlyActive = true,
    showNotFoundError = true,
  }: FindOneInput) {
    if (onlyActive) {
      where['isActive'] = true;
    }
    const user = await this.prismaService.user.findFirst({
      where: where,
      select,
    });

    if (showNotFoundError && !user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async getPermissions({ userId }: GetPermissionsInput) {
    const user = await this.findOne({
      where: { id: userId },
      select: {
        role: {
          select: {
            name: true,
            permissions: {
              select: {
                resource: true,
                action: true,
              },
            },
          },
        },
      },
    });

    const role = user?.role as Role;
    if (!role.permissions) {
      throw new NotFoundException('Permissões não encontradas');
    }

    const permissionsFormatted = PERMISSIONS;
    for (const permission of role.permissions) {
      permissionsFormatted[permission.resource][permission.action] = true;
    }

    return permissionsFormatted;
  }

  async update({ where, userUpdateInDto }: UpdateInput) {
    await this.verifyDuplicated({
      email: userUpdateInDto.email,
      cpf: userUpdateInDto.cpf ?? undefined,
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

    try {
      const user = await this.prismaService.user.update({
        where: {
          isActive: !userUpdateInDto.isActive,
          ...where,
        },
        data: updatePayload,
        select: GET_USER,
      });
      return user;
    } catch (error) {
      if ((error as Record<string, string>)?.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  async generatePdf({ userGeneratePdfInDto, userId }: GeneratePdfInput) {
    const users = await this.findMany({
      userFindManyInDto: userGeneratePdfInDto,
      userId,
      paginate: false,
    }); // TODO: talvez aqui permita buscar o próprio usuário

    if (!users.data) {
      throw new BadRequestException('Nenhum dado encontrado');
    }

    return await this.pdfService.generatePdf((doc) => {
      for (const user of users.data) {
        doc.text(`Nome: ${user.fullName}`);
        doc.text(`Email: ${user.email}`);
        doc.text('\n');
      }
    });
  }

  async generateSheet({ userGenerateSheetInDto, userId }: GenerateSheetInput) {
    const users = await this.findMany({
      userFindManyInDto: userGenerateSheetInDto,
      userId,
      paginate: false,
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
