import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import {
  ITEMS_PER_PAGE,
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '@shared/constants';
import { addressNullableFields } from './user.constant';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  POPULATE_ENTERPRISE_PRIMARY_ID,
  POPULATE_ENTERPRISE_SECONDARY_ID,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from 'src/constants';

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
          userCreateInDto: {
            email: 'jane.doe@email.com',
            fullName: 'Jane Doe',
            enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
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
        userCreateInDto: {
          email: POPULATE_USER_DEFAULT.email,
          fullName: 'John Doe',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an user with an email of an inactive user', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: POPULATE_USER_INACTIVE.email,
          fullName: 'Tony Stark',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an user with an cpf of an inactive user', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: 'jane.doe@email.com',
          fullName: 'John Doe',
          cpf: POPULATE_USER_INACTIVE.cpf,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
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
          userCreateInDto: {
            fullName: 'Jane Doe',
            email: 'jane.doe@email.com',
            cpf: '11111111111',
            phone: '42988884444',
            address: {
              cep: '12345678',
              number: '123',
            },
            enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
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
          userCreateInDto: {
            fullName: 'Jane Doe',
            email: 'jane.doe@email.com',
            cpf: '11111111111',
            phone: '42988884444',
            address: {
              cep: '12345678',
              number: '123',
              street: 'Broadway',
              cityIbgeCode: 4119905,
              neighborhood: 'Manhattan',
            },
            enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should update user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            fullName: 'Jane Doe',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not verify duplicated if cpf is not passed', async () => {
    const spy = jest.spyOn(userService, 'verifyDuplicated');

    await userService.update({
      where: {
        id: POPULATE_USER_DEFAULT.id,
      },
      userUpdateInDto: {
        phone: '42988884444',
      },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update user cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: '11111111111',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with cpf that already exist', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: POPULATE_USER_DEFAULT.cpf,
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should not update user with cpf of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: POPULATE_USER_INACTIVE.cpf,
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      expect(spy).toHaveBeenCalledWith({ password: '123456' });

      transaction.rollback();
    });
  });

  it('should not update password of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(spy).toHaveBeenCalledTimes(0);

      transaction.rollback();
    });
  });

  it('should not update user with outer enterprise id provided', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should create user address and if already exist update all to null', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      const spy = jest.spyOn(transaction.user, 'update');

      const commonPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      };

      await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const user = await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '87654321', number: '321' },
          },
        },
      });

      expect(user).toHaveProperty('address.cep', '87654321');
      expect(user).toHaveProperty('address.number', '321');
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            address: {
              update: {
                ...addressNullableFields,
                cep: '87654321',
                number: '321',
              },
            },
          },
        }),
      );

      transaction.rollback();
    });
  });

  it('should create, create if already exist and update user address and update role', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          address: {
            update: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.cityIbgeCode', 4119905);
      expect(user).toHaveProperty('roleId', SEED_ROLE_SALES_ID);

      transaction.rollback();
    });
  });

  it('should update user address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const commonPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      };

      await expect(
        userService.update({
          ...commonPayload,
          userUpdateInDto: {
            address: {
              update: { street: 'Broadway' },
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const user = await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            update: { street: 'Broadway' },
          },
        },
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.street', 'Broadway');
      expect(user).toHaveProperty('address.cityIbgeCode', 4119905);

      transaction.rollback();
    });
  });

  it('should delete user address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const commonPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      };

      await expect(
        userService.update({
          ...commonPayload,
          userUpdateInDto: {
            address: {
              remove: true,
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const user = await userService.update({
        ...commonPayload,
        userUpdateInDto: {
          address: {
            remove: true,
          },
        },
      });

      expect(user).toHaveProperty('address', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user role', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          roleId: SEED_ROLE_ADMIN_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          password: '123456',
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user active status', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          archivedAt: new Date(),
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            archivedAt: new Date(),
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not disable inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            archivedAt: new Date(),
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should enable inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            archivedAt: null,
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not enable active user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            archivedAt: null,
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should update user with allowed null values', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const result = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          cpf: null,
          phone: null,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          cpf: null,
          phone: null,
        }),
      );

      transaction.rollback();
    });
  });

  it('should not find inactive user', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER_INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find inactive user', async () => {
    const user = await userService.findOne({
      where: { id: POPULATE_USER_INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find user with outer enterprise id provided', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER_DEFAULT.id },
        select: { id: true },
        enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find many users with pagination', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 24);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users without signed user', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    const signedUser = result.data.find(
      (item) => item.id === POPULATE_USER_DEFAULT.id,
    );

    expect(signedUser).toBeUndefined();
    expect(result).toHaveProperty('total', 24);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        fullName: POPULATE_USER_DEFAULT.fullName,
      },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
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

    await userService.findMany({
      userFindManyInDto: { orderBy: 'fullName' },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many users by status igual to inactive', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'inactive' },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 7);
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        page: 1,
        status: 'active',
        fullName: POPULATE_USER_DEFAULT.fullName,
        orderBy: 'fullName',
      },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      select: undefined,
      where: {
        fullName: {
          contains: POPULATE_USER_DEFAULT.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        id: { not: POPULATE_USER_DEFAULT.id },
      },
      orderBy: [{ fullName: 'asc' }],
    });
  });

  it('should not find many users with outer enterprise id provided', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'active' },
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
    });

    expect(result).toHaveProperty('total', 0);
    expect(result).toHaveProperty('data', []);
  });

  it('should not get user permissions with outer enterprise id provided', async () => {
    await expect(
      userService.getPermissions({
        userId: POPULATE_USER_DEFAULT.id,
        enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should get user permissions', async () => {
    const permissions = await userService.getPermissions({
      userId: POPULATE_USER_DEFAULT.id,
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(permissions).toEqual({
      ACCOUNTS_PAYABLE: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      ACCOUNTS_RECEIVABLE: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      CUSTOMERS: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      STORES: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      USERS: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      VEHICLES: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      VEHICLE_EXPENSE: {
        CREATE: true,
        DELETE: true,
        READ: true,
        UPDATE: true,
      },
      VEHICLE_PURCHASE: {
        CREATE: false,
        DELETE: false,
        READ: true,
        UPDATE: true,
      },
      VEHICLE_SALE: {
        CREATE: true,
        DELETE: false,
        READ: true,
        UPDATE: true,
      },
    });
  });
});
