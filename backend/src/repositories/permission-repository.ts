import { Permission } from "@prisma/client";

export interface CreatePermission { }

export interface UpdatePermission { }


export abstract class PermissionRepository {
    abstract create(data: CreatePermission): Promise<Permission>;
    abstract findById(id: string): Promise<Permission | null>;
    abstract update(id: string, data: UpdatePermission): Promise<void>;
    abstract delete(id: string): Promise<void>
}