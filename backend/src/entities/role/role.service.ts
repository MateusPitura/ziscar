import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RoleRepository } from 'src/repositories/role-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class RoleService implements RoleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Role>): Promise<Role> {
    return this.prisma.role.create({ data });
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id: Number(id) },
    });

    if (!role) {
      return null;
    }

    return role;
  }

  async update(id: string, data: UpdateInput<Role>): Promise<void> {
    await this.prisma.role.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id: Number(id) },
    });
  }
}
