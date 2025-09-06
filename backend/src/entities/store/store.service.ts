import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Store } from '@prisma/client';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { addressNullableFields } from 'src/constants';
import { PrismaService } from 'src/infra/database/prisma.service';
import { GetCallback } from 'src/types';
import { verifyDuplicated } from 'src/utils/verifyDuplicated';
import { GET_STORE } from './store.constant';
import {
  CreateInput,
  FindManyInput,
  FindOneInput,
  UpdateInput,
  VerifyDuplicatedInput,
} from './store.type';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ storeCreateInDto, transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    if (storeCreateInDto.email || storeCreateInDto.cnpj) {
      await this.verifyDuplicated({
        email: storeCreateInDto.email ?? undefined,
        cnpj: storeCreateInDto.cnpj,
      });
    }

    const { address, enterpriseId, ...createPayload } = storeCreateInDto;

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

    const store = await database.store.create({
      data: {
        ...createPayload,
        enterprise: {
          connect: {
            id: enterpriseId,
          },
        },
      },
      select: GET_STORE,
    });

    return store;
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

    const store = await this.prismaService.store.findFirst({
      where,
      select,
    });

    if (!store) {
      if (showNotFoundError) {
        throw new NotFoundException('Loja não encontrada');
      }
      return null;
    }

    return store;
  }

  async findMany({ storeFindManyInDto, enterpriseId, select }: FindManyInput) {
    const pagination = {};
    const { page } = storeFindManyInDto;
    if (page) {
      pagination['skip'] = (page - 1) * ITEMS_PER_PAGE;
      pagination['take'] = ITEMS_PER_PAGE;
    }

    const findManyWhere = {
      where: {
        enterpriseId: enterpriseId,
      },
    };
    const orderBy = storeFindManyInDto?.orderBy;
    if (orderBy) {
      findManyWhere['orderBy'] = [
        {
          [orderBy as string]: 'asc',
        },
      ];
    }
    const searchByName = storeFindManyInDto?.name;
    if (searchByName) {
      findManyWhere.where['name'] = {
        contains: searchByName.toLocaleLowerCase(),
        mode: 'insensitive',
      };
    }
    const status = storeFindManyInDto?.status;
    if (status === 'inactive') {
      findManyWhere.where['archivedAt'] = { not: null };
    } else {
      findManyWhere.where['archivedAt'] = null;
    }
    const startDate = storeFindManyInDto?.startDate;
    const endDate = storeFindManyInDto?.endDate;
    if (startDate || endDate) {
      findManyWhere.where['createdAt'] = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [data, total] = await Promise.all([
      this.prismaService.store.findMany({
        ...pagination,
        select,
        ...findManyWhere,
      }),
      this.prismaService.store.count(findManyWhere),
    ]);

    return {
      total,
      data,
    };
  }

  async update({
    storeUpdateInDto,
    where,
    enterpriseId,
    select = GET_STORE,
    showNotFoundError,
  }: UpdateInput): Promise<Store | null> {
    if (storeUpdateInDto.cnpj) {
      await this.verifyDuplicated({
        cnpj: storeUpdateInDto.cnpj,
      });
    }

    const storeBeforeUpdate = await this.findOne({
      where: {
        archivedAt: storeUpdateInDto.archivedAt === null ? { not: null } : null,
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

    const { address, ...rest } = storeUpdateInDto;

    const updatePayload = {
      ...rest,
    };

    if (!storeBeforeUpdate?.id) {
      return null;
    }

    if (address?.remove) {
      if (!storeBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível remover, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        delete: true,
      };
    } else if (address?.update) {
      if (!storeBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível editar, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        update: address.update,
      };
    } else if (address?.add) {
      if (storeBeforeUpdate.addressId) {
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

    const userAfterUpdate = await this.prismaService.store.update({
      where: {
        id: storeBeforeUpdate.id,
      },
      data: updatePayload,
      select,
    });

    return userAfterUpdate;
  }

  async verifyDuplicated({ cnpj, email }: VerifyDuplicatedInput) {
    await verifyDuplicated({
      properties: { cnpj, email },
      getCallback: this.findOne.bind(this) as GetCallback,
    });
  }
}
