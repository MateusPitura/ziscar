import { Injectable } from "@nestjs/common";
import { VehicleBrand } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleBrandRepository } from "src/repositories/vehicle_brand-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleBrandService implements VehicleBrandRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<VehicleBrand>): Promise<VehicleBrand> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleBrand | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateInput<VehicleBrand>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}