import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly databaseService: PrismaService) {}

  async create() {
    const client = await this.databaseService.client.create({
      data: {},
    });

    return { clientId: client.id };
  }
}
