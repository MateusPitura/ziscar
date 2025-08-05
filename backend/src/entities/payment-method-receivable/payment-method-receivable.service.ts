import { Injectable } from '@nestjs/common';
import { PaymentMethodReceivable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaymentMethodReceivableRepository } from 'src/repositories/payment_method_receivable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class PaymentMethodReceivableService
  implements PaymentMethodReceivableRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<PaymentMethodReceivable>,
  ): Promise<PaymentMethodReceivable> {
    return this.prisma.paymentMethodReceivable.create({ data });
  }

  async findById(id: string): Promise<PaymentMethodReceivable | null> {
    const paymentMethodReceivable =
      await this.prisma.paymentMethodReceivable.findUnique({
        where: { id: Number(id) },
      });

    if (!paymentMethodReceivable) {
      return null;
    }

    return paymentMethodReceivable;
  }

  async update(
    id: string,
    data: UpdateInput<PaymentMethodReceivable>,
  ): Promise<void> {
    await this.prisma.paymentMethodReceivable.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.paymentMethodReceivable.delete({
      where: { id: Number(id) },
    });
  }
}
