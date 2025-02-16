import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSigninInDto, AuthSigninOutDto, AuthSignupInDto } from './auth.dto';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { ClientService } from 'src/client/client.service';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async signIn({
    email,
    password,
  }: AuthSigninInDto): Promise<AuthSigninOutDto> {
    const user = await this.prismaService.user.findUnique({
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
      roleId: 1,
    });

    // TODO: precisa de uma seed para as roles e permission
    // TODO: caso uma dê errado precisa dar rollback nas outras
  }
}
