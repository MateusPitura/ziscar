import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { FETCH_STORE, GET_STORE } from './store.constant';
import { AuthRequest } from 'src/entities/auth/auth.type';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AUTH_REQUEST_DEFAULT } from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_STORE } from 'src/constants/populate';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

describe('StoreController', () => {
  let storeController: StoreController;
  let storeService: StoreService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        StoreService,
        PrismaService,
        AuthGuard,
        UserService,
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

    storeController = module.get<StoreController>(StoreController);
    prismaService = module.get<PrismaService>(PrismaService);
    storeService = module.get<StoreService>(StoreService);
  });

  it('should create an store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      expect(
        await storeController.post(AUTH_REQUEST_DEFAULT, {
          cnpj: '12345678901236',
          name: 'LexCorp',
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not find inactive store', async () => {
    await expect(
      storeController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_STORE.INACTIVE.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find one store by id', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: 1,
      },
    } as AuthRequest;

    const store = await storeController.get(request, {
      id: POPULATE_STORE.DEFAULT.id,
    });

    for (const key in GET_STORE) {
      expect(store).toHaveProperty(key);
    }
  });

  it('should update store and return the same properties of get store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      const store = await storeController.patch(
        request,
        { id: POPULATE_STORE.DEFAULT.id },
        {
          name: 'InGen',
        },
      );

      for (const key in GET_STORE) {
        expect(store).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should find many stores with many filters', async () => {
    const spy = jest.spyOn(prismaService.store, 'findMany');

    await storeController.findMany(AUTH_REQUEST_DEFAULT, {
      page: 1,
      status: 'active',
      name: POPULATE_STORE.DEFAULT.name,
      orderBy: 'name',
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      where: {
        name: {
          contains: POPULATE_STORE.DEFAULT.name.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      },
      orderBy: [{ name: 'asc' }],
      select: FETCH_STORE,
    });
  });

  it('should disable store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      expect(
        await storeController.disable(
          request,
          { id: POPULATE_STORE.DEFAULT.id },
          {
            archivedAt: new Date(),
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });
});
