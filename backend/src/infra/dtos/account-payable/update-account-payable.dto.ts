import { s } from "@shared/safeZod";
import { createZodDto } from "nestjs-zod";

const updateAccountPayableDTO = s.object({
    description: s.string().optional(),
    paidTo: s.string().optional(),
})

export class UpdateAccountPayableDTO extends createZodDto(updateAccountPayableDTO) { }