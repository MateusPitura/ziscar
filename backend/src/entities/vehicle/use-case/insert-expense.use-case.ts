import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ExpenseCategory, PaymentMethodPayableType } from '@prisma/client';
import type {
  InsertVehicleExpenseRequestDto,
  InsertVehicleExpenseResponseDto,
} from '../dtos';

@Injectable()
export class InsertExpenseUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(
    input: InsertVehicleExpenseRequestDto,
    userId: number,
  ): Promise<InsertVehicleExpenseResponseDto> {
    let vehicleExpenseId: number;

    await this.prisma.transaction(async (tx) => {
      const accountPayable = await tx.accountPayable.create({
        data: {
          description: input.description,
          paidTo: input.paidTo,
        },
      });

      const vehicleExpense = await tx.vehicleExpense.create({
        data: {
          vehicleId: input.vehicleId,
          category: input.category as ExpenseCategory,
          observations: input.observations,
          accountPayableId: accountPayable.id,
          userId,
        },
      });

      vehicleExpenseId = vehicleExpense.id;

      for (let i = 0; i < input.installments.length; i++) {
        const installment = input.installments[i];

        const accountPayableInstallment =
          await tx.accountPayableInstallment.create({
            data: {
              accountPayableId: accountPayable.id,
              installmentSequence: i + 1,
              dueDate: installment.dueDate,
              value: installment.value,
              isUpfront: installment.isUpfront ?? false,
            },
          });

        if (installment.paymentMethods) {
          for (const paymentMethod of installment.paymentMethods) {
            await tx.paymentMethodPayable.create({
              data: {
                accountPayableInstallmentId: accountPayableInstallment.id,
                type: paymentMethod.type as PaymentMethodPayableType,
                value: paymentMethod.value,
                paymentDate: paymentMethod.paymentDate,
                userId,
              },
            });
          }
        }
      }
    });

    return { id: vehicleExpenseId! };
  }
}
