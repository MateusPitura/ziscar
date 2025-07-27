/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class PermissionService implements PermissionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Permission>): Promise<Permission> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Permission | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateInput<Permission>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
