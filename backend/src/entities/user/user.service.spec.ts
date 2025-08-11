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
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  addressNullableFields,
  POPULATE_INACTIVE_ENTITIES_AMOUNT,
  POPULATE_OTHER_ENTITIES_AMOUNT,
} from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_USER } from 'src/constants/populate';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  afterEach(async () => {
    await prismaService.$disconnect();
    await module.close();
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
            enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
          email: POPULATE_USER.ADM.email,
          fullName: 'John Doe',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an user with an email of an inactive user', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: POPULATE_USER.INACTIVE.email,
          fullName: 'Tony Stark',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
          cpf: POPULATE_USER.INACTIVE.cpf,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
            enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
            enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
            id: POPULATE_USER.ADM.id,
          },
          userUpdateInDto: {
            fullName: 'Jane Doe',
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not verify duplicated if cpf is not passed', async () => {
    const spy = jest.spyOn(userService, 'verifyDuplicated');

    await userService.update({
      where: {
        id: POPULATE_USER.ADM.id,
      },
      userUpdateInDto: {
        phone: '42988884444',
      },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update user cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER.ADM.id,
          },
          userUpdateInDto: {
            cpf: '11111111111',
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with cpf that already exist', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          cpf: POPULATE_USER.ADM.cpf,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not update user with cpf of an inactive user', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          cpf: POPULATE_USER.INACTIVE.cpf,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER.ADM.id,
          },
          userUpdateInDto: {
            password: 'Senha12345@',
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      expect(spy).toHaveBeenCalledWith({ password: 'Senha12345@' });

      transaction.rollback();
    });
  });

  it('should not update password of an inactive user', async () => {
    const spy = jest.spyOn(userService, 'encryptPassword');

    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.INACTIVE.id,
        },
        userUpdateInDto: {
          password: 'Senha12345@',
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not update user with outer enterprise id provided', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          password: 'Senha12345@',
        },
        enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create user address and if already exist update all to null', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      const spy = jest.spyOn(transaction.user, 'update');

      const commonPayload = {
        where: {
          id: POPULATE_USER.ADM.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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

  it('should create store address and update user address with role', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      });

      const user = await userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          address: {
            update: { cityIbgeCode: 4119905 },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.city.ibgeCode', 4119905);
      expect(user).toHaveProperty('address.city.state', 'PR');
      expect(user).toHaveProperty('address.city.name', 'Ponta Grossa');
      expect(user).toHaveProperty('roleId', SEED_ROLE_SALES_ID);

      transaction.rollback();
    });
  });

  it('should thrown an exception if try to update user address and it not exist', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        userUpdateInDto: {
          address: {
            update: { street: 'Broadway' },
          },
        },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete user address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const commonPayload = {
        where: {
          id: POPULATE_USER.ADM.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          roleId: SEED_ROLE_ADMIN_ID,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          password: 'Senha12345@',
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          archivedAt: new Date(),
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
            id: POPULATE_USER.ADM.id,
          },
          userUpdateInDto: {
            archivedAt: new Date(),
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not disable inactive user', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.INACTIVE.id,
        },
        userUpdateInDto: {
          archivedAt: new Date(),
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should enable inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER.INACTIVE.id,
          },
          userUpdateInDto: {
            archivedAt: null,
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not enable active user', async () => {
    await expect(
      userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          archivedAt: null,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update user with allowed null values', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const result = await userService.update({
        where: {
          id: POPULATE_USER.ADM.id,
        },
        userUpdateInDto: {
          cpf: null,
          phone: null,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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

  it('should find user', async () => {
    const store = await userService.findOne({
      where: { id: POPULATE_USER.ADM.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(store).toHaveProperty('id');
  });

  it('should not find inactive user', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER.INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find inactive user', async () => {
    const user = await userService.findOne({
      where: { id: POPULATE_USER.INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find user with outer enterprise id provided', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER.ADM.id },
        select: { id: true },
        enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find many users with pagination', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const SIGNED_USER = 1;

    const calculatedUsers =
      POPULATE_OTHER_ENTITIES_AMOUNT +
      Object.keys(POPULATE_USER).length -
      POPULATE_INACTIVE_ENTITIES_AMOUNT -
      Object.values(POPULATE_USER).filter((item) => item.archivedAt !== null)
        .length -
      SIGNED_USER;

    expect(result).toHaveProperty('total', calculatedUsers);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users without signed user', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const signedUser = result.data.find(
      (item) => item.id === POPULATE_USER.ADM.id,
    );

    const SIGNED_USER = 1;

    const calculatedUsers =
      POPULATE_OTHER_ENTITIES_AMOUNT +
      Object.keys(POPULATE_USER).length -
      POPULATE_INACTIVE_ENTITIES_AMOUNT -
      Object.values(POPULATE_USER).filter((item) => item.archivedAt !== null)
        .length -
      SIGNED_USER;

    expect(signedUser).toBeUndefined();
    expect(result).toHaveProperty('total', calculatedUsers);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        fullName: POPULATE_USER.ADM.fullName,
      },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          fullName: {
            contains: POPULATE_USER.ADM.fullName.toLocaleLowerCase(),
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
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many users by status igual to inactive', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'inactive' },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const calculatedUsers =
      POPULATE_INACTIVE_ENTITIES_AMOUNT +
      Object.values(POPULATE_USER).filter((item) => item.archivedAt !== null)
        .length;

    expect(result).toHaveProperty('total', calculatedUsers);
  });

  it('should find many users by startDate', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { startDate: '2000-01-01' },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const SIGNED_USER = 1;

    const calculatedUsers =
      POPULATE_OTHER_ENTITIES_AMOUNT +
      Object.keys(POPULATE_USER).length -
      POPULATE_INACTIVE_ENTITIES_AMOUNT -
      Object.values(POPULATE_USER).filter((item) => item.archivedAt !== null)
        .length -
      SIGNED_USER;

    expect(result).toHaveProperty('total', calculatedUsers);
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        page: 1,
        status: 'active',
        fullName: POPULATE_USER.ADM.fullName,
        orderBy: 'fullName',
        startDate: '2000-01-01',
      },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      select: undefined,
      where: {
        fullName: {
          contains: POPULATE_USER.ADM.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        createdAt: {
          gte: new Date('2000-01-01'),
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        id: { not: POPULATE_USER.ADM.id },
      },
      orderBy: [{ fullName: 'asc' }],
    });
  });

  it('should not find many users with outer enterprise id provided', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'active' },
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
    });

    expect(result).toHaveProperty('total', 0);
    expect(result).toHaveProperty('data', []);
  });

  it('should not get user permissions with outer enterprise id provided', async () => {
    await expect(
      userService.getPermissions({
        userId: POPULATE_USER.ADM.id,
        enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should get user permissions', async () => {
    const permissions = await userService.getPermissions({
      userId: POPULATE_USER.ADM.id,
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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
