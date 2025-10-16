import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { addressNullableFields, FRONTEND_URL } from 'src/constants';
import { RoleWithPermissions } from 'src/entities/auth/auth.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EncryptPasswordInput, GetCallback } from 'src/types';
import { generateRandomPassword } from 'src/utils/generateRandomPassword';
import handlePermissions from 'src/utils/handlePermissions';
import { verifyDuplicated } from 'src/utils/verifyDuplicated';
import { EmailService } from '../email/email.service';
import { GET_PERMISSIONS, GET_USER } from './user.constant';
import {
  CreateInput,
  FindManyInput,
  FindOneInput,
  GetPermissionsInput,
  UpdateInput,
  VerifyDuplicatedInput,
} from './user.type';
import { encryptPassword } from './user.utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create({ userCreateInDto, transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    if (userCreateInDto.email || userCreateInDto.cpf) {
      await this.verifyDuplicated({
        email: userCreateInDto.email,
        cpf: userCreateInDto.cpf ?? undefined,
      });
    }

    const { address, enterpriseId, roleId, ...rest } = userCreateInDto;

    const createPayload = {
      ...rest,
      password: await this.encryptPassword({
        password: this.generateRandomPassword(),
      }),
    };

    if (address) {
      const { cityIbgeCode, ...addressRest } = address;

      if (cityIbgeCode) {
        addressRest['city'] = {
          connect: {
            ibgeCode: cityIbgeCode,
          },
        };
      }

      createPayload['address'] = {
        create: addressRest,
      };
    }

    const user = await database.user.create({
      data: {
        ...createPayload,
        enterprise: {
          connect: {
            id: enterpriseId,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
      select: GET_USER,
    });

    const token = this.jwtService.sign({ email: userCreateInDto.email });

    console.log('EMAIL: ', `${FRONTEND_URL}/?token=${token}`);

    void this.emailService.sendEmail({
      to: userCreateInDto.email,
      title: 'Confirme a criação da sua conta',
      html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
            <h2 style="color: #007bff; margin: 0;">Confirme sua conta</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; background-color: #ffffff;">
            <p>Olá,</p>
            <p>Sua conta foi criada com sucesso! Clique no botão abaixo para confirmar sua conta e definir sua senha:</p>
            <table cellpadding="0" cellspacing="0" style="margin: 20px 0;">
              <tr>
                <td align="center" bgcolor="#007bff" style="border-radius: 6px;">
                  <a href="${FRONTEND_URL}/?token=${token}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; text-decoration: none; font-weight: bold;">
                    Confirmar conta
                  </a>
                </td>
              </tr>
            </table>
            <p>Se você não solicitou a criação desta conta, ignore este e-mail.</p>
            <p>Atenciosamente,<br/>Equipe Ziscar</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; text-align: center; font-size: 12px; color: #888;">
            &copy; 2025 Ziscar. Todos os direitos reservados.
          </td>
        </tr>
      </table>
    `,
    });

    return user;
  }

  async findMany({
    userFindManyInDto,
    userId,
    enterpriseId,
    select,
  }: FindManyInput) {
    const pagination = {};
    const { page } = userFindManyInDto;
    if (page) {
      pagination['skip'] = (page - 1) * ITEMS_PER_PAGE;
      pagination['take'] = ITEMS_PER_PAGE;
    }

    const findManyWhere = {
      where: {
        enterpriseId: enterpriseId,
        id: { not: userId },
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
      findManyWhere.where['archivedAt'] = { not: null };
    } else {
      findManyWhere.where['archivedAt'] = null;
    }
    const startDate = userFindManyInDto?.startDate;
    const endDate = userFindManyInDto?.endDate;
    if (startDate || endDate) {
      let startDateFormatted: Date | undefined = undefined;
      if (startDate) {
        startDateFormatted = new Date(startDate);
        startDateFormatted.setHours(0, 0, 0, 0);
      }

      let endDateFormatted: Date | undefined = undefined;
      if (endDate) {
        endDateFormatted = new Date(endDate);
        endDateFormatted.setHours(23, 59, 59, 999);
      }

      findManyWhere.where['createdAt'] = {
        ...(startDate && { gte: startDateFormatted }),
        ...(endDate && { lte: endDateFormatted }),
      };
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
    enterpriseId,
    where,
    select,
    onlyActive = true,
    showNotFoundError = true,
  }: FindOneInput) {
    if (onlyActive) {
      where['archivedAt'] = null;
    }

    if (enterpriseId) {
      where['enterpriseId'] = enterpriseId;
    }

    const user = await this.prismaService.user.findFirst({
      where,
      select,
    });

    if (!user) {
      if (showNotFoundError) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return null;
    }

    return user;
  }

  async getPermissions({ enterpriseId, userId }: GetPermissionsInput) {
    const user = await this.findOne({
      enterpriseId,
      where: { id: userId },
      select: GET_PERMISSIONS,
    });

    return handlePermissions({
      permissions:
        (user?.role as RoleWithPermissions)?.rolePermissions?.map(
          (rp) => rp.permission,
        ) ?? [],
    });
  }

  async update({
    enterpriseId,
    where,
    userUpdateInDto,
    select = GET_USER,
    showNotFoundError = true,
  }: UpdateInput) {
    if (userUpdateInDto.cpf) {
      await this.verifyDuplicated({
        cpf: userUpdateInDto.cpf ?? undefined,
      });
    }

    const userBeforeUpdate = await this.findOne({
      where: {
        archivedAt: userUpdateInDto.archivedAt === null ? { not: null } : null,
        ...where,
      },
      enterpriseId,
      onlyActive: false,
      showNotFoundError,
      select: {
        addressId: true,
        id: true,
      },
    });

    const { address, roleId, ...rest } = userUpdateInDto;

    const updatePayload = {
      ...rest,
    };

    if (!userBeforeUpdate?.id) {
      return null;
    }

    if (address?.remove) {
      if (!userBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível remover, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        delete: true,
      };
    } else if (address?.update) {
      if (!userBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível editar, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        update: address.update,
      };
    } else if (address?.add) {
      if (userBeforeUpdate.addressId) {
        updatePayload['address'] = {
          update: {
            ...addressNullableFields,
            ...address.add,
          },
        };
      } else {
        updatePayload['address'] = {
          create: address.add,
        };
      }
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

    if (roleId || userUpdateInDto.password || 'archivedAt' in userUpdateInDto) {
      updatePayload['jit'] = null;
    }

    const userAfterUpdate = await this.prismaService.user.update({
      where: {
        id: userBeforeUpdate.id,
      },
      data: updatePayload,
      select,
    });

    return userAfterUpdate;
  }

  async findUnique(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
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
