import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { FETCH_CUSTOMER, GET_CUSTOMER } from './customer.constant';
import { AuthRequest } from 'src/entities/auth/auth.type';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AUTH_REQUEST_DEFAULT } from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_CUSTOMER } from 'src/constants/populate';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
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

    customerController = module.get<CustomerController>(CustomerController);
    prismaService = module.get<PrismaService>(PrismaService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should create an customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      expect(
        await customerController.post(AUTH_REQUEST_DEFAULT, {
          cpf: '00458468045',
          fullName: 'Sam',
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not find inactive customer', async () => {
    await expect(
      customerController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_CUSTOMER.INACTIVE.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find one customer by id', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: 1,
      },
    } as AuthRequest;

    const customer = await customerController.get(request, {
      id: POPULATE_CUSTOMER.DEFAULT.id,
    });

    for (const key in GET_CUSTOMER) {
      expect(customer).toHaveProperty(key);
    }
  });

  it('should update customer and return the same properties of get customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      const customer = await customerController.patch(
        request,
        { id: POPULATE_CUSTOMER.DEFAULT.id },
        {
          fullName: 'Glen',
        },
      );

      for (const key in GET_CUSTOMER) {
        expect(customer).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should find many customers with many filters', async () => {
    const spy = jest.spyOn(prismaService.customer, 'findMany');

    await customerController.findMany(AUTH_REQUEST_DEFAULT, {
      page: 1,
      status: 'active',
      fullName: POPULATE_CUSTOMER.DEFAULT.fullName,
      orderBy: 'fullName',
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      where: {
        fullName: {
          contains: POPULATE_CUSTOMER.DEFAULT.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      },
      orderBy: [{ fullName: 'asc' }],
      select: FETCH_CUSTOMER,
    });
  });

  it('should disable customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      expect(
        await customerController.disable(
          request,
          { id: POPULATE_CUSTOMER.DEFAULT.id },
          {
            archivedAt: new Date(),
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });
});
