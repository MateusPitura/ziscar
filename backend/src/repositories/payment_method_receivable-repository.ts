import { PaymentMethodReceivable } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class PaymentMethodReceivableRepository {
    abstract create(data: CreateInput<PaymentMethodReceivable>): Promise<PaymentMethodReceivable>;
    abstract findById(id: string): Promise<PaymentMethodReceivable | null>;
    abstract update(id: string, data: UpdateInput<PaymentMethodReceivable>): Promise<void>;
    abstract delete(id: string): Promise<void>
}