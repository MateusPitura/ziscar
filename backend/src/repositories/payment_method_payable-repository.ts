import { PaymentMethodPayable } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreatePaymentMethodPayable { }

export interface UpdatePaymentMethodPayable { }


export abstract class PaymentMethodPayableRepository {
    abstract create(data: CreateInput<PaymentMethodPayable>): Promise<PaymentMethodPayable>;
    abstract findById(id: string): Promise<PaymentMethodPayable | null>;
    abstract update(id: string, data: UpdateInput<PaymentMethodPayable>): Promise<void>;
    abstract delete(id: string): Promise<void>
}