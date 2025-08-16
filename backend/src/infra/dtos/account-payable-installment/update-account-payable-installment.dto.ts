import { InstallmentStatus } from "@prisma/client";
import { s } from "@shared/safeZod";
import { createZodDto } from "nestjs-zod";

const updateAccountPayableInstallmentDTO = s.object({
    installmentSequence: s.number().min(1),
    dueDate: s.date(),
    value: s.number().min(0),
    status: s.nativeEnum(InstallmentStatus),
    isRefund: s.boolean().default(false),
    isUpfront: s.boolean().default(false),
});


export class UpdateAccountPayableInstallmentDTO extends createZodDto(updateAccountPayableInstallmentDTO) { }