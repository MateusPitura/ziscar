import { Injectable } from "@nestjs/common";
import { Address } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AddressRepository, CreateAddress, UpdateAddress } from "src/repositories/address-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class AddressService implements AddressRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<Address>): Promise<Address> {
    return this.prisma.address.create({ data });
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { id: Number(id) }
    });

    if (!address) {
      return null;
    }

    return address;
  }

  async update(id: string, data: UpdateInput<Address>): Promise<void> {
    await this.prisma.address.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: { id: Number(id) }
    });
  }
}
