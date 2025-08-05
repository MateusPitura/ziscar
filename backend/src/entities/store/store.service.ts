import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { StoreRepository } from 'src/repositories/store-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class StoreService implements StoreRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Store>): Promise<Store> {
    return this.prisma.store.create({ data });
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { id: Number(id) },
    });

    if (!store) {
      return null;
    }

    return store;
  }

  async update(id: string, data: UpdateInput<Store>): Promise<void> {
    await this.prisma.store.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.store.delete({
      where: { id: Number(id) },
    });
  }
}
