import { Injectable } from '@nestjs/common';
import { OrganizationCreateInDtoInputs } from './organization.schema';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GetCallback, Transaction } from '../types';
import { verifyDuplicated } from '../utils/verifyDuplicated';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    organizationCreateInDto: OrganizationCreateInDtoInputs,
    transaction?: Transaction,
  ) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({ cnpj: organizationCreateInDto.cnpj });

    const organization = await database.organization.create({
      data: {
        ...organizationCreateInDto,
      },
    });

    return {
      organizationId: organization.id,
    };
  }

  async findOne(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
    select: Prisma.OrganizationSelect,
  ) {
    return await this.prismaService.organization.findFirst({
      where: organizationWhereUniqueInput,
      select,
    });
  }

  async verifyDuplicated(properties: Partial<Record<'cnpj', string>>) {
    await verifyDuplicated(properties, this.findOne.bind(this) as GetCallback);
  }
}
