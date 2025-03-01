import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException } from '@nestjs/common';
import {
  ITEMS_PER_PAGE,
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_USER_DEFAULT,
  SEED_ROLE_ADMIN_ID,
} from '../constants';

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
      const spy = jest.spyOn(userService, 'encryptPassword');

      const user = await userService.create(
        {
          email: 'jane.doe@email.com',
          password: '123456',
          fullName: 'Jane Doe',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        transaction,
      );

      expect(user).toHaveProperty('userId');

      expect(spy).toHaveBeenCalledWith('123456');

      transaction.rollback();
    });
  });

  it('should not create an user with the same email', async () => {
    await prismaService.transaction(async (transaction) => {
      await expect(
        userService.create(
          {
            email: POPULATE_USER_DEFAULT.email,
            password: '123456',
            fullName: 'John Doe',
            clientId: POPULATE_CLIENT_DEFAULT_ID,
            roleId: SEED_ROLE_ADMIN_ID,
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user email', async () => {
    await prismaService.transaction(async (transaction) => {
      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            email: 'jane.doe@email.com',
          },
          transaction,
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with email that already exist', async () => {
    await prismaService.transaction(async (transaction) => {
      await expect(
        userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            email: POPULATE_USER_DEFAULT.email,
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            cpf: '11111111111',
          },
          transaction,
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with cpf that already exist', async () => {
    await prismaService.transaction(async (transaction) => {
      await userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          cpf: '11111111111',
        },
        transaction,
      );

      await expect(
        userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            cpf: '11111111111',
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      const spy = jest.spyOn(userService, 'encryptPassword');

      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            password: '123456',
          },
          transaction,
        ),
      ).toBeTruthy();

      expect(spy).toHaveBeenCalledWith('123456');

      transaction.rollback();
    });
  });

  it('should create user address', async () => {
    await prismaService.transaction(async (transaction) => {
      const user = await userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          address: {
            cep: '12345676',
            number: '123',
          },
        },
        transaction,
      );

      expect(user).toHaveProperty('address.cep', '12345676');
      expect(user).toHaveProperty('address.number', '123');

      transaction.rollback();
    });
  });

  it('should update user address', async () => {
    await prismaService.transaction(async (transaction) => {
      await userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          address: {
            cep: '12345676',
            number: '123',
          },
        },
        transaction,
      );

      const user = await userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          address: {
            street: 'Broadway',
          },
        },
        transaction,
      );

      expect(user).toHaveProperty('address.cep', '12345676');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.street', 'Broadway');

      transaction.rollback();
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            isActive: false,
          },
          transaction,
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should find one user by id', async () => {
    const user = await userService.get(
      { id: POPULATE_USER_DEFAULT.id },
      { id: true },
    );

    expect(user).toHaveProperty('id');
  });

  it('should find many users with pagination', async () => {
    const result = await userService.fetch({ page: 1 });

    expect(result).toHaveProperty('total', 25);
    expect(result.users).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.fetch({
      fullName: POPULATE_USER_DEFAULT.fullName,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          fullName: {
            contains: POPULATE_USER_DEFAULT.fullName.toLocaleLowerCase(),
            mode: 'insensitive',
          },
        }) as object,
      }),
    );
  });

  it('should find many users ordered by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.fetch({ orderBy: 'fullName' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many users by status igual to inactive', async () => {
    const result = await userService.fetch({ status: 'inactive' });

    expect(result).toHaveProperty('total', 6);
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.fetch({
      page: 1,
      status: 'active',
      fullName: POPULATE_USER_DEFAULT.fullName,
      orderBy: 'fullName',
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      where: {
        fullName: {
          contains: POPULATE_USER_DEFAULT.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        isActive: true,
      },
      orderBy: [{ fullName: 'asc' }],
    });
  });
});
