import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.accountPayableInstallment.create({ data });
  }

  async findById(id: string): Promise<AccountPayableInstallment | null> {
    const installment = await this.prisma.accountPayableInstallment.findUnique({
      where: { id: Number(id) },
    });

    if (!installment) {
      throw new NotFoundException('Parcela não encontrada.');
    }

    return installment;
  }

  async update(
    id: string,
    data: UpdateInput<AccountPayableInstallment>,
  ): Promise<void> {
    await this.prisma.accountPayableInstallment.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.accountPayableInstallment.delete({
      where: { id: Number(id) },
    });
  }
}
