import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  InstallmentStatus,
  PaymentMethodReceivableType,
  VehicleStatus,
} from '@prisma/client';
import { AccountReceivableService } from 'src/entities/account-receivable/account-receivable.service';
import { AccountReceivableInstallmentService } from 'src/entities/account-receivable-installment/account-receivable-installment.service';
import { PaymentMethodReceivableService } from 'src/entities/payment-method-receivable/payment-method-receivable.service';
import { AccountPayableService } from 'src/entities/account-payable/account-payable.service';
import { VehicleService } from '../vehicle.service';
import { CustomerService } from 'src/entities/customer/customer.service';
import { MakeVehicleSaleRequestDto, MakeVehicleSaleResponseDto } from '../dtos';
import { deepClone } from 'src/utils/deepClone';
import { UserService } from 'src/entities/user/user.service';
import { AccountPayableInstallmentService } from 'src/entities/account-payable-installment/account-payable-installment.service';

@Injectable()
export class MakeSaleUseCase {
  constructor(
    private prisma: PrismaService,
    private accountReceivableService: AccountReceivableService,
    private accountReceivableInstallmentService: AccountReceivableInstallmentService,
    private paymentMethodReceivableService: PaymentMethodReceivableService,
    private accountPayableService: AccountPayableService,
    private accountPayableInstallmentService: AccountPayableInstallmentService,
    private vehicleService: VehicleService,
    private customerService: CustomerService,
    private userService: UserService,
  ) {}

  async execute(
    input: MakeVehicleSaleRequestDto,
    userId: number,
  ): Promise<MakeVehicleSaleResponseDto> {
    const {
      vehicleId,
      customerId,
      date,
      commissionValue,
      accountReceivable,
      installments,
    } = input;
    let vehicleSaleId: number;

    await this.prisma.$transaction(async (prisma) => {
      const [vehicle, customer, user] = await Promise.all([
        this.vehicleService.findById(vehicleId),
        this.customerService.findUnique(Number(customerId)),
        this.userService.findUnique(userId),
      ]);

      if (!user) throw new NotFoundException('User not found');
      if (!vehicle) throw new NotFoundException('Vehicle not found');
      if (!customer) throw new NotFoundException('Customer not found');

      // Verificar outras regras de negocio, como status inválido para venda,etc

      let updatedVehicle = vehicle;
      if (vehicle.commissionValue !== commissionValue) {
        updatedVehicle = await this.vehicleService.update(String(vehicleId), {
          commissionValue,
        });
      }

      const createdAccountReceivable =
        await this.accountReceivableService.create({
          description: accountReceivable.description,
          receivedFrom: accountReceivable.receivedFrom,
        });

      await this.createInstallments(
        installments,
        createdAccountReceivable.id,
        Number(vehicleId),
        userId,
      );

      const createdCommissionAccountPayable =
        await this.accountPayableService.create({
          description: `Comissão da venda do ${updatedVehicle.modelName} ${updatedVehicle.modelYear}`,
          paidTo: user?.fullName,
        });

      await this.accountPayableInstallmentService.create({
        accountPayableId: createdCommissionAccountPayable.id,
        installmentSequence: 1,
        dueDate: date,
        value: commissionValue,
        status: InstallmentStatus.PENDING,
        isUpfront: true,
        isRefund: false,
        refundAccountPayableInstallmentId: null,
      });

      await this.vehicleService.update(String(vehicleId), {
        status: VehicleStatus.SOLD,
      });

      const vehicleSale = await prisma.vehicleSale.create({
        data: {
          date,
          customerId: Number(customerId),
          userId,
          vehicleId: Number(vehicleId),
          accountReceivableId: createdAccountReceivable.id,
          accountPayableId: createdCommissionAccountPayable.id,
          vehicleSnapshot: deepClone(updatedVehicle),
          customerSnapshot: deepClone(customer),
        },
      });

      vehicleSaleId = vehicleSale.id;
    });

    return { id: vehicleSaleId! };
  }

  private async createInstallments(
    installments: MakeVehicleSaleRequestDto['installments'],
    accountReceivableId: number,
    vehicleId: number,
    userId: number,
  ): Promise<void> {
    await Promise.all(
      installments.map(async (installment, index) => {
        const accountReceivableInstallment =
          await this.accountReceivableInstallmentService.create({
            accountReceivableId,
            installmentSequence: index + 1,
            dueDate: installment.dueDate,
            value: installment.value,
            status: InstallmentStatus.PENDING,
            isUpfront: installment.isUpfront ?? false,
            isRefund: false,
            refundAccountReceivableInstallmentId: null,
          });

        if (installment.paymentMethods) {
          await Promise.all(
            installment.paymentMethods.map((paymentMethod) =>
              this.paymentMethodReceivableService.create({
                accountReceivableInstallmentId: accountReceivableInstallment.id,
                type: paymentMethod.type as PaymentMethodReceivableType,
                value: paymentMethod.value,
                paymentDate: paymentMethod.paymentDate,
                vehicleId,
                userId,
              }),
            ),
          );
        }
      }),
    );
  }
}
