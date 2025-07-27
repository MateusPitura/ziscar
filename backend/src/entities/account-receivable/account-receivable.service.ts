/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { AccountReceivable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableRepository } from 'src/repositories/account_receivable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<AccountReceivable>,
  ): Promise<AccountReceivable> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<AccountReceivable | null> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    data: UpdateInput<AccountReceivable>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
