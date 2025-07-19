import { City } from "@prisma/client";

export interface CreateCity { }

export interface UpdateCity { }


export abstract class CityRepository {
    abstract create(data: CreateCity): Promise<City>;
    abstract findById(id: string): Promise<City | null>;
    abstract update(id: string, data: UpdateCity): Promise<void>;
    abstract delete(id: string): Promise<void>
}