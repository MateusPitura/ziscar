import { Injectable } from "@nestjs/common";
import { Client } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { ClientRepository, CreateClient, UpdateClient } from "src/repositories/client-repository";

@Injectable()
export class ClientService implements ClientRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateClient): Promise<Client> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Client | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateClient): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}