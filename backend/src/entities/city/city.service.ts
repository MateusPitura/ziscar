import { Injectable } from "@nestjs/common";
import { City } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CityRepository, CreateCity, UpdateCity } from "src/repositories/city-repository";

@Injectable()
export class CityService implements CityRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateCity): Promise<City> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<City | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateCity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}