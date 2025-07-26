import { Injectable } from "@nestjs/common";
import { Vehicle } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleRepository } from "src/repositories/vehicle-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleService implements VehicleRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<Vehicle>): Promise<Vehicle> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Vehicle | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateInput<Vehicle>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}