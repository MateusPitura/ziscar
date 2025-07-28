import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { encryptPassword } from './user.utils';
import {
  GET_PERMISSIONS,
  GET_USER,
  addressNullableFields,
} from './user.constant';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { FRONTEND_URL } from 'src/constants';
import {
  CreateInput,
  FindManyInput,
  FindOneInput,
  GetPermissionsInput,
  UpdateInput,
  VerifyDuplicatedInput,
} from './user.type';
import handlePermissions from 'src/utils/handlePermissions';
import { PrismaService } from 'src/infra/database/prisma.service';
import { verifyDuplicated } from 'src/utils/verifyDuplicated';
import { EncryptPasswordInput, GetCallback } from 'src/types';
import { generateRandomPassword } from 'src/utils/generateRandomPassword';
import { RoleWithPermissions } from 'src/auth/auth.service';

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
      fullName: userCreateInDto.fullName,
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

    await database.user.create({
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
    enterpriseId,
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
          'Não é possível excluir, endereço não encontrado',
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
