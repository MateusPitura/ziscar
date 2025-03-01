import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { POPULATE_USER_DEFAULT } from '../constants';
import { GET_USER } from './user.constants';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, JwtService],
    }).compile();

    userController = module.get<UserController>(UserController);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should find one user by id', async () => {
    const user = await userController.get(POPULATE_USER_DEFAULT.id.toString());

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should update user email and return the same properties of get user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      Reflect.set(userController, 'userService', userService);

      const user = await userController.update(
        POPULATE_USER_DEFAULT.id.toString(),
        {
          email: 'jane.doe@email.com',
        },
      );
      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });
});
