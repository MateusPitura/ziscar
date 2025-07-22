import { Injectable } from "@nestjs/common";
import { City } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CityRepository } from "src/repositories/city-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class CityService implements CityRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateInput<City>): Promise<City> {
        return this.prisma.city.create({ data });
    }

    async findById(ibgeCode: string): Promise<City | null> {
        return this.prisma.city.findUnique({
            where: { ibgeCode: Number(ibgeCode) }
        });
    }

    async update(ibgeCode: string, data: UpdateInput<City>): Promise<void> {
        await this.prisma.city.update({
            where: { ibgeCode: Number(ibgeCode) },
            data
        });
    }

    async delete(ibgeCode: string): Promise<void> {
        await this.prisma.city.delete({
            where: { ibgeCode: Number(ibgeCode) }
        });
    }
}