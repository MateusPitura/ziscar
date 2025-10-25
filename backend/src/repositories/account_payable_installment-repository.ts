import {
  AccountPayableInstallment,
  PaymentMethodPayableType,
} from '@prisma/client';
import { CreateInput } from 'src/types';

export interface createPaymentMethodToInstallment {
  type: PaymentMethodPayableType;
  paymentDate: string;
  value?: number;
  userId?: number;
}

export abstract class AccountPayableInstallmentRepository {
  abstract create(
    data: CreateInput<AccountPayableInstallment>,
  ): Promise<AccountPayableInstallment>;
  abstract addPaymentMethodToInstallment(
    id: string,
    data: createPaymentMethodToInstallment,
    enterpriseId: number,
  ): Promise<AccountPayableInstallment>;
  abstract findAllByAccountPayableId(
    accountPayableId: string,
    enterpriseId: number,
  ): Promise<AccountPayableInstallment[]>;
}
