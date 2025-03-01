import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';
import {
  POPULATE_ORGANIZATION_DEFAULT,
  POPULATE_USER_DEFAULT,
} from '../constants';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ClientService,
        OrganizationService,
        UserService,
        JwtService,
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
            sign: jest
              .fn()
              .mockReturnValue(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
              ),
            verify: jest.fn().mockReturnValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should signin', async () => {
    const response = await authService.signIn({
      email: POPULATE_USER_DEFAULT.email,
      password: POPULATE_USER_DEFAULT.password,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not signin due to wrong password', async () => {
    await expect(
      authService.signIn({
        email: POPULATE_USER_DEFAULT.email,
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should create account', async () => {
    await prismaService.transaction(async (transaction) => {
      const response = await authService.createAccount(
        {
          cnpj: '12345678901235',
          name: 'Wayne Enterprises',
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          password: '123456',
        },
        transaction,
      );

      expect(response).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not create account due to duplicated email', async () => {
    await prismaService.transaction(async (transaction) => {
      await expect(
        authService.createAccount(
          {
            cnpj: '12345678901235',
            name: 'Wayne Enterprises',
            email: POPULATE_USER_DEFAULT.email,
            fullName: 'Jane Doe',
            password: '123456',
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should not create account due to duplicated CNPJ', async () => {
    await prismaService.transaction(async (transaction) => {
      await expect(
        authService.createAccount(
          {
            cnpj: POPULATE_ORGANIZATION_DEFAULT.cnpj,
            name: 'Wayne Enterprises',
            email: 'jane.doe@email.com',
            fullName: 'Jane Doe',
            password: '123456',
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should reset password', async () => {
    await prismaService.transaction(async (transaction) => {
      const spy = jest.spyOn(authService['userService'], 'encryptPassword');

      const response = await authService.resetPassword({
        email: POPULATE_USER_DEFAULT.email,
        password: '123456',
      });

      expect(response).toBeTruthy();
      expect(spy).toHaveBeenCalledWith('123456');

      transaction.rollback();
    });
  });
});
