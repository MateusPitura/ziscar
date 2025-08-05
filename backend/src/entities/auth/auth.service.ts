import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthResetPassword,
  AuthSignin,
  ForgetPasswordInput,
  RequestChangePasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignOutInput,
  SignUpInput,
} from './auth.type';
import { compare } from 'bcrypt';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { SEED_ROLE_ADMIN_ID, JWT_COOKIE_NAME } from '@shared/constants';
import { FRONTEND_URL } from 'src/constants';
import { randomUUID } from 'crypto';
import handlePermissions from 'src/utils/handlePermissions';
import { isProduction } from 'src/constants';
import { UserService } from 'src/entities/user/user.service';
import { GET_PERMISSIONS } from 'src/entities/user/user.constant';
import { EnterpriseService } from 'src/entities/enterprise/enterprise.service';
import { StoreService } from 'src/entities/store/store.service';
import { Actions, Resources } from '@prisma/client';

// Temp: revise it later
export type RoleWithPermissions = {
  id: number;
  name: string;
  rolePermissions: {
    permission: { id: number; resource: Resources; action: Actions };
  }[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly enterpriseService: EnterpriseService,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async signIn({ authSignInInDto, res }: SignInInput) {
    const user = await this.userService.findOne({
      where: { email: authSignInInDto.email },
      select: {
        ...GET_PERMISSIONS,
        id: true,
        enterpriseId: true,
        password: true,
      },
      showNotFoundError: false,
    });

    if (!user || !(await compare(authSignInInDto.password, user.password))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const jit = randomUUID();

    await this.userService.update({
      where: { id: user.id },
      userUpdateInDto: { jit },
    });

    const permissions = handlePermissions({
      permissions:
        (user?.role as RoleWithPermissions)?.rolePermissions?.map(
          (rp) => rp.permission,
        ) ?? [],
    });

    const payload: AuthSignin = {
      enterpriseId: user.enterpriseId,
      userId: user.id,
      jit,
      permissions,
    };

    const token = this.jwtService.sign(payload);

    res?.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res?.json(true);
  }

  async signOut({ userId, enterpriseId, res }: SignOutInput) {
    await this.userService.update({
      where: { id: userId },
      userUpdateInDto: { jit: null },
      showNotFoundError: false,
      enterpriseId,
    });

    res?.clearCookie(JWT_COOKIE_NAME);

    return res?.json(true);
  }

  async signUp({ authSignUpInDto }: SignUpInput) {
    await this.prismaService.transaction(async (transaction) => {
      const { enterpriseId } = await this.enterpriseService.create({
        transaction,
      });

      await Promise.all([
        this.storeService.create({
          storeCreateInDto: {
            cnpj: authSignUpInDto.cnpj,
            name: authSignUpInDto.name,
            enterpriseId,
          },
          transaction,
        }),
        this.userService.create({
          userCreateInDto: {
            email: authSignUpInDto.email,
            fullName: authSignUpInDto.fullName,
            enterpriseId,
            roleId: SEED_ROLE_ADMIN_ID,
          },
          transaction,
        }),
      ]);
    });

    return true;
  }

  async resetPassword({ authResetPasswordInDto }: ResetPasswordInput) {
    await this.userService.update({
      where: { archivedAt: null, email: authResetPasswordInDto.email },
      userUpdateInDto: { password: authResetPasswordInDto.password },
      enterpriseId: authResetPasswordInDto.enterpriseId,
    });

    return true;
  }

  async forgetPassword({ authForgetPasswordInDto }: ForgetPasswordInput) {
    const user = await this.userService.findOne({
      where: { email: authForgetPasswordInDto.email },
      select: { enterpriseId: true },
      showNotFoundError: false,
    });

    if (!user) return true;

    const payload: AuthResetPassword = {
      email: authForgetPasswordInDto.email,
      enterpriseId: user.enterpriseId,
    };
    const token = this.jwtService.sign(payload);

    void this.emailService.sendEmail({
      to: authForgetPasswordInDto.email,
      title: 'Redefina sua senha',
      body: `${FRONTEND_URL}/?token=${token}`,
    });

    return true;
  }

  async requestChangePassword({
    requestChangePasswordInDto: requestChangePasswordInputInDto,
  }: RequestChangePasswordInput) {
    const user = await this.userService.findOne({
      where: { id: requestChangePasswordInputInDto.id },
      select: { email: true, enterpriseId: true },
      enterpriseId: requestChangePasswordInputInDto.enterpriseId,
    });

    const payload: AuthResetPassword = {
      email: user?.email ?? '',
      enterpriseId: user!.enterpriseId,
    };
    const token = this.jwtService.sign(payload);

    void this.emailService.sendEmail({
      to: user?.email ?? '',
      title: 'Redefina sua senha',
      body: `${FRONTEND_URL}/?token=${token}`,
    });

    return true;
  }
}
