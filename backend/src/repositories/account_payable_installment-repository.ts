import { AccountPayableInstallment, PaymentMethodPayableType, PaymentMethodReceivableType } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';


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
  abstract findById(id: string): Promise<AccountPayableInstallment | null>;
  abstract addPaymentMethodToInstallment(id: string, data: createPaymentMethodToInstallment): Promise<AccountPayableInstallment>;

  abstract findAllByAccountPayableId(
    accountPayableId: string,
  ): Promise<AccountPayableInstallment[]>;

  abstract update(
    id: string,
    data: UpdateInput<AccountPayableInstallment>,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
