import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Transaction } from '../types';

@Injectable()
export class ClientService {
  constructor(private readonly databaseService: PrismaService) {}

  async create(transaction: Transaction) {
    const database = transaction || this.databaseService;

    const client = await database.client.create({
      data: {},
    });

    return { clientId: client.id };
  }
}
