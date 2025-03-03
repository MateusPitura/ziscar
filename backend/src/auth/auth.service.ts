import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResetPasswordOutDto, AuthSigninOutDto } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { SEED_ROLE_ADMIN_ID } from '../constants';
import { PrismaService } from '../database/prisma.service';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import {
  AuthForgetPasswordInDtoInputs,
  AuthResetPasswordInDtoInputs,
  AuthSignInInDtoInputs,
  AuthSignUpInDtoInputs,
} from './auth.schema';

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

  async signIn({ email, password }: AuthSignInInDtoInputs) {
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

    const payload: AuthSigninOutDto = {
      clientId: user.clientId,
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  async signUp({ cnpj, name, email, fullName }: AuthSignUpInDtoInputs) {
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
          roleId: SEED_ROLE_ADMIN_ID,
        },
        transaction,
      );
    });

    return true;
  }

  async resetPassword({ email, password }: AuthResetPasswordInDtoInputs) {
    await this.userService.update({ email }, { password });

    return true;
  }

  async forgetPassword({ email }: AuthForgetPasswordInDtoInputs) {
    const user = await this.userService.findOne({ email }, { id: true });

    if (!user) {
      throw new NotFoundException();
    }

    const payload: AuthResetPasswordOutDto = {
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
