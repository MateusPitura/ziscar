import { Injectable } from "@nestjs/common";
import { VehicleSale } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleSale, UpdateVehicleSale, VehicleSaleRepository } from "src/repositories/vehicle_sale-repository";

@Injectable()
export class VehicleSaleService implements VehicleSaleRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehicleSale): Promise<VehicleSale> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleSale | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehicleSale): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}