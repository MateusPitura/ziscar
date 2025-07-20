import { Injectable } from "@nestjs/common";
import { VehicleBase } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleBase, UpdateVehicleBase, VehicleBaseRepository } from "src/repositories/vehicle_base-repository";


@Injectable()
export class VehicleBaseService implements VehicleBaseRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehicleBase): Promise<VehicleBase> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleBase | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehicleBase): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}