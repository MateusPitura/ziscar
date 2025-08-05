import { Injectable } from '@nestjs/common';
import { AccountPayable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountPayableRepository } from 'src/repositories/account_payable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountPayableService implements AccountPayableRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateInput<AccountPayable>): Promise<AccountPayable> {
    return this.prisma.accountPayable.create({ data });
  }
  async findById(id: string): Promise<AccountPayable | null> {
    const accountPayable = await this.prisma.accountPayable.findUnique({
      where: { id: Number(id) },
    });

    if (!accountPayable) {
      return null;
    }

    return accountPayable;
  }
  async update(id: string, data: UpdateInput<AccountPayable>): Promise<void> {
    await this.prisma.accountPayable.update({
      where: { id: Number(id) },
      data,
    });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.accountPayable.delete({
      where: { id: Number(id) },
    });
  }
}
