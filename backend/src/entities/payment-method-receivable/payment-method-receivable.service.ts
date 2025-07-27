/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

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
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<PaymentMethodReceivable | null> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    data: UpdateInput<PaymentMethodReceivable>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
