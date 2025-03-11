import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GetCallback } from '../types';
import { verifyDuplicated } from '../utils/verifyDuplicated';
import {
  CreateInput,
  FindOneInput,
  VerifyDuplicatedInput,
} from './organization.type';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ organizationCreateInDto, transaction }: CreateInput) {
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

  async findOne({ where, select, onlyActive = true }: FindOneInput) {
    if (onlyActive) {
      where['isActive'] = true;
    }
    const organization = await this.prismaService.organization.findFirst({
      where: where,
      select,
    });
    if (onlyActive && !organization) {
      throw new NotFoundException('Organização não encontrada');
    }
    return organization;
  }

  async verifyDuplicated({ cnpj }: VerifyDuplicatedInput) {
    await verifyDuplicated({
      properties: { cnpj },
      getCallback: this.findOne.bind(this) as GetCallback,
    });
  }
}
