import { Injectable } from "@nestjs/common";
import { Address } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AddressRepository, CreateAddress, UpdateAddress } from "src/repositories/address-repository";

@Injectable()
export class AddressService implements AddressRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateAddress): Promise<Address> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Address | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateAddress): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}