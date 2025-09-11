import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountReceivable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountReceivableRepository,
  SearchRequest,
  SearchResponse,
  SearchResponseItem,
} from 'src/repositories/account_receivable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
  constructor(private prisma: PrismaService) { }




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


  async search(page: number, limit: number, startDate: Date, endDate: Date, overallStatus?: 'PENDING' | 'PAID', totalValue?: string): Promise<SearchResponse> {
    const accounts = await this.prisma.accountReceivable.findMany({
      where: {
        accountReceivableInstallments: overallStatus
          ? {
            every: {
              status: overallStatus
            }
          } // só filtra se veio status
          : undefined,
        createdAt: {
          gte: startDate,
          lte: endDate ?? new Date(),
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        description: 'asc'
      }
    })
    const total = await this.prisma.accountReceivable.count({
      where: {
        accountReceivableInstallments: overallStatus
          ? { every: { status: overallStatus } }
          : undefined,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });


    return { total, data: accounts }
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
