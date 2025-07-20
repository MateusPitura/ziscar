import { Injectable } from "@nestjs/common";
import { Store } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateStore, StoreRepository, UpdateStore } from "src/repositories/store-repository";

@Injectable()
export class StoreService implements StoreRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateStore): Promise<Store> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Store | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateStore): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}