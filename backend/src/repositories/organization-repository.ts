import { Organization } from "@prisma/client";

export interface CreateOrganization { }

export interface UpdateOrganization { }


export abstract class OrganizationRepository {
    abstract create(data: CreateOrganization): Promise<Organization>;
    abstract findById(id: string): Promise<Organization | null>;
    abstract update(id: string, data: UpdateOrganization): Promise<void>;
    abstract delete(id: string): Promise<void>
}