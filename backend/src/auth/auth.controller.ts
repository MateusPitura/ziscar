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
import { AuthRequest, AuthResetPassword } from './auth.type';
import { AuthGuard } from './auth.guard';
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
  async signIn(@Body() authSigninInDto: AuthSignInInDto, @Res() res: Response) {
    return await this.authService.signIn(authSigninInDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Res() res: Response) {
    return this.authService.signOut(res);
  }

  @Post('sign-up')
  async signUp(@Body() authSignUpInDto: AuthSignUpInDto) {
    return await this.authService.signUp(authSignUpInDto);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Req() req: AuthRequest,
    @Body() { password }: PasswordInDto,
  ) {
    const { email } = req.authToken as AuthResetPassword;
    return await this.authService.resetPassword({
      email,
      password,
    });
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() authForgetPasswordInDto: AuthForgetPasswordInDto,
  ) {
    return await this.authService.forgetPassword(authForgetPasswordInDto);
  }
}
