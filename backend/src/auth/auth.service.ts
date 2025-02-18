import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSigninInDto, AuthSigninOutDto, AuthSignupInDto } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ClientService } from 'src/client/client.service';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ADMIN_ROLE_ID } from 'prisma/seed';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: TransactionHost<TransactionalAdapterPrisma>,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async signIn({
    email,
    password,
  }: AuthSigninInDto): Promise<AuthSigninOutDto> {
    const user = await this.databaseService.tx.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        clientId: true,
        password: true,
      },
    });

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
  async signUp({ cnpj, name, email, fullName, password }: AuthSignupInDto) {
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
}
