import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationCreateInDto } from './organization.schema';
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

  async findOne(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
    select: Prisma.OrganizationSelect,
    onlyActive: boolean = true,
  ) {
    if (onlyActive) {
      organizationWhereUniqueInput['isActive'] = true;
    }
    const organization = await this.prismaService.organization.findFirst({
      where: organizationWhereUniqueInput,
      select,
    });
    if (onlyActive && !organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    return organization;
  }

  async verifyDuplicated(properties: Partial<Record<'cnpj', string>>) {
    await verifyDuplicated(properties, this.findOne.bind(this) as GetCallback);
  }
}
