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
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AccountPayableInstallmentService
  implements AccountPayableInstallmentRepository {
  constructor(private prisma: PrismaService) { }

  async addPaymentMethodToInstallment(
    id: string,
    data: createPaymentMethodToInstallment, // { type, paymentDate, value, userId }
  ): Promise<AccountPayableInstallment> {
    // 1️⃣ Verifica se a parcela existe
    const installment = await this.prisma.accountPayableInstallment.findUnique({
      where: { id: Number(id) },
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
        where: { id: Number(id) },

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
  ): Promise<AccountPayableInstallment[]> {
    return this.prisma.accountPayableInstallment.findMany({
      where: {
        accountPayableId: Number(accountPayableId),
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

  async findById(id: string): Promise<AccountPayableInstallment | null> {
    const installment = await this.prisma.accountPayableInstallment.findUnique({
      where: { id: Number(id) },
    });

    if (!installment) {
      throw new NotFoundException('Parcela não encontrada.');
    }

    return installment;
  }

  // async addPaymentMethodToInstallment(
  //   id: string,
  //   data: createPaymentMethodToInstallment,
  // ): Promise<void> {
  //   const installment =
  //     await this.prisma.accountPayableInstallment.findUnique({
  //       where: {
  //         id: Number(id),
  //       },
  //       include: {
  //         paymentMethodPayables: true,
  //       },
  //     });

  //   if (!installment) {
  //     throw new NotFoundException('Parcela a receber não encontrada');
  //   }

  //   if (installment.paymentMethodPayables.length > 0) {
  //     throw new ConflictException(
  //       'Esta parcela já possui um método de pagamento',
  //     );
  //   }

  //   const updatedInstallment =
  //     await this.prisma.accountPayableInstallment.update({
  //       where: {
  //         id: Number(id),
  //       },
  //       data: {
  //         status: 'PAID',
  //         paymentMethodPayables: {
  //           create: {
  //             type: data.type,
  //             paymentDate: new Date(data.paymentDate),
  //             value: installment.value,
  //           }
  //         },
  //       },
  //       include: {
  //         paymentMethodPayables: true,
  //       },
  //     });
  // }

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
