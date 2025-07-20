import { Injectable } from "@nestjs/common";
import { AccountReceivable } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AccountReceivableRepository, CreateAccountReceivable, UpdateAccountReceivable } from "src/repositories/account_receivable-repository";


@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateAccountReceivable): Promise<AccountReceivable> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<AccountReceivable | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateAccountReceivable): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}