import { s } from "@shared/safeZod";
import { createZodDto } from "nestjs-zod";

const createAccountReceivableDTO = s.object({
    description: s.string(),
    receivedFrom: s.string(),
})

export class CreateAccountReceivableDTO extends createZodDto(createAccountReceivableDTO) { }