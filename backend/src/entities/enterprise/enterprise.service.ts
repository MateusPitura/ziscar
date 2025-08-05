import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateInput } from './enterprise.type';

@Injectable()
export class EnterpriseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    const enterprise = await database.enterprise.create({
      data: {},
    });

    return { enterpriseId: enterprise.id };
  }
}
