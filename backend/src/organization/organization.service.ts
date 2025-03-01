import { Injectable } from '@nestjs/common';
import { OrganizationCreateInDto } from './organization.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GetCallback, Transaction } from '../types';
import { verifyDuplicated } from '../utils/verifyDuplicated';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    organizationCreateInDto: OrganizationCreateInDto,
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

  async get(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
    select: Prisma.OrganizationSelect,
    transaction?: Transaction,
  ) {
    const database = transaction || this.prismaService;
    return await database.organization.findFirst({
      where: organizationWhereUniqueInput,
      select,
    });
  }

  async verifyDuplicated(
    properties: Partial<Record<'cnpj', string>>,
    transaction?: Transaction,
  ) {
    await verifyDuplicated(
      properties,
      this.get.bind(this) as GetCallback,
      transaction,
    );
  }
}
