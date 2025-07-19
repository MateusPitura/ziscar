import { PaymentMethodPayable } from "@prisma/client";

export interface CreatePaymentMethodPayable { }

export interface UpdatePaymentMethodPayable { }


export abstract class PaymentMethodPayableRepository {
    abstract create(data: CreatePaymentMethodPayable): Promise<PaymentMethodPayable>;
    abstract findById(id: string): Promise<PaymentMethodPayable | null>;
    abstract update(id: string, data: UpdatePaymentMethodPayable): Promise<void>;
    abstract delete(id: string): Promise<void>
}