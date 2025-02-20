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
import { ClientService } from 'src/client/client.service';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';
import { Transactional } from '@nestjs-cls/transactional';
import { EmailService } from 'src/email/email.service';
import { ADMIN_ROLE_ID } from 'prisma/seed';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async signIn({ email, password }: AuthSigninInDto) {
    const user = await this.userService.findUniqueUser(
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

  @Transactional()
  async createAccount({
    cnpj,
    name,
    email,
    fullName,
    password,
  }: AuthCreateAccountInDto) {
    const { id } = await this.clientService.create();

    await this.organizationService.create({
      cnpj,
      name,
      clientId: id,
    });

    await this.userService.create({
      email,
      fullName,
      password,
      clientId: id,
      roleId: ADMIN_ROLE_ID,
    });
  }

  async resetPassword({ email, password }: AuthResetPasswordInDto) {
    await this.userService.changePassword(email, password);
  }

  async verifyCreateAccount({
    cnpj,
    email,
    ...rest
  }: AuthVerifyCreateAccountInDto) {
    await this.userService.verifyEmail(email);
    await this.organizationService.verifyCnpj(cnpj);

    const token = this.jwtService.sign({
      cnpj,
      email,
      ...rest,
    });

    await this.emailService.sendEmail({
      to: email,
      title: 'Confirme sua conta',
      body: `${token}`,
    });
  }

  async verifyResetPassword({ email }: AuthVerifyResetPasswordInDto) {
    const userEmail = await this.userService.findUniqueUser({ email });

    if (userEmail) {
      const token = this.jwtService.sign({ email });

      await this.emailService.sendEmail({
        to: email,
        title: 'Redefina sua senha',
        body: `${token}`,
      });
    } else {
      throw new NotFoundException();
    }
  }
}
