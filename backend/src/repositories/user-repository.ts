import { User } from "@prisma/client";

export interface CreateUser {

}

export abstract class UserRepository {
    abstract create(data: CreateUser): Promise<void>;
    abstract findById(id: string): Promise<User>
}