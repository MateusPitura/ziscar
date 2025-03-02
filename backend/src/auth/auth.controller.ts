import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthRequest,
  AuthSigninInDto,
  AuthVerifyResetPasswordOutDto,
  AuthVerifyResetPasswordInDto,
  AuthCreateAccountInDto,
} from './auth.dto';
import { AuthGuard } from './auth.guard';
import { UserPasswordInDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() authSigninInDto: AuthSigninInDto) {
    return await this.authService.signIn(authSigninInDto);
  }

  @Post('sign-up')
  async verifyCreateAccount(
    @Body() authCreateAccountInDto: AuthCreateAccountInDto,
  ) {
    return await this.authService.createAccount(authCreateAccountInDto);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Req() req: AuthRequest,
    @Body() { password }: UserPasswordInDto,
  ) {
    const { email } = req.authToken as AuthVerifyResetPasswordOutDto;
    return await this.authService.resetPassword({
      email,
      password,
    });
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() authVerifyResetPasswordInDto: AuthVerifyResetPasswordInDto,
  ) {
    return await this.authService.verifyResetPassword(
      authVerifyResetPasswordInDto,
    );
  }
}
