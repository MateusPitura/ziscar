import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GetCallback, Transaction } from '../types';
import { encryptPassword } from './user.utils';
import { GET_USER } from './user.constant';
import { verifyDuplicated } from '../utils/verifyDuplicated';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { ITEMS_PER_PAGE } from '@shared/constants';
import {
  UserCreateInDto,
  UserFindManyInDto,
  UserUpdateInDto,
} from './user.schema';
import { FRONTEND_URL } from 'src/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(userCreateInDto: UserCreateInDto, transaction?: Transaction) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({ email: userCreateInDto.email });

    const { address, clientId, roleId, ...rest } = userCreateInDto;

    const createPayload = {
      ...rest,
      password: await this.encryptPassword(this.generateRandomPassword()),
    };
    if (address) {
      createPayload['address'] = {
        create: address,
      };
    }

    await database.user.create({
      data: {
        ...createPayload,
        client: {
          connect: {
            id: clientId,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    });

    const token = this.jwtService.sign({ email: userCreateInDto.email });

    void this.emailService.sendEmail({
      to: userCreateInDto.email,
      title: 'Confirme a criação da sua conta',
      body: `${FRONTEND_URL}/sign?token=${token}`,
    });

    return true;
  }

  async findMany(
    userFindManyInDto: UserFindManyInDto,
    userId: number,
    select?: Prisma.UserSelect,
  ) {
    const { page = 1 } = userFindManyInDto;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const findManyWhere = {
      where: {
        isActive: true,
        NOT: {
          id: userId,
        },
      },
    };
    const orderBy = userFindManyInDto?.orderBy;
    if (orderBy) {
      findManyWhere['orderBy'] = [
        {
          [orderBy as string]: 'asc',
        },
      ];
    }
    const searchByFullName = userFindManyInDto?.fullName;
    if (searchByFullName) {
      findManyWhere.where['fullName'] = {
        contains: searchByFullName.toLocaleLowerCase(),
        mode: 'insensitive',
      };
    }
    const status = userFindManyInDto?.status;
    if (status === 'inactive') {
      findManyWhere.where['isActive'] = false;
    }

    const [data, total] = await Promise.all([
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
      data,
    };
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    select: Prisma.UserSelect,
    onlyActive: boolean = true,
  ) {
    if (onlyActive) {
      userWhereUniqueInput['isActive'] = true;
    }
    const user = await this.prismaService.user.findFirst({
      where: userWhereUniqueInput,
      select,
    });

    if (onlyActive && !user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userUpdateInDto: UserUpdateInDto,
  ) {
    await this.verifyDuplicated({
      email: userUpdateInDto.email,
      cpf: userUpdateInDto.cpf,
    });

    const { address, roleId, ...rest } = userUpdateInDto;

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
        userUpdateInDto.password,
      );
    }

    if (roleId) {
      updatePayload['role'] = {
        connect: {
          id: roleId,
        },
      };
    }

    try {
      const user = await this.prismaService.user.update({
        where: {
          isActive: !userUpdateInDto.isActive,
          ...userWhereUniqueInput,
        },
        data: updatePayload,
        select: GET_USER,
      });
      return user;
    } catch (error) {
      if ((error as Record<string, string>)?.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  async verifyDuplicated(properties: Partial<Record<'email' | 'cpf', string>>) {
    await verifyDuplicated(properties, this.findOne.bind(this) as GetCallback);
  }

  async encryptPassword(password: string) {
    return encryptPassword(password);
  }

  generateRandomPassword() {
    return generateRandomPassword();
  }
}
