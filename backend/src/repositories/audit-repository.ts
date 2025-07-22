import { Audit } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateAudit { }

export interface UpdateAudit { }


export abstract class AuditRepository {
    abstract create(data: CreateInput<Audit>): Promise<Audit>;
    abstract findById(id: string): Promise<Audit | null>;
    abstract update(id: string, data: UpdateInput<Audit>): Promise<void>;
    abstract delete(id: string): Promise<void>
}