import { Audit } from "@prisma/client";

export interface CreateAudit { }

export interface UpdateAudit { }


export abstract class AuditRepository {
    abstract create(data: CreateAudit): Promise<Audit>;
    abstract findById(id: string): Promise<Audit | null>;
    abstract update(id: string, data: UpdateAudit): Promise<void>;
    abstract delete(id: string): Promise<void>
}