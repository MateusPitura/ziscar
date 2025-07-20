import { Injectable } from "@nestjs/common";
import { Customer } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateCustomer, CustomerRepository, UpdateCustomer } from "src/repositories/customer-repository";

@Injectable()
export class CustomerService implements CustomerRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateCustomer): Promise<Customer> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Customer | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateCustomer): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}