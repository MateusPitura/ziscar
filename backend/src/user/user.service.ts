import { ConflictException, Injectable } from '@nestjs/common';
import { UserUpdateInDto, UserCreateInDto, UserFindAllInDto } from './user.dto';
import { Prisma } from '@prisma/client';
import { ITEMS_PER_PAGE } from '../constants';
import { PrismaService } from '../database/prisma.service';
import { Transaction } from 'src/types';
import { encryptPassword } from './user.utils';
import { SELECT_USER } from './user.constants';

type VerifyDuplicatedKeys = Pick<Prisma.UserGetPayload<null>, 'email' | 'cpf'>;

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInDto: UserCreateInDto, transaction?: Transaction) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({ email: createUserInDto.email }, transaction);

    createUserInDto.password = await this.encryptPassword(
      createUserInDto.password,
    );

    const user = await database.user.create({
      data: createUserInDto,
    });

    return { userId: user.id };
  }

  async fetch(userFindAllInDto: UserFindAllInDto, select?: Prisma.UserSelect) {
    const { page = 1 } = userFindAllInDto;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const findManyWhere = {
      where: {
        isActive: true,
      },
    };
    const orderBy = userFindAllInDto?.orderBy;
    if (orderBy) {
      findManyWhere['orderBy'] = [
        {
          [orderBy as string]: 'asc',
        },
      ];
    }
    const searchByFullName = userFindAllInDto?.fullName;
    if (searchByFullName) {
      findManyWhere.where['fullName'] = {
        contains: searchByFullName.toLocaleLowerCase(),
        mode: 'insensitive',
      };
    }
    const status = userFindAllInDto?.status;
    if (status === 'inactive') {
      findManyWhere.where['isActive'] = false;
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take: ITEMS_PER_PAGE,
        select,
        ...findManyWhere,
      }),
      this.prismaService.user.count(findManyWhere),
    ]);

    return {
      total,
      users,
    };
  }

  async get(
    userWhereUniqueInput: Partial<Prisma.UserWhereUniqueInput>,
    select: Prisma.UserSelect,
    transaction?: Transaction,
  ) {
    const database = transaction || this.prismaService;
    return await database.user.findFirst({
      where: userWhereUniqueInput as Prisma.UserWhereUniqueInput,
      select,
    });
  }

  async update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userUpdateInDto: UserUpdateInDto,
    transaction?: Transaction,
  ) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated(
      {
        email: userUpdateInDto.email as string,
        cpf: userUpdateInDto.cpf as string,
      },
      transaction,
    );

    const { address, ...rest } = userUpdateInDto;

    const updatePayload = {
      ...rest,
    };
    if (address) {
      updatePayload['address'] = {
        upsert: {
          create: {
            ...address,
            cep: address.cep || '',
            number: address.number || '',
          },
          update: address,
        },
      };
    }

    if (userUpdateInDto.password) {
      updatePayload['password'] = await this.encryptPassword(
        userUpdateInDto.password as string,
      );
    }

    return await database.user.update({
      where: userWhereUniqueInput,
      data: updatePayload,
      select: SELECT_USER,
    });
  }

  async verifyDuplicated(
    properties: Partial<Record<keyof VerifyDuplicatedKeys, string>>,
    transaction?: Transaction,
  ) {
    const whereClause: Record<string, string>[] = [];
    for (const [key, value] of Object.entries(properties)) {
      if (!value) continue;
      whereClause.push({ [key]: value });
    }

    const user = await this.get({ OR: whereClause }, { id: true }, transaction);

    if (user) {
      const keysFormatted = Object.keys(properties).join(' or ');
      throw new ConflictException(`Property ${keysFormatted} already exists`);
    }
  }

  async encryptPassword(password: string) {
    return encryptPassword(password);
  }
}
