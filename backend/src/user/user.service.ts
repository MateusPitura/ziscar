import { Injectable } from '@nestjs/common';
import { UserUpdateInDto, UserCreateInDto, UserFindAllInDto } from './user.dto';
import { Prisma } from '@prisma/client';
import { ITEMS_PER_PAGE } from '../constants';
import { PrismaService } from '../database/prisma.service';
import { GetCallback, Transaction } from 'src/types';
import { encryptPassword } from './user.utils';
import { GET_USER } from './user.constants';
import { verifyDuplicated } from '../utils/verifyDuplicated';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/generateRandomPassword';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserInDto: UserCreateInDto, transaction?: Transaction) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({ email: createUserInDto.email });

    const { address, ...rest } = createUserInDto;

    const createPayload = {
      ...rest,
      password: this.generateRandomPassword(),
    };
    if (address) {
      createPayload['address'] = {
        create: address,
      };
    }

    await database.user.create({
      data: createPayload,
    });

    const token = this.jwtService.sign({ email: createUserInDto.email });

    void this.emailService.sendEmail({
      to: createUserInDto.email,
      title: 'Confirme a criação da sua conta',
      body: `${token}`,
    });
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
  ) {
    return await this.prismaService.user.findFirst({
      where: userWhereUniqueInput,
      select,
    });
  }

  async update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userUpdateInDto: UserUpdateInDto,
  ) {
    await this.verifyDuplicated({
      email: userUpdateInDto.email as string,
      cpf: userUpdateInDto.cpf as string,
    });

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

    return await this.prismaService.user.update({
      where: userWhereUniqueInput,
      data: updatePayload,
      select: GET_USER,
    });
  }

  async verifyDuplicated(properties: Partial<Record<'email' | 'cpf', string>>) {
    await verifyDuplicated(properties, this.get.bind(this) as GetCallback);
  }

  async encryptPassword(password: string) {
    return encryptPassword(password);
  }

  generateRandomPassword() {
    return generateRandomPassword();
  }
}
