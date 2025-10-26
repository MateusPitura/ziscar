import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { addressNullableFields } from 'src/constants';
import { PrismaService } from 'src/infra/database/prisma.service';
import { GetCallback } from 'src/types';
import { verifyDuplicated } from 'src/utils/verifyDuplicated';
import { GET_CUSTOMER } from './customer.constant';
import {
  CreateInput,
  FindManyInput,
  FindOneInput,
  UpdateInput,
  VerifyDuplicatedInput,
} from './customer.type';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ customerCreateInDto, transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    if (customerCreateInDto.email || customerCreateInDto.cpf) {
      await this.verifyDuplicated({
        email: customerCreateInDto.email ?? undefined,
        cpf: customerCreateInDto.cpf,
      });
    }

    const { address, enterpriseId, ...createPayload } = customerCreateInDto;

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

    const customer = await database.customer.create({
      data: {
        ...createPayload,
        enterprise: {
          connect: {
            id: enterpriseId,
          },
        },
      },
      select: GET_CUSTOMER,
    });

    return customer;
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

    const customer = await this.prismaService.customer.findFirst({
      where,
      select,
    });

    if (!customer) {
      if (showNotFoundError) {
        throw new NotFoundException('Cliente não encontrado');
      }
      return null;
    }

    return customer;
  }

  async findUnique(id: number, enterpriseId: number) {
    return await this.prismaService.customer.findUnique({
      where: { id, enterpriseId },
      include: { address: true },
    });
  }

  async findMany({
    customerFindManyInDto,
    enterpriseId,
    select,
  }: FindManyInput) {
    const pagination = {};
    const { page } = customerFindManyInDto;
    if (page) {
      pagination['skip'] = (page - 1) * ITEMS_PER_PAGE;
      pagination['take'] = ITEMS_PER_PAGE;
    }

    const findManyWhere = {
      where: {
        enterpriseId: enterpriseId,
      },
    };
    const orderBy = customerFindManyInDto?.orderBy;
    if (orderBy) {
      findManyWhere['orderBy'] = [
        {
          [orderBy as string]: 'asc',
        },
      ];
    }
    const searchByName = customerFindManyInDto?.fullName;
    if (searchByName) {
      findManyWhere.where['fullName'] = {
        contains: searchByName.toLocaleLowerCase(),
        mode: 'insensitive',
      };
    }
    const cpf = customerFindManyInDto?.cpf;
    if (cpf) {
      findManyWhere.where['cpf'] = {
        contains: cpf.toString(),
      };
    }
    const status = customerFindManyInDto?.status;
    if (status === 'inactive') {
      findManyWhere.where['archivedAt'] = { not: null };
    } else {
      findManyWhere.where['archivedAt'] = null;
    }
    const startDate = customerFindManyInDto?.startDate;
    const endDate = customerFindManyInDto?.endDate;
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
      this.prismaService.customer.findMany({
        ...pagination,
        select,
        ...findManyWhere,
      }),
      this.prismaService.customer.count(findManyWhere),
    ]);

    return {
      total,
      data,
    };
  }

  async update({
    customerUpdateInDto,
    where,
    enterpriseId,
    select = GET_CUSTOMER,
    showNotFoundError,
  }: UpdateInput): Promise<Customer | null> {
    if (customerUpdateInDto.cpf) {
      await this.verifyDuplicated({
        cpf: customerUpdateInDto.cpf,
      });
    }

    const customerBeforeUpdate = await this.findOne({
      where: {
        archivedAt:
          customerUpdateInDto.archivedAt === null ? { not: null } : null,
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

    const { address, ...rest } = customerUpdateInDto;

    const updatePayload = {
      ...rest,
    };

    if (!customerBeforeUpdate?.id) {
      return null;
    }

    if (address?.remove) {
      if (!customerBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível remover, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        delete: true,
      };
    } else if (address?.update) {
      if (!customerBeforeUpdate.addressId) {
        throw new BadRequestException(
          'Não é possível editar, endereço não encontrado',
        );
      }
      updatePayload['address'] = {
        update: address.update,
      };
    } else if (address?.add) {
      if (customerBeforeUpdate.addressId) {
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

    const userAfterUpdate = await this.prismaService.customer.update({
      where: {
        id: customerBeforeUpdate.id,
      },
      data: updatePayload,
      select,
    });

    return userAfterUpdate;
  }

  async verifyDuplicated({ cpf, email }: VerifyDuplicatedInput) {
    await verifyDuplicated({
      properties: { cpf, email },
      getCallback: this.findOne.bind(this) as GetCallback,
    });
  }
}
