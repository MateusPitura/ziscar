import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountReceivable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountReceivableRepository,
  SearchResponse,
} from 'src/repositories/account_receivable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<AccountReceivable>,
  ): Promise<AccountReceivable> {
    return this.prisma.accountReceivable.create({ data });
  }

  async findById(id: string): Promise<AccountReceivable | null> {
    const accountReceivable = await this.prisma.accountReceivable.findUnique({
      where: { id: Number(id) },
    });

    if (!accountReceivable) {
      throw new NotFoundException('Conta a receber não encontrada');
    }

    return accountReceivable;
  }

  async findByInstallmentId(
    installmentId: string,
  ): Promise<AccountReceivable | null> {
    const accountReceivable = await this.prisma.accountReceivable.findFirst({
      where: {
        accountReceivableInstallments: {
          some: {
            id: Number(installmentId),
          },
        },
      },
      include: {
        accountReceivableInstallments: {
          select: {
            id: true,
            dueDate: true,
            installmentSequence: true,
            status: true,
            value: true,
            isRefund: true,
            isUpfront: true,
          },
        },
        vehicleSales: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!accountReceivable) {
      throw new NotFoundException('Parcela da conta a receber não encontrada');
    }

    return accountReceivable;
  }

  async search(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    overallStatus?: 'PENDING' | 'PAID',
  ): Promise<SearchResponse> {
    const accounts = await this.prisma.accountReceivable.findMany({
      where: {
        accountReceivableInstallments: overallStatus
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
        accountReceivableInstallments: true,
        vehicleSales: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        description: 'asc',
      },
    });

    const total = await this.prisma.accountReceivable.count({
      where: {
        accountReceivableInstallments: overallStatus
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
      const installments = acc.accountReceivableInstallments;

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
        receivedFrom: acc.receivedFrom ?? '',
        totalValue,
        overallStatus,
        vehicleSaleId: acc.vehicleSales?.[0]?.id || null,
        date: acc.vehicleSales?.[0]?.date ?? null,
      };
    });

    return {
      total,
      data,
    };
  }

  async update(
    id: string,
    data: UpdateInput<AccountReceivable>,
  ): Promise<void> {
    await this.prisma.accountReceivable.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.accountReceivable.delete({
      where: { id: Number(id) },
    });
  }
}
