import { Injectable } from "@nestjs/common";
import { VehiclePurchase } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehiclePurchaseRepository } from "src/repositories/vehicle_purchase-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehiclePurchaseService implements VehiclePurchaseRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<VehiclePurchase>): Promise<VehiclePurchase> {
    return this.prisma.vehiclePurchase.create({ data });
  }

  async findById(id: string): Promise<VehiclePurchase | null> {
    const vehiclePurchase = await this.prisma.vehiclePurchase.findUnique({
      where: { id: Number(id) }
    });

    if (!vehiclePurchase) {
      return null;
    }

    return vehiclePurchase;
  }

  async update(id: string, data: UpdateInput<VehiclePurchase>): Promise<void> {
    await this.prisma.vehiclePurchase.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehiclePurchase.delete({
      where: { id: Number(id) }
    });
  }
}
