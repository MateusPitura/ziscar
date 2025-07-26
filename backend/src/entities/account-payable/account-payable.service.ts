import { Injectable } from '@nestjs/common';
import { AccountPayable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableRepository } from 'src/repositories/account_payable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountPayableService implements AccountPayableRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateInput<AccountPayable>): Promise<AccountPayable> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<AccountPayable | null> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, data: UpdateInput<AccountPayable>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
