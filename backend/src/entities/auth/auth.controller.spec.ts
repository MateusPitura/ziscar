import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infra/database/prisma.service';
import { EmailService } from '../email/email.service';
import { AUTH_REQUEST_DEFAULT, RANDOM_URL } from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_USER } from 'src/constants/populate';
import { AuthRequestResetPassword } from './auth.type';
import { UserService } from 'src/entities/user/user.service';
import { StoreService } from 'src/entities/store/store.service';
import { EnterpriseService } from 'src/entities/enterprise/enterprise.service';

describe('AuthController', () => {
  let authController: AuthController;
  let prismaService: PrismaService;
  let userService: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        EnterpriseService,
        StoreService,
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

    authController = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should signin', async () => {
    const response = await authController.signIn({
      email: POPULATE_USER.ADM.email,
      password: POPULATE_USER.ADM.password,
    });

    expect(response).toBeUndefined();
  });

  it('should signout', () => {
    const response = authController.signOut();

    expect(response).toBeUndefined();
  });

  it('should create an account', async () => {
    await prismaService.transaction(async (transaction) => {
      jest
        .spyOn(prismaService, 'transaction')
        .mockImplementation(async (callback) => {
          await callback(transaction);
        });

      expect(
        await authController.signUp({
          cnpj: '12345678901236',
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          name: 'Wayne Enterprises',
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should verify forget password and reset password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const resetPasswordPayload = {
        email: POPULATE_USER.ADM.email,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      };

      expect(
        await authController.forgetPassword(resetPasswordPayload),
      ).toBeTruthy();

      const request = {
        ...new Request(RANDOM_URL),
        authToken: resetPasswordPayload,
      } as unknown as AuthRequestResetPassword;

      const response = await authController.resetPassword(request, {
        password: '1234567',
      });

      expect(response).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should request change password', async () => {
    const response =
      await authController.requestChangePassword(AUTH_REQUEST_DEFAULT);

    expect(response).toBeTruthy();
  });
});
