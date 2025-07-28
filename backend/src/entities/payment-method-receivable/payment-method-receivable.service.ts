import { Injectable } from "@nestjs/common";
import { PaymentMethodPayable } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreatePaymentMethodPayable, PaymentMethodPayableRepository, UpdatePaymentMethodPayable } from "src/repositories/payment_method_payable-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class PaymentMethodPayableService implements PaymentMethodPayableRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<PaymentMethodPayable>): Promise<PaymentMethodPayable> {
        return this.prisma.paymentMethodPayable.create({ data });
    }

    async findById(id: string): Promise<PaymentMethodPayable | null> {
        const paymentMethodPayable = await this.prisma.paymentMethodPayable.findUnique({
            where: { id: Number(id) }
        });

        if (!paymentMethodPayable) {
            return null;
        }

        return paymentMethodPayable;
    }

    async update(id: string, data: UpdateInput<PaymentMethodPayable>): Promise<void> {
        await this.prisma.paymentMethodPayable.update({
            where: { id: Number(id) },
            data
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.paymentMethodPayable.delete({
            where: { id: Number(id) }
        });
    }
}