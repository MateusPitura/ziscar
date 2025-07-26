import { Injectable } from "@nestjs/common";
import { Store } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { StoreRepository } from "src/repositories/store-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class StoreService implements StoreRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<Store>): Promise<Store> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Store | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateInput<Store>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}