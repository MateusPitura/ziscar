import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UserCreateInDto } from './user.dto';
import { genSalt, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

    return await this.prismaService.user.create({
      data: createUserInDto,
    });
  }

  async findUniqueUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      omit: {
        password: true,
      },
    });
  }
}
