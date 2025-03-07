import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../constants';
import { FETCH_USER, GET_USER } from './user.constant';
import { EmailService } from '../email/email.service';
import { AuthRequest } from 'src/auth/auth.type';
import { ITEMS_PER_PAGE, SEED_ROLE_SALES_ID } from '@shared/constants';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
        JwtService,
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

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: POPULATE_USER_DEFAULT.id,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      expect(
        await userController.post(request, {
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should find signed user', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    const user = await userController.getProfile(request);

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not find inactive user', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    await expect(
      userController.get(request, { id: POPULATE_USER_INACTIVE.id }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not find signed inactive user', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_INACTIVE.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    await expect(userController.getProfile(request)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find one user by id', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: 1,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    const user = await userController.get(request, {
      id: POPULATE_USER_DEFAULT.id,
    });

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not allow find user by id equal to signed id', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    await expect(
      userController.get(request, {
        id: POPULATE_USER_DEFAULT.id,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should update user email and return the same properties of get user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: 1,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      const user = await userController.patch(
        request,
        { id: POPULATE_USER_DEFAULT.id },
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

  it('should not allow update user email by id equal to signed id', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: POPULATE_USER_DEFAULT.id,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      await expect(
        userController.patch(
          request,
          { id: POPULATE_USER_DEFAULT.id },
          {
            email: 'jane.doe@email.com',
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should update signed user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: POPULATE_USER_DEFAULT.id,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      const user = await userController.patchProfile(request, {
        email: 'jane.doe@email.com',
      });

      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    await userController.fetch(request, {
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
        NOT: {
          id: POPULATE_USER_DEFAULT.id,
        },
      },
      orderBy: [{ fullName: 'asc' }],
      select: FETCH_USER,
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: 1,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      expect(
        await userController.disable(
          request,
          { id: POPULATE_USER_DEFAULT.id },
          {
            isActive: false,
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not allow disable user by id with id equal to signed id ', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = {
        userId: POPULATE_USER_DEFAULT.id,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      };

      await expect(
        userController.disable(
          request,
          { id: POPULATE_USER_DEFAULT.id },
          {
            isActive: false,
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should get user permissions', async () => {
    const request = new Request('http://localhost:3000') as AuthRequest;
    request.authToken = {
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_DEFAULT_ID,
    };

    const permissions = await userController.getPermissions(request);

    expect(permissions).toBeTruthy();
  });
});
