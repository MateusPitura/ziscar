import { Module } from '@nestjs/common';
// import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './infra/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './entities/email/email.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AccountPayableModule } from './entities/account-payable/account-payable.module';
import { AccountPayableInstallmentModule } from './entities/account-payable-installment/account-payable-installment.module';
import { AccountReceivableModule } from './entities/account-receivable/account-receivable.module';
import { AccountReceivableInstallmentModule } from './entities/account-receivable-installment/account-receivable-installment.module';
import { AddressModule } from './entities/address/address.module';
import { CityModule } from './entities/city/city.module';
import { CustomerModule } from './entities/customer/customer.module';
import { PaymentMethodPayableModule } from './entities/payment-method-payable/payment-method-payable.module';
import { PaymentMethodReceivableModule } from './entities/payment-method-receivable/payment-method-receivable.module';
import { PermissionModule } from './entities/permission/permission.module';
import { RoleModule } from './entities/role/role.module';
import { StoreModule } from './entities/store/store.module';
import { VehicleModule } from './entities/vehicle/vehicle.module';
import { VehicleBaseModule } from './entities/vehicle-base/vehicle-base.module';
import { VehicleBrandModule } from './entities/vehicle-brand/vehicle-brand.module';
import { VehicleCharacteristicValueModule } from './entities/vehicle-characteristic-value/vehicle-characteristic-value.module';
import { VehicleExpenseModule } from './entities/vehicle-expense/vehicle-expense.module';
import { VehiclePurchaseModule } from './entities/vehicle-purchase/vehicle-purchase.module';
import { VehicleSaleModule } from './entities/vehicle-sale/vehicle-sale.module';
// import { UserModule } from './entities/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // AuthModule,
    // UserModule,
    // DatabaseModule,
    // EmailModule,
    AccountPayableModule,
    AccountPayableInstallmentModule,
    AccountReceivableModule,
    AccountReceivableInstallmentModule,
    AddressModule,
    CityModule,
    CustomerModule,
    PaymentMethodPayableModule,
    PaymentMethodReceivableModule,
    PermissionModule,
    RoleModule,
    StoreModule,
    VehicleModule,
    VehicleBaseModule,
    VehicleBrandModule,
    VehicleCharacteristicValueModule,
    VehicleExpenseModule,
    VehiclePurchaseModule,
    VehicleSaleModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule { }
