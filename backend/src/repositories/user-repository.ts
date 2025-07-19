import { User } from "@prisma/client";

export interface CreateUser {

}

export interface UpdateUser {

}

export abstract class UserRepository {
    abstract create(data: CreateUser): Promise<User>;
    abstract findById(id: string): Promise<User | null>;
    abstract update(id: string, data: UpdateUser): Promise<void>;
    abstract archive(id: string): Promise<void>
}