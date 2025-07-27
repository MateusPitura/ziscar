import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CustomerRepository } from 'src/repositories/customer-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class CustomerService implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Customer>): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id: Number(id) },
    });
  }

  async update(id: string, data: UpdateInput<Customer>): Promise<void> {
    await this.prisma.customer.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id: Number(id) },
    });
  }
}
