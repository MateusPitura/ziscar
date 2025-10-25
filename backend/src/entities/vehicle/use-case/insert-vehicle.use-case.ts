import { Injectable } from '@nestjs/common';
import { InstallmentStatus, PaymentMethodPayableType } from '@prisma/client';
import { max } from 'date-fns';
import { AccountPayableInstallmentService } from 'src/entities/account-payable-installment/account-payable-installment.service';
import { AccountPayableService } from 'src/entities/account-payable/account-payable.service';
import { PaymentMethodPayableService } from 'src/entities/payment-method-payable/payment-method-payable.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { InsertVehicleRequestDto, InsertVehicleResponseDto } from '../dtos';
import { VehicleService } from '../vehicle.service';
import { ValidateVehicleUniqueFieldsUseCase } from './validate-vehicle-unique-fields.use-case';
import { StoreService } from 'src/entities/store/store.service';

@Injectable()
export class InsertVehicleUseCase {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly accountPayableService: AccountPayableService,
    private readonly accountPayableInstallmentService: AccountPayableInstallmentService,
    private readonly paymentMethodPayableService: PaymentMethodPayableService,
    private readonly validateVehicleUniqueFieldsUseCase: ValidateVehicleUniqueFieldsUseCase,
    private readonly prisma: PrismaService,
    private readonly storeService: StoreService,
  ) {}

  async execute(
    input: InsertVehicleRequestDto,
    userId: number,
    enterpriseId: number,
  ): Promise<InsertVehicleResponseDto> {
    const { characteristics, payment, ...vehicleInputData } = input;

    await this.storeService.findOne({
      select: { id: true },
      enterpriseId,
      where: { id: vehicleInputData.storeId },
    });

    await this.validateVehicleUniqueFieldsUseCase.execute({
      chassiNumber: vehicleInputData.chassiNumber,
      plateNumber: vehicleInputData.plateNumber,
    });

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
          enterpriseId,
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
      installments.map(async (installment) => {
        const accountPayableInstallment =
          await this.accountPayableInstallmentService.create({
            accountPayableId,
            installmentSequence: installment.installmentSequence,
            dueDate: installment.paymentMethods
              ? max(installment.paymentMethods.map((pm) => pm.paymentDate))
              : installment.dueDate,
            value: installment.value,
            status: installment.paymentMethods
              ? InstallmentStatus.PAID
              : InstallmentStatus.PENDING,
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
