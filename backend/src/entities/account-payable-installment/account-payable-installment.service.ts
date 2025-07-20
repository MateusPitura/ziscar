import { Injectable } from "@nestjs/common";
import { AccountPayableInstallment } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AccountPayableInstallmentRepository, CreateAccountPayableInstallment, UpdateAccountPayableInstallment } from "src/repositories/account_payable_installment-repository";

@Injectable()
export class AccountPayableInstallmentService implements AccountPayableInstallmentRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateAccountPayableInstallment): Promise<AccountPayableInstallment> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<AccountPayableInstallment | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateAccountPayableInstallment): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}