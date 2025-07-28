import { Injectable } from "@nestjs/common";
import { AccountReceivable } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AccountReceivableRepository, CreateAccountReceivable, UpdateAccountReceivable } from "src/repositories/account_receivable-repository";
import { CreateInput, UpdateInput } from "src/types";


@Injectable()
export class AccountReceivableService implements AccountReceivableRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<AccountReceivable>): Promise<AccountReceivable> {
        return this.prisma.accountReceivable.create({ data });
    }

    async findById(id: string): Promise<AccountReceivable | null> {
        const accountReceivable = await this.prisma.accountReceivable.findUnique({
            where: { id: Number(id) }
        });

        if (!accountReceivable) {
            return null;
        }

        return accountReceivable;
    }

    async update(id: string, data: UpdateInput<AccountReceivable>): Promise<void> {
        await this.prisma.accountReceivable.update({
            where: { id: Number(id) },
            data
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.accountReceivable.delete({
            where: { id: Number(id) }
        });
    }
}