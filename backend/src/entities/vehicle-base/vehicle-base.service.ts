import { Injectable } from "@nestjs/common";
import { VehicleBase } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleBaseRepository } from "src/repositories/vehicle_base-repository";
import { CreateInput, UpdateInput } from "src/types";


@Injectable()
export class VehicleBaseService implements VehicleBaseRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<VehicleBase>): Promise<VehicleBase> {
    return this.prisma.vehicleBase.create({ data });

  }

  async findById(id: string): Promise<VehicleBase | null> {
    const vehicleBase = await this.prisma.vehicleBase.findUnique({
      where: { id: Number(id) }
    });

    if (!vehicleBase) {
      return null;
    }

    return vehicleBase;

  }

  async update(id: string, data: UpdateInput<VehicleBase>): Promise<void> {
    await this.prisma.vehicleBase.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicleBase.delete({
      where: { id: Number(id) }
    });
  }
}
