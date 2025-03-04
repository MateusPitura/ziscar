import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException } from '@nestjs/common';
import {
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_USER_DEFAULT,
} from '../constants';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ITEMS_PER_PAGE, SEED_ROLE_SALES_ID } from '@shared/constants';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(''),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an user with minimal data', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should not create an user with the same email', async () => {
    await expect(
      userService.create({
        email: POPULATE_USER_DEFAULT.email,
        fullName: 'John Doe',
        clientId: POPULATE_CLIENT_DEFAULT_ID,
        roleId: SEED_ROLE_SALES_ID,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create an user with full data and minimal address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          fullName: 'Jane Doe',
          email: 'jane.doe@email.com',
          cpf: '11111111111',
          birthDate: new Date(),
          code: 'ABCDEF',
          cellPhone: '42988884444',
          address: {
            cep: '12345678',
            number: '123',
          },
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should create an user with full data and full address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          fullName: 'Jane Doe',
          email: 'jane.doe@email.com',
          cpf: '11111111111',
          birthDate: new Date(),
          code: 'ABCDEF',
          cellPhone: '42988884444',
          address: {
            cep: '12345678',
            number: '123',
            street: 'Broadway',
            city: 'New York',
            state: 'NY',
            neighborhood: 'Manhattan',
            complement: 'Apt 123',
          },
          clientId: POPULATE_CLIENT_DEFAULT_ID,
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should update user email', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            email: 'jane.doe@email.com',
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with email that already exist', async () => {
    await expect(
      userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          email: POPULATE_USER_DEFAULT.email,
        },
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should update user cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            cpf: '11111111111',
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with cpf that already exist', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await userService.update(
        {
          id: POPULATE_USER_DEFAULT.id,
        },
        {
          cpf: '11111111111',
        },
      );

      await expect(
        userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            cpf: '11111111111',
          },
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            password: '123456',
          },
        ),
      ).toBeTruthy();

      expect(spy).toHaveBeenCalledWith('123456');

      transaction.rollback();
    });
  });

  it('should create user address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

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
      );

      expect(user).toHaveProperty('address.cep', '12345676');
      expect(user).toHaveProperty('address.number', '123');

      transaction.rollback();
    });
  });

  it('should update user address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

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
      );

      expect(user).toHaveProperty('address.cep', '12345676');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.street', 'Broadway');

      transaction.rollback();
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update(
          {
            id: POPULATE_USER_DEFAULT.id,
          },
          {
            isActive: false,
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should find one user by id', async () => {
    const user = await userService.findOne(
      { id: POPULATE_USER_DEFAULT.id },
      { id: true },
    );

    expect(user).toHaveProperty('id');
  });

  it('should find many users with pagination', async () => {
    const result = await userService.findMany({ page: 1 });

    expect(result).toHaveProperty('total', 25);
    expect(result.users).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
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

    await userService.findMany({ orderBy: 'fullName' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many users by status igual to inactive', async () => {
    const result = await userService.findMany({ status: 'inactive' });

    expect(result).toHaveProperty('total', 6);
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
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
