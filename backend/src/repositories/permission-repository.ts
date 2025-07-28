import { Permission } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export abstract class PermissionRepository {
  abstract create(data: CreateInput<Permission>): Promise<Permission>;
  abstract findById(id: string): Promise<Permission | null>;
  abstract update(id: string, data: UpdateInput<Permission>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
