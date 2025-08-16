import { InstallmentStatus } from "@prisma/client";
import { s } from "@shared/safeZod";
import { createZodDto } from "nestjs-zod";

const createAccountReceivableInstallmentDTO = s.object({
    installmentSequence: s.number().min(1),
    dueDate: s.date(),
    value: s.number().min(0),
    status: s.nativeEnum(InstallmentStatus),
    isRefund: s.boolean().default(false),
    isUpfront: s.boolean().default(false),
    accountReceivableId: s.id(),
    refundAccountReceivableInstallmentId: s.id().nullable()
});


export class CreateAccountReceivableInstallmentDTO extends createZodDto(createAccountReceivableInstallmentDTO) { }