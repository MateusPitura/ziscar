import { AccountPayableInstallment } from "@prisma/client";

export interface CreateAccountPayableInstallment { }

export interface UpdateAccountPayableInstallment { }


export abstract class AccountPayableInstallmentRepository {
    abstract create(data: CreateAccountPayableInstallment): Promise<AccountPayableInstallment>;
    abstract findById(id: string): Promise<AccountPayableInstallment | null>;
    abstract update(id: string, data: UpdateAccountPayableInstallment): Promise<void>;
    abstract delete(id: string): Promise<void>
}