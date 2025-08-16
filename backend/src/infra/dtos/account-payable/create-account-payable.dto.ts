import { s } from "@shared/safeZod";
import { createZodDto } from "nestjs-zod";

const createAccountPayableDTO = s.object({
    description: s.string(),
    paidTo: s.string(),
})

export class CreateAccountPayableDTO extends createZodDto(createAccountPayableDTO) { }