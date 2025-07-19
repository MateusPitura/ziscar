import { Role } from "@prisma/client";

export interface CreateRole { }

export interface UpdateRole { }


export abstract class RoleRepository {
    abstract create(data: CreateRole): Promise<Role>;
    abstract findById(id: string): Promise<Role | null>;
    abstract update(id: string, data: UpdateRole): Promise<void>;
    abstract delete(id: string): Promise<void>
}