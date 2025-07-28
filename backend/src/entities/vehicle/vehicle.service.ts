import { Injectable } from "@nestjs/common";
import { Vehicle } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleRepository } from "src/repositories/vehicle-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleService implements VehicleRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: Number(id) }
    });

    if (!vehicle) {
      return null;
    }

    return vehicle;
  }

  async update(id: string, data: UpdateInput<Vehicle>): Promise<void> {
    await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({
      where: { id: Number(id) }
    });
  }
}
