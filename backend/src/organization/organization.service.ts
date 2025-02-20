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
    await this.verifyCnpj(organizationCreateInDto.cnpj);

    return await this.databaseService.tx.organization.create({
      data: {
        ...organizationCreateInDto,
      },
    });
  }

  async verifyCnpj(cnpj: string) {
    const cnpjAlreadyExist = await this.findUniqueOrganization({
      cnpj,
    });

    if (cnpjAlreadyExist) {
      throw new ConflictException(`CNPJ '${cnpj}' already exists`);
    }
  }

  async findUniqueOrganization(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
  ) {
    return await this.databaseService.tx.organization.findUnique({
      where: organizationWhereUniqueInput,
    });
  }
}
