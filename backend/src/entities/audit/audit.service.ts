import { Injectable } from "@nestjs/common";
import { Audit } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { AuditRepository, CreateAudit, UpdateAudit } from "src/repositories/audit-repository";

@Injectable()
export class AuditService implements AuditRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateAudit): Promise<Audit> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Audit | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateAudit): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}