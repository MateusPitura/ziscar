import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountReceivable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountReceivableRepository, SearchRequest, SearchResponse, SearchResponseItem } from 'src/repositories/account_receivable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
  constructor(private prisma: PrismaService) { }




  async create(data: CreateInput<AccountReceivable>): Promise<AccountReceivable> {
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

  async search(request: SearchRequest): Promise<SearchResponse> {
    const {
      page,
      limit,
      startDate,
      endDate,
      overallStatus,
      orderBy
    } = request;

    // Construir filtros de data
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = startDate;
    }
    if (endDate) {
      dateFilter.lte = endDate;
    }

    // Construir filtros where
    const where: any = {
      archivedAt: null, // apenas contas não arquivadas
    };

    // Filtro de data no createdAt
    if (Object.keys(dateFilter).length > 0) {
      where.createdAt = dateFilter;
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Construir orderBy
    let prismaOrderBy: any = {};
    if (orderBy) {
      // Assumindo que orderBy vem como string simples (ex: "description")
      // Se você quiser suportar ordenação desc, pode vir como "description:desc"
      const [field, direction = 'asc'] = orderBy.split(':');
      prismaOrderBy[field] = direction;
    } else {
      prismaOrderBy = { createdAt: 'desc' }; // ordenação padrão
    }

    // Buscar contas a receber com suas parcelas
    const [accountsReceivable, total] = await Promise.all([
      this.prisma.accountReceivable.findMany({
        where,
        include: {
          accountReceivableInstallments: {
            where: {
              archivedAt: null,
            },
            select: {
              value: true,
              status: true,
            },
          },
        },
        orderBy: prismaOrderBy,
        skip,
        take: limit,
      }),

      // Contar total para paginação
      this.prisma.accountReceivable.count({
        where,
      })
    ]);

    // Processar dados para calcular totalValue e overallStatus
    const data: SearchResponseItem[] = accountsReceivable
      .map(account => {
        // Calcular valor total das parcelas
        const totalValue = account.accountReceivableInstallments.reduce(
          (sum, installment) => sum + installment.value,
          0
        );

        // Determinar status geral
        // PAID se todas as parcelas estão PAID, senão PENDING
        const allInstallmentsPaid = account.accountReceivableInstallments.length > 0 &&
          account.accountReceivableInstallments.every(
            installment => installment.status === 'PAID'
          );

        const calculatedOverallStatus: 'PAID' | 'PENDING' =
          allInstallmentsPaid ? 'PAID' : 'PENDING';

        return {
          id: account.id,
          description: account.description || '',
          receivedFrom: account.receivedFrom || '',
          totalValue: totalValue.toString(), // convertendo para string em centavos
          overallStatus: calculatedOverallStatus,
        };
      })
      // Filtrar por overallStatus se especificado
      .filter(account => {
        if (!overallStatus) return true;
        return account.overallStatus === overallStatus;
      });

    return {
      total: overallStatus ? data.length : total, // ajustar total se filtrado por status
      data,
    };
  }


  async findByInstallmentId(installmentId: string): Promise<AccountReceivable | null> {
    const accountReceivable = await this.prisma.accountReceivable.findFirst({
      where: {
        accountReceivableInstallments: {
          some: {
            id: Number(installmentId)
          }
        }
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
          }
        },
        vehicleSales: {
          select: {
            id: true
          }
        }
      },
    });

    if (!accountReceivable) {
      throw new NotFoundException('Parcela da conta a receber não encontrada');
    }

    return accountReceivable;
  }






  async update(id: string, data: UpdateInput<AccountReceivable>): Promise<void> {
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
