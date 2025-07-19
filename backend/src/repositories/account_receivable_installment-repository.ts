import { AccountReceivableInstallment } from "@prisma/client";

export interface CreateAccountReceivableInstallment { }

export interface UpdateAccountReceivableInstallment { }


export abstract class AccountReceivableInstallmentRepository {
    abstract create(data: CreateAccountReceivableInstallment): Promise<AccountReceivableInstallment>;
    abstract findById(id: string): Promise<AccountReceivableInstallment | null>;
    abstract update(id: string, data: UpdateAccountReceivableInstallment): Promise<void>;
    abstract delete(id: string): Promise<void>
}