import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResetPassword, AuthSignin } from './auth.type';
import { compareSync } from 'bcrypt';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../database/prisma.service';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import {
  AuthForgetPasswordInDto,
  AuthResetPasswordInDto,
  AuthSignInInDto,
  AuthSignUpInDto,
} from './auth.schema';
import { SEED_ROLE_SALES_ID } from '@shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async signIn({ email, password }: AuthSignInInDto) {
    const user = await this.userService.findOne(
      { email },
      {
        id: true,
        clientId: true,
        password: true,
      },
    );

    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload: AuthSignin = {
      clientId: user.clientId,
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  async signUp({ cnpj, name, email, fullName }: AuthSignUpInDto) {
    await this.prismaService.transaction(async (transaction) => {
      const { clientId } = await this.clientService.create(transaction);

      await this.organizationService.create(
        {
          cnpj,
          name,
          clientId,
        },
        transaction,
      );

      await this.userService.create(
        {
          email,
          fullName,
          clientId,
          roleId: SEED_ROLE_SALES_ID,
        },
        transaction,
      );
    });

    return true;
  }

  async resetPassword({ email, password }: AuthResetPasswordInDto) {
    await this.userService.update({ email }, { password });

    return true;
  }

  async forgetPassword({ email }: AuthForgetPasswordInDto) {
    const user = await this.userService.findOne({ email }, { id: true });

    if (!user) {
      throw new NotFoundException();
    }

    const payload: AuthResetPassword = {
      email,
    };
    const token = this.jwtService.sign(payload);

    void this.emailService.sendEmail({
      to: email,
      title: 'Redefina sua senha',
      body: `${token}`,
    });

    return true;
  }

  generateRandomPassword() {
    return generateRandomPassword();
  }
}
