/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { AccountPayableInstallment } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableInstallmentRepository } from 'src/repositories/account_payable_installment-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountPayableInstallmentService
  implements AccountPayableInstallmentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<AccountPayableInstallment>,
  ): Promise<AccountPayableInstallment> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<AccountPayableInstallment | null> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    data: UpdateInput<AccountPayableInstallment>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
