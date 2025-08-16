import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { InstallmentStatus, PaymentMethodPayableType } from '@prisma/client';
import { AccountPayableService } from 'src/entities/account-payable/account-payable.service';
import { AccountPayableInstallmentService } from 'src/entities/account-payable-installment/account-payable-installment.service';
import { PaymentMethodPayableService } from 'src/entities/payment-method-payable/payment-method-payable.service';
import { VehicleExpenseService } from 'src/entities/vehicle-expense/vehicle-expense.service';
import {
  InsertVehicleExpenseRequestDto,
  InsertVehicleExpenseResponseDto,
} from '../dtos';

@Injectable()
export class InsertExpenseUseCase {
  constructor(
    private prisma: PrismaService,
    private accountPayableService: AccountPayableService,
    private accountPayableInstallmentService: AccountPayableInstallmentService,
    private paymentMethodPayableService: PaymentMethodPayableService,
    private vehicleExpenseService: VehicleExpenseService,
  ) {}

  async execute(
    input: InsertVehicleExpenseRequestDto,
    userId: number,
  ): Promise<InsertVehicleExpenseResponseDto> {
    const {
      category,
      description,
      paidTo,
      vehicleId,
      observations,
      installments,
    } = input;
    let vehicleExpenseId: number;

    await this.prisma.transaction(async () => {
      const accountPayable = await this.accountPayableService.create({
        description,
        paidTo,
      });

      await Promise.all(
        installments.map(async (installment, index) => {
          const accountPayableInstallment =
            await this.accountPayableInstallmentService.create({
              accountPayableId: accountPayable.id,
              installmentSequence: index + 1,
              dueDate: installment.dueDate,
              value: installment.value,
              status: InstallmentStatus.PENDING,
              isUpfront: installment.isUpfront ?? false,
              isRefund: false,
              refundAccountPayableInstallmentId: null,
            });

          if (installment.paymentMethods) {
            await Promise.all(
              installment.paymentMethods.map((paymentMethod) =>
                this.paymentMethodPayableService.create({
                  accountPayableInstallmentId: accountPayableInstallment.id,
                  type: paymentMethod.type as PaymentMethodPayableType,
                  value: paymentMethod.value,
                  paymentDate: paymentMethod.paymentDate,
                  userId,
                }),
              ),
            );
          }
        }),
      );

      const createdVehicleExpense = await this.vehicleExpenseService.create({
        vehicleId,
        category,
        observations: observations,
        accountPayableId: accountPayable.id,
        userId,
      });

      vehicleExpenseId = createdVehicleExpense.id;
    });

    return { id: vehicleExpenseId! };
  }
}
