import { Enterprise } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class EnterpriseRepository {
    abstract create(data: CreateInput<Enterprise>): Promise<Enterprise>;
    abstract findById(id: string): Promise<Enterprise | null>;
    abstract update(id: string, data: UpdateInput<Enterprise>): Promise<void>;
    abstract delete(id: string): Promise<void>
}