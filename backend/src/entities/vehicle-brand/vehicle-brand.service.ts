import { Injectable } from "@nestjs/common";
import { VehicleBrand } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleBrandRepository } from "src/repositories/vehicle_brand-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleBrandService implements VehicleBrandRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<VehicleBrand>): Promise<VehicleBrand> {
    return this.prisma.vehicleBrand.create({ data });
  }

  async findById(id: string): Promise<VehicleBrand | null> {
    const vehicleBrand = await this.prisma.vehicleBrand.findUnique({
      where: { id: Number(id) }
    });
    if (!vehicleBrand) {
      return null;
    }
    return vehicleBrand;
  }

  async update(id: string, data: UpdateInput<VehicleBrand>): Promise<void> {
    await this.prisma.vehicleBrand.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicleBrand.delete({
      where: { id: Number(id) }
    });
  }
}
