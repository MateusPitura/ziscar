import { Role } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";




export abstract class RoleRepository {
    abstract create(data: CreateInput<Role>): Promise<Role>;
    abstract findById(id: string): Promise<Role | null>;
    abstract update(id: string, data: UpdateInput<Role>): Promise<void>;
    abstract delete(id: string): Promise<void>
}