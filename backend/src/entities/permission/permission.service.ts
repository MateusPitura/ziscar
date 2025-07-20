import { Injectable } from "@nestjs/common";
import { Permission } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreatePermission, PermissionRepository, UpdatePermission } from "src/repositories/permission-repository";

@Injectable()
export class PermissionService implements PermissionRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePermission): Promise<Permission> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Permission | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdatePermission): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}