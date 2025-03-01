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
import { SendEmailInDto } from '../email/email.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  let mailman: SendEmailInDto;

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
            sendEmail: jest.fn((data: SendEmailInDto) => {
              mailman = data;
            }),
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

  it('should verify create account', async () => {
    await authService.verifyCreateAccount({
      cnpj: '12345678901235',
      email: 'jane.doe@email.com',
      fullName: 'Jane Doe',
      name: 'Wayne Enterprises',
    });

    expect(mailman).toHaveProperty('to', 'jane.doe@email.com');
    expect(mailman).toHaveProperty('title', 'Confirme sua conta');
    expect(mailman).toHaveProperty('body', '');
  });

  it('should not verify create account due to duplicated email', async () => {
    await expect(
      authService.verifyCreateAccount({
        cnpj: '12345678901235',
        email: POPULATE_USER_DEFAULT.email,
        fullName: 'Jane Doe',
        name: 'Wayne Enterprises',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not verify create account due to duplicated CNPJ', async () => {
    await expect(
      authService.verifyCreateAccount({
        cnpj: POPULATE_ORGANIZATION_DEFAULT.cnpj,
        email: 'jane.doe@email.com',
        fullName: 'Jane Doe',
        name: 'Wayne Enterprises',
      }),
    ).rejects.toThrow(ConflictException);
  });

  // falta o teste do verify reset password
});
