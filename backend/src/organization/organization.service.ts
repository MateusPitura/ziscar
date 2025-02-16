import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrganizationCreateInDto } from './organization.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(organizationCreateInDto: OrganizationCreateInDto) {
    const cnpjAlreadyExist = await this.findUniqueOrganization({
      cnpj: organizationCreateInDto.cnpj,
    });

    if (cnpjAlreadyExist) {
      throw new ConflictException(
        `CNPJ '${organizationCreateInDto.cnpj}' already exists`,
      );
    }

    return await this.prismaService.organization.create({
      data: {
        ...organizationCreateInDto,
      },
    });
  }

  async findUniqueOrganization(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
  ) {
    return await this.prismaService.organization.findUnique({
      where: organizationWhereUniqueInput,
    });
  }
}
