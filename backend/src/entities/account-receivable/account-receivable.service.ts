import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountReceivable, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountReceivableRepository,
  SearchResponse,
} from 'src/repositories/account_receivable-repository';
import { CreateInput } from 'src/types';

@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<AccountReceivable>,
  ): Promise<AccountReceivable> {
    return this.prisma.accountReceivable.create({ data });
  }

  async findById(
    id: string,
    enterpriseId: number,
  ): Promise<AccountReceivable | null> {
    const accountReceivable = await this.prisma.accountReceivable.findUnique({
      where: { id: Number(id), enterpriseId },
    });

    if (!accountReceivable) {
      throw new NotFoundException('Conta a receber não encontrada');
    }

    return accountReceivable;
  }

  async search(
    query: string,
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    enterpriseId: number,
    overallStatus?: 'PENDING' | 'PAID',
  ): Promise<SearchResponse> {
    let startDateFormatted: Date | undefined = undefined;
    if (startDate) {
      startDateFormatted = new Date(startDate);
      startDateFormatted.setHours(0, 0, 0, 0);
    }

    let endDateFormatted: Date | undefined = undefined;
    if (endDate) {
      endDateFormatted = new Date(endDate);
      endDateFormatted.setHours(23, 59, 59, 999);
    }

    const filter: Prisma.AccountReceivableWhereInput = {
      enterpriseId,
      createdAt: {
        gte: startDateFormatted,
        lte: endDateFormatted,
      },
      description: {
        contains: query,
        mode: 'insensitive',
      },
      accountReceivableInstallments: overallStatus
        ? overallStatus === 'PAID'
          ? { every: { status: 'PAID' } }
          : overallStatus === 'PENDING'
            ? { some: { status: 'PENDING' } }
            : undefined
        : undefined,
    };

    const [accounts, total, summaryByStatus] = await Promise.all([
      this.prisma.accountReceivable.findMany({
        where: filter,
        include: {
          accountReceivableInstallments: true,
          vehicleSales: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          description: 'asc',
        },
      }),
      await this.prisma.accountReceivable.count({
        where: filter,
      }),
      this.prisma.accountReceivableInstallment.groupBy({
        by: ['status'],
        _sum: {
          value: true,
        },
        where: {
          accountReceivable: {
            createdAt: filter.createdAt,
            description: filter.description,
            enterpriseId,
          },
        },
      }),
    ]);

    const totalPaid =
      summaryByStatus.find((s) => s.status === 'PAID')?._sum.value ?? 0;
    const totalPending =
      summaryByStatus.find((s) => s.status === 'PENDING')?._sum.value ?? 0;

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
      summary: {
        totalOverall: totalPaid + totalPending,
        totalPaid,
        totalPending,
      },
    };
  }
}
