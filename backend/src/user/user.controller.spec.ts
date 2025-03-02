import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  ITEMS_PER_PAGE,
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_USER_DEFAULT,
  SEED_ROLE_ADMIN_ID,
} from '../constants';
import { FETCH_USER, GET_USER } from './user.constants';
import { EmailService } from '../email/email.service';
import { AuthRequest } from 'src/auth/auth.dto';

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
        await userController.create(request, {
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          roleId: SEED_ROLE_ADMIN_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
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

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userController.fetch({
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
      select: FETCH_USER,
    });
  });
});
