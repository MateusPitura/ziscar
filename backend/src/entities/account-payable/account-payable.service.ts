import { Injectable } from "@nestjs/common";
import { AccountPayable } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AccountPayableRepository, CreateAccountPayable, UpdateAccountPayable } from "src/repositories/account_payable-repository";

@Injectable()
export class AccountPayableService implements AccountPayableRepository {
    constructor(private prisma: PrismaService) { }
    async create(data: CreateAccountPayable): Promise<AccountPayable> {
        throw new Error("Method not implemented.");
    }
    async findById(id: string): Promise<AccountPayable | null> {
        throw new Error("Method not implemented.");
    }
    async update(id: string, data: UpdateAccountPayable): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}