import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestBodyToken } from './auth.type';
import { AuthGuardBodyToken } from './auth.guard';
import {
  AuthForgetPasswordInDto,
  AuthSignInInDto,
  AuthSignUpInDto,
  PasswordInDto,
} from './auth.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() authSignInInDto: AuthSignInInDto,
    @Res() res?: Response,
  ) {
    return await this.authService.signIn({
      authSignInInDto,
      res,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Res() res?: Response) {
    return this.authService.signOut({ res });
  }

  @Post('sign-up')
  async signUp(@Body() authSignUpInDto: AuthSignUpInDto) {
    return await this.authService.signUp({ authSignUpInDto });
  }

  @Post('reset-password')
  @UseGuards(AuthGuardBodyToken)
  async resetPassword(
    @Req() req: AuthRequestBodyToken,
    @Body() { password }: PasswordInDto,
  ) {
    const { email } = req.authToken;
    return await this.authService.resetPassword({
      authResetPasswordInDto: {
        email,
        password,
      },
    });
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() authForgetPasswordInDto: AuthForgetPasswordInDto,
  ) {
    return await this.authService.forgetPassword({
      authForgetPasswordInDto,
    });
  }
}
