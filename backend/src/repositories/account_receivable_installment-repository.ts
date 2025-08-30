import {
  AccountReceivableInstallment,
  PaymentMethodReceivableType,
} from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

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
  vehicleSaleId: number; // id da venda
}

export abstract class AccountReceivableInstallmentRepository {
  abstract create(
    data: CreateInput<AccountReceivableInstallment>,
  ): Promise<AccountReceivableInstallment>;
  abstract addPaymentMethodToInstallment(
    installmentId: string,
    data: createPaymentMethodToInstallment,
  ): Promise<AccountReceivableInstallment>;
  abstract findById(id: string): Promise<AccountReceivableInstallment | null>;
  abstract findAllByAccountReceivableId(
    accountReceivableId: string,
    dueDate: Date,
  ): Promise<AccountReceivableInstallmentPayload[]>;
  abstract findPaymentMethodByInstallmentId(
    installmentId: string,
  ): Promise<AccountReceivableInstallment | null>;
  abstract update(
    id: string,
    data: UpdateInput<AccountReceivableInstallment>,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
