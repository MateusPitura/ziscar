import { Organization } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateOrganization { }

export interface UpdateOrganization { }


export abstract class OrganizationRepository {
    abstract create(data: CreateInput<Organization>): Promise<Organization>;
    abstract findById(id: string): Promise<Organization | null>;
    abstract update(id: string, data: UpdateInput<Organization>): Promise<void>;
    abstract delete(id: string): Promise<void>
}