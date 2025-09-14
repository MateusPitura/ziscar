import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountPayable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountPayableRepository,
  FindByIdResponse,
  SearchResponse,
} from 'src/repositories/account_payable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountPayableService implements AccountPayableRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<AccountPayable>): Promise<AccountPayable> {
    return this.prisma.accountPayable.create({ data });
  }
  async findById(id: string): Promise<FindByIdResponse> {
    // 1️⃣ Buscar a conta a pagar com os installments
    const accountPayable = await this.prisma.accountPayable.findUnique({
      where: { id: Number(id) },
      include: {
        accountPayableInstallments: true, // garante que pegamos todas as parcelas
      },
    });

    if (!accountPayable) {
      throw new NotFoundException('Conta a pagar não encontrada.');
    }

    // 2️⃣ Calcular totalValue somando os valores das parcelas
    const totalValue = accountPayable.accountPayableInstallments.reduce(
      (sum, installment) => sum + installment.value,
      0,
    );

    // 3️⃣ Calcular overallStatus
    // Se todas as parcelas forem PAID → PAID, caso contrário → PENDING
    const overallStatus = accountPayable.accountPayableInstallments.every(
      (installment) => installment.status === 'PAID',
    )
      ? 'PAID'
      : 'PENDING';

    // 4️⃣ Montar payload personalizado
    return {
      id: accountPayable.id,
      description: accountPayable.description,
      paidTo: accountPayable.paidTo,
      totalValue,
      overallStatus,
      installmentsNumber: accountPayable.accountPayableInstallments.length,
    };
  }

  async search(
    query: string,
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    overallStatus?: 'PENDING' | 'PAID',
  ): Promise<SearchResponse> {
    const accounts = await this.prisma.accountPayable.findMany({
      where: {
        description: {
          contains: query,
          mode: 'insensitive',
        },
        accountPayableInstallments: overallStatus
          ? overallStatus === 'PAID'
            ? {
                every: { status: 'PAID' }, // todas pagas
              }
            : overallStatus === 'PENDING'
              ? {
                  some: { status: 'PENDING' }, // pelo menos uma pendente
                }
              : undefined
          : undefined,
        createdAt: {
          gte: startDate,
          lte: endDate ?? new Date(),
        },
      },
      include: {
        accountPayableInstallments: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        description: 'asc',
      },
    });

    const total = await this.prisma.accountPayable.count({
      where: {
        accountPayableInstallments: overallStatus
          ? overallStatus === 'PAID'
            ? { every: { status: 'PAID' } }
            : overallStatus === 'PENDING'
              ? { some: { status: 'PENDING' } }
              : undefined
          : undefined,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const data = accounts.map((acc) => {
      const installments = acc.accountPayableInstallments;

      // soma do valor de todas as parcelas
      const totalValue = installments.reduce(
        (sum, inst) => sum + Number(inst.value),
        0,
      );

      // regra para definir overallStatus
      const allPaid = installments.every((inst) => inst.status === 'PAID');
      const overallStatus: 'PAID' | 'PENDING' = allPaid ? 'PAID' : 'PENDING';

      return {
        id: acc.id,
        description: acc.description ?? '',
        paidTo: acc.paidTo ?? '',
        totalValue,
        overallStatus,
      };
    });

    return {
      total,
      data,
    };
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
