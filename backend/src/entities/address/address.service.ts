/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AddressRepository } from 'src/repositories/address-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class AddressService implements AddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Address>): Promise<Address> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Address | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateInput<Address>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
