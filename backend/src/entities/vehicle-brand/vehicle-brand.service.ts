import { Injectable } from "@nestjs/common";
import { VehicleBrand } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleBrand, UpdateVehicleBrand, VehicleBrandRepository } from "src/repositories/vehicle_brand-repository";

@Injectable()
export class VehicleBrandService implements VehicleBrandRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehicleBrand): Promise<VehicleBrand> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleBrand | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehicleBrand): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}