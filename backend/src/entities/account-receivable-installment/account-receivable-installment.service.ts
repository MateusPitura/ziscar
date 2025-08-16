import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountReceivableInstallment } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableInstallmentRepository } from 'src/repositories/account_receivable_installment-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountReceivableInstallmentService
  implements AccountReceivableInstallmentRepository {
  constructor(private prisma: PrismaService) { }

  async create(
    data: CreateInput<AccountReceivableInstallment>,
  ): Promise<AccountReceivableInstallment> {
    return this.prisma.accountReceivableInstallment.create({ data });
  }

  async findById(id: string): Promise<AccountReceivableInstallment | null> {
    const installment =
      await this.prisma.accountReceivableInstallment.findUnique({
        where: { id: Number(id) },
      });

    if (!installment) {
      throw new NotFoundException("Parcela a receber não encontrada");
    }

    return installment;
  }

  async update(
    id: string,
    data: UpdateInput<AccountReceivableInstallment>,
  ): Promise<void> {
    await this.prisma.accountReceivableInstallment.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.accountReceivableInstallment.delete({
      where: { id: Number(id) },
    });
  }
}
