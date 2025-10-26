import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountPayableInstallment } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  AccountPayableInstallmentRepository,
  createPaymentMethodToInstallment,
} from 'src/repositories/account_payable_installment-repository';
import { CreateInput } from 'src/types';

@Injectable()
export class AccountPayableInstallmentService
  implements AccountPayableInstallmentRepository
{
  constructor(private prisma: PrismaService) {}

  async addPaymentMethodToInstallment(
    id: string,
    data: createPaymentMethodToInstallment, // { type, paymentDate, value, userId }
    enterpriseId: number,
  ): Promise<AccountPayableInstallment> {
    // 1️⃣ Verifica se a parcela existe
    const installment = await this.prisma.accountPayableInstallment.findUnique({
      where: { id: Number(id), accountPayable: { enterpriseId } },
    });

    if (!installment) {
      throw new NotFoundException('Parcela a pagar não encontrada');
    }

    // 2️⃣ Adiciona o método de pagamento
    if (typeof data.userId !== 'number') {
      throw new ConflictException('userId é obrigatório e deve ser um número');
    }

    const updatedInstallment =
      await this.prisma.accountPayableInstallment.update({
        where: { id: Number(id), accountPayable: { enterpriseId } },

        data: {
          status: 'PAID',
          paymentMethodPayables: {
            create: {
              type: data.type,
              paymentDate: data.paymentDate
                ? new Date(data.paymentDate)
                : undefined,
              value: data.value ?? installment.value,
              userId: data.userId, // agora garantido como number
            },
          },
        },
        include: {
          paymentMethodPayables: true, // retorna todos os métodos de pagamento
        },
      });

    return updatedInstallment;
  }

  async findAllByAccountPayableId(
    accountPayableId: string,
    enterpriseId: number,
  ): Promise<AccountPayableInstallment[]> {
    return this.prisma.accountPayableInstallment.findMany({
      where: {
        accountPayable: {
          id: Number(accountPayableId),
          enterpriseId,
        },
      },
      include: {
        paymentMethodPayables: {
          select: {
            id: true,
            paymentDate: true,
            type: true,
          },
        },
      },
      orderBy: {
        installmentSequence: 'asc',
      },
    });
  }

  async create(
    data: CreateInput<AccountPayableInstallment>,
  ): Promise<AccountPayableInstallment> {
    return this.prisma.accountPayableInstallment.create({ data });
  }
}
