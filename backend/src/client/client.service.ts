import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {
  constructor(
    private readonly databaseService: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create() {
    return await this.databaseService.tx.client.create({
      data: {},
    });
  }
}
