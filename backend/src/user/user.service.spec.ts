import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException } from '@nestjs/common';
import { POPULATE_CLIENT_DEFAULT_ID, SEED_ROLE_ADMIN_ID } from '../constants';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an user', async () => {
    await prismaService.transaction(async (transaction) => {
      const user = await userService.create(
        {
          email: 'testuser+001@email.com',
          password: 'admin',
          fullName: 'Test User',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        transaction,
      );

      expect(user).toHaveProperty('userId');

      transaction.rollback();
    });
  });

  it('should not create an user with the same email', async () => {
    await prismaService.transaction(async (transaction) => {
      await userService.create(
        {
          email: 'testuser+001@email.com',
          password: 'admin',
          fullName: 'Test User',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        transaction,
      );

      await expect(
        userService.create(
          {
            email: 'testuser+001@email.com',
            password: 'admin',
            fullName: 'Test User',
            clientId: POPULATE_CLIENT_DEFAULT_ID,
            roleId: SEED_ROLE_ADMIN_ID,
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });
});
