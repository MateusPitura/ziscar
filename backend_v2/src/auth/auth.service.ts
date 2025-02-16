import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, userPassword: string) {
    const user = await this.userService.user({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await compare(userPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
