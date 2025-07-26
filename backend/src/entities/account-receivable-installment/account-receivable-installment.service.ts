import { Injectable } from "@nestjs/common";
import { AccountReceivableInstallment } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AccountReceivableInstallmentRepository } from "src/repositories/account_receivable_installment-repository";
import { CreateInput, UpdateInput } from "src/types";


@Injectable()
export class AccountReceivableInstallmentService implements AccountReceivableInstallmentRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<AccountReceivableInstallment>): Promise<AccountReceivableInstallment> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<AccountReceivableInstallment | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateInput<AccountReceivableInstallment>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}