import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserCreateInDto } from './user.dto';
import { genSalt, hashSync } from 'bcrypt';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(createUserInDto: UserCreateInDto) {
    const emailAlreadyExist = await this.findUniqueUser({
      email: createUserInDto.email,
    });

    if (emailAlreadyExist) {
      throw new ConflictException(
        `Email '${createUserInDto.email}' already exists`,
      );
    }

    const salt = await genSalt(10);
    createUserInDto.password = hashSync(createUserInDto.password, salt);

    return await this.databaseService.tx.user.create({
      data: createUserInDto,
    });
  }

  async findUniqueUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return await this.databaseService.tx.user.findUnique({
      where: userWhereUniqueInput,
      omit: {
        password: true,
      },
    });
  }
}
