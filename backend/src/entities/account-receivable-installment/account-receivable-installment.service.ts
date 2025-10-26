import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountReceivableInstallment } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountReceivableInstallmentRepository,
  createPaymentMethodToInstallment,
} from 'src/repositories/account_receivable_installment-repository';
import { CreateInput } from 'src/types';

@Injectable()
export class AccountReceivableInstallmentService
  implements AccountReceivableInstallmentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<AccountReceivableInstallment>,
  ): Promise<AccountReceivableInstallment> {
    return this.prisma.accountReceivableInstallment.create({ data });
  }

  async addPaymentMethodToInstallment(
    installmentId: string,
    data: createPaymentMethodToInstallment,
    enterpriseId: number,
  ): Promise<AccountReceivableInstallment> {
    const installment =
      await this.prisma.accountReceivableInstallment.findUnique({
        where: {
          accountReceivable: {
            enterpriseId,
          },
          id: Number(installmentId),
        },
        include: {
          paymentMethodReceivables: true,
        },
      });

    if (!installment) {
      throw new NotFoundException('Parcela a receber não encontrada');
    }

    // Verificar se userId foi fornecido
    if (!data.userId) {
      throw new BadRequestException('UserId é obrigatório');
    }

    if (installment.paymentMethodReceivables.length > 0) {
      throw new ConflictException(
        'Esta parcela já possui um método de pagamento',
      );
    }

    const updatedInstallment =
      await this.prisma.accountReceivableInstallment.update({
        where: {
          id: Number(installmentId),
          accountReceivable: {
            enterpriseId,
          },
        },
        data: {
          status: 'PAID',
          paymentMethodReceivables: {
            create: {
              type: data.type,
              paymentDate: new Date(data.paymentDate),
              value: installment.value,
              userId: Number(data.userId), // Converter para number
            },
          },
        },
        include: {
          paymentMethodReceivables: true,
        },
      });

    return updatedInstallment;
  }

  async findAllByAccountReceivableId(
    accountReceivableId: string,
    enterpriseId: number,
  ) {
    const installments =
      await this.prisma.accountReceivableInstallment.findMany({
        where: {
          accountReceivable: {
            enterpriseId,
            id: Number(accountReceivableId),
          },
        },
        include: {
          paymentMethodReceivables: true,
        },
        orderBy: {
          installmentSequence: 'asc',
        },
      });

    if (!installments || installments.length === 0) {
      throw new NotFoundException(
        'Nenhuma parcela a receber encontrada para esta conta a receber',
      );
    }

    return installments.map((i) => ({
      id: i.id,
      dueDate: i.dueDate.toISOString().split('T')[0],
      installmentSequence: i.isUpfront ? 0 : i.installmentSequence,
      status: i.status,
      value: i.value,
      isRefund: false,
      isUpfront: i.isUpfront,
      paymentMethodReceivables: i.paymentMethodReceivables,
    }));
  }
}
