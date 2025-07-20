import { Injectable } from "@nestjs/common";
import { VehiclePurchase } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehiclePurchase, UpdateVehiclePurchase, VehiclePurchaseRepository } from "src/repositories/vehicle_purchase-repository";

@Injectable()
export class VehiclePurchaseService implements VehiclePurchaseRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehiclePurchase): Promise<VehiclePurchase> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehiclePurchase | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehiclePurchase): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}