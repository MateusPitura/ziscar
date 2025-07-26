import { Injectable } from '@nestjs/common';
import { PaymentMethodPayable } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PaymentMethodPayableRepository } from 'src/repositories/payment_method_payable-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class PaymentMethodPayableService
  implements PaymentMethodPayableRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateInput<PaymentMethodPayable>,
  ): Promise<PaymentMethodPayable> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<PaymentMethodPayable | null> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    data: UpdateInput<PaymentMethodPayable>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
