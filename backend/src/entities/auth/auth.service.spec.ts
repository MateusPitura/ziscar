import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { FRONTEND_URL } from 'src/constants';
import {
  POPULATE_ENTERPRISE,
  POPULATE_STORE,
  POPULATE_USER,
} from 'src/constants/populate';
import { EnterpriseService } from 'src/entities/enterprise/enterprise.service';
import { StoreService } from 'src/entities/store/store.service';
import { UserService } from 'src/entities/user/user.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { EmailService } from '../email/email.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let userService: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        StoreService,
        EnterpriseService,
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should signin and update jit', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      const response = await authService.signIn({
        authSignInInDto: {
          email: POPULATE_USER.ADM.email,
          password: POPULATE_USER.ADM.password,
        },
      });

      expect(response).toBeUndefined();

      transaction.rollback();
    });
  });

  it('should not signin an inactive user, throw unauthorized and not update jit', async () => {
    const spy = jest.spyOn(userService, 'update');

    await expect(
      authService.signIn({
        authSignInInDto: {
          email: POPULATE_USER.INACTIVE.email,
          password: POPULATE_USER.INACTIVE.password,
        },
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not signin due to wrong password and not update jit', async () => {
    const spy = jest.spyOn(userService, 'update');

    await expect(
      authService.signIn({
        authSignInInDto: {
          email: POPULATE_USER.ADM.email,
          password: 'wrongpassword',
        },
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should sign out and set jit to null', () => {
    const response = authService.signOut({});
    expect(response).toBeUndefined();
  });

  it('should not throw error when sign out with outer enterprise id', () => {
    const response = authService.signOut({});
    expect(response).toBeUndefined();
  });

  it('should not throw error when sign out with a inactive user', () => {
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
          email: POPULATE_USER.ADM.email,
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
          email: POPULATE_USER.INACTIVE.email,
          fullName: 'Jane Doe',
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create account due to duplicated CNPJ', async () => {
    await expect(
      authService.signUp({
        authSignUpInDto: {
          cnpj: POPULATE_STORE.DEFAULT.cnpj,
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
          cnpj: POPULATE_STORE.INACTIVE.cnpj,
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
          email: POPULATE_USER.ADM.email,
          password: 'Senha12345@',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      });

      expect(response).toBeTruthy();
      expect(spy).toHaveBeenCalledWith({ password: 'Senha12345@' });

      transaction.rollback();
    });
  });

  it('should not reset password of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        authService.resetPassword({
          authResetPasswordInDto: {
            email: POPULATE_USER.INACTIVE.email,
            password: 'Senha12345@',
            enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should not reset password with outer enterprise id provided', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        authService.resetPassword({
          authResetPasswordInDto: {
            email: POPULATE_USER.ADM.email,
            password: 'Senha12345@',
            enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
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
        email: POPULATE_USER.ADM.email,
      },
    });

    expect(spy).toHaveBeenCalledWith({
      to: POPULATE_USER.ADM.email,
      title: 'Redefina sua senha',
      html: expect.stringContaining(`${FRONTEND_URL}/?token=`) as string,
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
          email: POPULATE_USER.INACTIVE.email,
        },
      }),
    ).toBeTruthy();
  });

  it('should request change password', async () => {
    const spy = jest.spyOn(authService['emailService'], 'sendEmail');

    await authService.requestChangePassword({
      requestChangePasswordInDto: {
        id: POPULATE_USER.ADM.id,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      },
    });

    expect(spy).toHaveBeenCalledWith({
      to: POPULATE_USER.ADM.email,
      title: 'Redefina sua senha',
      html: expect.stringContaining(`${FRONTEND_URL}/?token=`) as string,
    });
  });

  it('should thown an error due to email of an inactive user', async () => {
    await expect(
      authService.requestChangePassword({
        requestChangePasswordInDto: {
          id: POPULATE_USER.INACTIVE.id,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
