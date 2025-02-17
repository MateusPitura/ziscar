import { ConflictException, Injectable } from '@nestjs/common';
import { OrganizationCreateInDto } from './organization.dto';
import { Prisma } from '@prisma/client';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(organizationCreateInDto: OrganizationCreateInDto) {
    const cnpjAlreadyExist = await this.findUniqueOrganization({
      cnpj: organizationCreateInDto.cnpj,
    });

    if (cnpjAlreadyExist) {
      throw new ConflictException(
        `CNPJ '${organizationCreateInDto.cnpj}' already exists`,
      );
    }

    return await this.databaseService.tx.organization.create({
      data: {
        ...organizationCreateInDto,
      },
    });
  }

  async findUniqueOrganization(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
  ) {
    return await this.databaseService.tx.organization.findUnique({
      where: organizationWhereUniqueInput,
    });
  }
}
