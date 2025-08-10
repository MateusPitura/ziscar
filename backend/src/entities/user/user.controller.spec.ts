import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { FETCH_USER, GET_USER } from './user.constant';
import { EmailService } from '../email/email.service';
import { AuthRequest } from 'src/entities/auth/auth.type';
import { ITEMS_PER_PAGE, SEED_ROLE_SALES_ID } from '@shared/constants';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AUTH_REQUEST_DEFAULT } from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_USER } from 'src/constants/populate';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    userController = module.get<UserController>(UserController);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should create an user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userController.post(AUTH_REQUEST_DEFAULT, {
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should find signed user', async () => {
    const user = await userController.getProfile(AUTH_REQUEST_DEFAULT);

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not find inactive user', async () => {
    await expect(
      userController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_USER.INACTIVE.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not find signed inactive user', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: POPULATE_USER.INACTIVE.id,
      },
    } as AuthRequest;

    await expect(userController.getProfile(request)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find one user by id', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: 1,
      },
    } as AuthRequest;

    const user = await userController.get(request, {
      id: POPULATE_USER.ADM.id,
    });

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not allow find user by id equal to signed id', async () => {
    await expect(
      userController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_USER.ADM.id,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should update user and return the same properties of get user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      const user = await userController.patch(
        request,
        { id: POPULATE_USER.ADM.id },
        {
          fullName: 'Jane Doe',
        },
      );

      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should not allow update user with id equal to signed id', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userController.patch(
          AUTH_REQUEST_DEFAULT,
          { id: POPULATE_USER.ADM.id },
          {
            fullName: 'Jane Doe',
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should update signed user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userController.patchProfile(AUTH_REQUEST_DEFAULT, {
        fullName: 'Jane Doe',
      });

      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userController.findMany(AUTH_REQUEST_DEFAULT, {
      page: 1,
      status: 'active',
      fullName: POPULATE_USER.ADM.fullName,
      orderBy: 'fullName',
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      where: {
        fullName: {
          contains: POPULATE_USER.ADM.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        id: {
          not: POPULATE_USER.ADM.id,
        },
      },
      orderBy: [{ fullName: 'asc' }],
      select: FETCH_USER,
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      expect(
        await userController.disable(
          request,
          { id: POPULATE_USER.ADM.id },
          {
            archivedAt: new Date(),
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not allow disable user by id with id equal to signed id ', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userController.disable(
          AUTH_REQUEST_DEFAULT,
          { id: POPULATE_USER.ADM.id },
          {
            archivedAt: new Date(),
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should get user permissions', async () => {
    const permissions =
      await userController.getPermissions(AUTH_REQUEST_DEFAULT);

    expect(permissions).toBeTruthy();
  });
});
