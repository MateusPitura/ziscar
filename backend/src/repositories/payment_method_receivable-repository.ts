import { PaymentMethodReceivable } from "@prisma/client";

export interface CreatePaymentMethodReceivable { }

export interface UpdatePaymentMethodReceivable { }


export abstract class PaymentMethodReceivableRepository {
    abstract create(data: CreatePaymentMethodReceivable): Promise<PaymentMethodReceivable>;
    abstract findById(id: string): Promise<PaymentMethodReceivable | null>;
    abstract update(id: string, data: UpdatePaymentMethodReceivable): Promise<void>;
    abstract delete(id: string): Promise<void>
}