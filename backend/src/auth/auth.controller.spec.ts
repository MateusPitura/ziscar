import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { POPULATE_USER_DEFAULT } from '../constants';
import { AuthRequest } from './auth.type';

describe('AuthController', () => {
  let authController: AuthController;
  let prismaService: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        ClientService,
        OrganizationService,
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

  it('should signin', async () => {
    const response = await authController.signIn({
      email: POPULATE_USER_DEFAULT.email,
      password: POPULATE_USER_DEFAULT.password,
    });

    expect(response).toHaveProperty('token');
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
          cnpj: '12345678901235',
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
        email: POPULATE_USER_DEFAULT.email,
      };

      expect(
        await authController.forgetPassword(resetPasswordPayload),
      ).toBeTruthy();

      const request = new Request('http://localhost:3000') as AuthRequest;
      request.authToken = resetPasswordPayload;

      const response = await authController.resetPassword(request, {
        password: '1234567',
      });

      expect(response).toBeTruthy();

      transaction.rollback();
    });
  });
});
