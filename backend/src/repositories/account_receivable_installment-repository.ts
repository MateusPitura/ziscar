import {
  AccountReceivableInstallment,
  PaymentMethodReceivableType,
} from '@prisma/client';
import { CreateInput } from 'src/types';

export interface createPaymentMethodToInstallment {
  type: PaymentMethodReceivableType;
  paymentDate: string;
  value?: number;
  userId?: number;
}

export interface AccountReceivableInstallmentPayload {
  id: number;
  dueDate: string; // já formatado YYYY-MM-DD
  installmentSequence: number; // 0 se isUpfront for true
  status: string; // ou InstallmentStatus se você quiser manter o enum
  value: number; // em centavos
  isRefund: boolean;
  isUpfront: boolean;
}

export abstract class AccountReceivableInstallmentRepository {
  abstract create(
    data: CreateInput<AccountReceivableInstallment>,
  ): Promise<AccountReceivableInstallment>;
  abstract addPaymentMethodToInstallment(
    installmentId: string,
    data: createPaymentMethodToInstallment,
    enterpriseId: number,
  ): Promise<AccountReceivableInstallment>;
  abstract findAllByAccountReceivableId(
    accountReceivableId: string,
    enterpriseId: number,
  ): Promise<AccountReceivableInstallmentPayload[]>;
}
