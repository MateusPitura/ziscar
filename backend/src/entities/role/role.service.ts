/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RoleRepository } from 'src/repositories/role-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class RoleService implements RoleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Role>): Promise<Role> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Role | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateInput<Role>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
