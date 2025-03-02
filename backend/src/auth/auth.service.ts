import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthSigninInDto,
  AuthCreateAccountInDto,
  AuthVerifyCreateAccountInDto,
  AuthResetPasswordInDto,
  AuthVerifyResetPasswordInDto,
} from './auth.dto';
import { compareSync } from 'bcrypt';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { SEED_ROLE_ADMIN_ID } from '../constants';
import { PrismaService } from '../database/prisma.service';

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

  async signIn({ email, password }: AuthSigninInDto) {
    const user = await this.userService.get(
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

    const payload = {
      clientId: user.clientId,
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  async createAccount({
    cnpj,
    name,
    email,
    fullName,
    password,
  }: AuthCreateAccountInDto) {
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
          password,
          clientId,
          roleId: SEED_ROLE_ADMIN_ID,
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

  async verifyCreateAccount({
    cnpj,
    email,
    ...rest
  }: AuthVerifyCreateAccountInDto) {
    await Promise.all([
      this.userService.verifyDuplicated({ email }),
      this.organizationService.verifyDuplicated({ cnpj }),
    ]);

    const token = this.jwtService.sign({
      cnpj,
      email,
      ...rest,
    });

    void this.emailService.sendEmail({
      to: email,
      title: 'Confirme sua conta',
      body: `${token}`,
    });

    return true;
  }

  async verifyResetPassword({ email }: AuthVerifyResetPasswordInDto) {
    const user = await this.userService.get({ email }, { id: true });

    if (!user) {
      throw new NotFoundException();
    }

    const token = this.jwtService.sign({ email });

    void this.emailService.sendEmail({
      to: email,
      title: 'Redefina sua senha',
      body: `${token}`,
    });

    return true;
  }
}
