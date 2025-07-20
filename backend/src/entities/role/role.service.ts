import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateRole, RoleRepository, UpdateRole } from "src/repositories/role-repository";

@Injectable()
export class RoleService implements RoleRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateRole): Promise<Role> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Role | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateRole): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}