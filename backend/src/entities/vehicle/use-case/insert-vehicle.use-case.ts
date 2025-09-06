import { Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { InsertVehicleRequestDto, InsertVehicleResponseDto } from '../dtos';
import { AccountPayableService } from 'src/entities/account-payable/account-payable.service';
import { AccountPayableInstallmentService } from 'src/entities/account-payable-installment/account-payable-installment.service';
import { PaymentMethodPayableService } from 'src/entities/payment-method-payable/payment-method-payable.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { InstallmentStatus, PaymentMethodPayableType } from '@prisma/client';

@Injectable()
export class InsertVehicleUseCase {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly accountPayableService: AccountPayableService,
    private readonly accountPayableInstallmentService: AccountPayableInstallmentService,
    private readonly paymentMethodPayableService: PaymentMethodPayableService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: InsertVehicleRequestDto,
    userId: number,
  ): Promise<InsertVehicleResponseDto> {
    const { characteristics, payment, ...vehicleInputData } = input;

    let vehicleId: number;

    await this.prisma.$transaction(async () => {
      const vehicle = await this.vehicleService.create(vehicleInputData);
      vehicleId = vehicle.id;

      if (characteristics?.length) {
        await this.vehicleService.insertCharacteristics(
          vehicleId,
          characteristics,
        );
      }

      if (payment) {
        const description = `Compra Veículo ${vehicle.plateNumber}`;

        const createdAccountPayable = await this.accountPayableService.create({
          description,
          paidTo: payment.paidTo,
        });

        await this.createInstallments(
          payment.installments || [],
          createdAccountPayable.id,
          userId,
        );

        await this.vehicleService.createPurchase({
          date: payment.purchaseDate,
          userId,
          vehicleId,
          accountPayableId: createdAccountPayable.id,
        });
      }
    });

    return { id: vehicleId! };
  }

  private async createInstallments(
    installments: NonNullable<
      InsertVehicleRequestDto['payment']
    >['installments'],
    accountPayableId: number,
    userId: number,
  ): Promise<void> {
    if (!installments) return;

    await Promise.all(
      installments.map(async (installment, index) => {
        const accountPayableInstallment =
          await this.accountPayableInstallmentService.create({
            accountPayableId,
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
  }
}
