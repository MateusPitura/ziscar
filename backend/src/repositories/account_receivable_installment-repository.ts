import { AccountReceivableInstallment } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class AccountReceivableInstallmentRepository {
    abstract create(data: CreateInput<AccountReceivableInstallment>): Promise<AccountReceivableInstallment>;
    abstract findById(id: string): Promise<AccountReceivableInstallment | null>;
    abstract update(id: string, data: UpdateInput<AccountReceivableInstallment>): Promise<void>;
    abstract delete(id: string): Promise<void>
}