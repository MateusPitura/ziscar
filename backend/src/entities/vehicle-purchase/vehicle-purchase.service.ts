/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { VehiclePurchase } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehiclePurchaseRepository } from 'src/repositories/vehicle_purchase-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class VehiclePurchaseService implements VehiclePurchaseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<VehiclePurchase>): Promise<VehiclePurchase> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<VehiclePurchase | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateInput<VehiclePurchase>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
