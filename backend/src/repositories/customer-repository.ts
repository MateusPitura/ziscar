import { Customer } from "@prisma/client";

export interface CreateCustomer { }

export interface UpdateCustomer { }


export abstract class CustomerRepository {
    abstract create(data: CreateCustomer): Promise<Customer>;
    abstract findById(id: string): Promise<Customer | null>;
    abstract update(id: string, data: UpdateCustomer): Promise<void>;
    abstract delete(id: string): Promise<void>
}