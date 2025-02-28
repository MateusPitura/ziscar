import { ConflictException, Injectable } from '@nestjs/common';
import { OrganizationCreateInDto } from './organization.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly databaseService: PrismaService) {}

  async create(organizationCreateInDto: OrganizationCreateInDto) {
    await this.verifyCnpj(organizationCreateInDto.cnpj);

    const organization = await this.databaseService.organization.create({
      data: {
        ...organizationCreateInDto,
      },
    });

    return {
      organizationId: organization.id,
    };
  }

  async verifyCnpj(cnpj: string) {
    const organization = await this.findOne(
      {
        cnpj,
      },
      { id: true },
    );

    if (organization) {
      throw new ConflictException(`CNPJ '${cnpj}' already exists`);
    }
  }

  async findOne(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
    select: Prisma.OrganizationSelect,
  ) {
    return await this.databaseService.organization.findUnique({
      where: organizationWhereUniqueInput,
      select,
    });
  }
}
