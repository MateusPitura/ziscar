import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';
import {
  FRONTEND_URL,
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_ORGANIZATION_DEFAULT,
  POPULATE_ORGANIZATION_INACTIVE,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../constants';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PdfService } from 'src/pdf/pdf.service';
import { SheetService } from 'src/sheet/sheet.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let userService: UserService;

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
            sign: jest.fn().mockReturnValue(''),
          },
        },
        {
          provide: PdfService,
          useValue: {
            generatePdf: jest.fn(),
          },
        },
        {
          provide: SheetService,
          useValue: {
            generateSheet: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should signin', async () => {
    const response = await authService.signIn({
      authSignInInDto: {
        email: POPULATE_USER_DEFAULT.email,
        password: POPULATE_USER_DEFAULT.password,
      },
    });

    expect(response).toBeUndefined();
  });

  it('should not signin an inactive user', async () => {
    await expect(
      authService.signIn({
        authSignInInDto: {
          email: POPULATE_USER_INACTIVE.email,
          password: POPULATE_USER_INACTIVE.password,
        },
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should not signin due to wrong password', async () => {
    await expect(
      authService.signIn({
        authSignInInDto: {
          email: POPULATE_USER_DEFAULT.email,
          password: 'wrongpassword',
        },
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should sign out', () => {
    const response = authService.signOut({});
    expect(response).toBeUndefined();
  });

  it('should create account', async () => {
    await prismaService.transaction(async (transaction) => {
      jest
        .spyOn(prismaService, 'transaction')
        .mockImplementation(async (callback) => {
          await callback(transaction);
        });

      const response = await authService.signUp({
        authSignUpInDto: {
          cnpj: '12345678901236',
          name: 'Wayne Enterprises',
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
        },
      });

      expect(response).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not create account due to duplicated email', async () => {
    await expect(
      authService.signUp({
        authSignUpInDto: {
          cnpj: '12345678901236',
          name: 'Wayne Enterprises',
          email: POPULATE_USER_DEFAULT.email,
          fullName: 'Jane Doe',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create account due to duplicated email of an inactive user', async () => {
    await expect(
      authService.signUp({
        authSignUpInDto: {
          cnpj: '12345678901236',
          name: 'Wayne Enterprises',
          email: POPULATE_USER_INACTIVE.email,
          fullName: 'Jane Doe',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create account due to duplicated CNPJ', async () => {
    await expect(
      authService.signUp({
        authSignUpInDto: {
          cnpj: POPULATE_ORGANIZATION_DEFAULT.cnpj,
          name: 'Wayne Enterprises',
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create account due to duplicated CNPJ of an inactive user', async () => {
    await expect(
      authService.signUp({
        authSignUpInDto: {
          cnpj: POPULATE_ORGANIZATION_INACTIVE.cnpj,
          name: 'Wayne Enterprises',
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should reset password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      const spy = jest.spyOn(authService['userService'], 'encryptPassword');

      const response = await authService.resetPassword({
        authResetPasswordInDto: {
          email: POPULATE_USER_DEFAULT.email,
          password: '123456',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
        },
      });

      expect(response).toBeTruthy();
      expect(spy).toHaveBeenCalledWith({ password: '123456' });

      transaction.rollback();
    });
  });

  it('should not reset password of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        authService.resetPassword({
          authResetPasswordInDto: {
            email: POPULATE_USER_INACTIVE.email,
            password: '123456',
            clientId: POPULATE_CLIENT_DEFAULT_ID,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should forget password', async () => {
    const spy = jest.spyOn(authService['emailService'], 'sendEmail');

    await authService.forgetPassword({
      authForgetPasswordInDto: {
        email: POPULATE_USER_DEFAULT.email,
      },
    });

    expect(spy).toHaveBeenCalledWith({
      to: POPULATE_USER_DEFAULT.email,
      title: 'Redefina sua senha',
      body: `${FRONTEND_URL}/?token=`,
    });
  });

  it('should not warn in forget password due to email that not exist', async () => {
    expect(
      await authService.forgetPassword({
        authForgetPasswordInDto: {
          email: 'jane.doe@email.com',
        },
      }),
    ).toBeTruthy();
  });

  it('should not warn in forget password due to email of an inactive user', async () => {
    expect(
      await authService.forgetPassword({
        authForgetPasswordInDto: {
          email: POPULATE_USER_INACTIVE.email,
        },
      }),
    ).toBeTruthy();
  });
});
