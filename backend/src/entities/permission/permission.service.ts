import { Injectable } from "@nestjs/common";
import { Permission } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { PermissionRepository } from "src/repositories/permission-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class PermissionService implements PermissionRepository {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateInput<Permission>): Promise<Permission> {
    return this.prisma.permission.create({ data });
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id: Number(id) }
    });

    if (!permission) {
      return null;
    }

    return permission;
  }

  async update(id: string, data: UpdateInput<Permission>): Promise<void> {
    await this.prisma.permission.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id: Number(id) }
    });
  }
}
