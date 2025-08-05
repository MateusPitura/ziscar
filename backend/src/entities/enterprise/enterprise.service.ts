import { Injectable } from '@nestjs/common';
import { CreateInput } from './enterprise.type';
import { PrismaService } from 'src/infra/database/prisma.service';

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
