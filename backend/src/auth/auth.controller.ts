import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest, AuthResetPasswordOutDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import {
  AuthForgetPasswordInDtoInputs,
  AuthSignInInDtoInputs,
  AuthSignUpInDtoInputs,
  PasswordInputs,
  SchemaAuthForgetPasswordInDto,
  SchemaAuthSigInInDto,
  SchemaAuthSignUpInDto,
  SchemaPassword,
} from './auth.schema';
import { ZodPipe } from 'src/utils/ZodPipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body(new ZodPipe(SchemaAuthSigInInDto))
    authSigninInDto: AuthSignInInDtoInputs,
  ) {
    return await this.authService.signIn(authSigninInDto);
  }

  @Post('sign-up')
  async signUp(
    @Body(new ZodPipe(SchemaAuthSignUpInDto))
    authSignUpInDto: AuthSignUpInDtoInputs,
  ) {
    return await this.authService.signUp(authSignUpInDto);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Req() req: AuthRequest,
    @Body(new ZodPipe(SchemaPassword)) { password }: PasswordInputs,
  ) {
    const { email } = req.authToken as AuthResetPasswordOutDto;
    return await this.authService.resetPassword({
      email,
      password,
    });
  }

  @Post('forget-password')
  async forgetPassword(
    @Body(new ZodPipe(SchemaAuthForgetPasswordInDto))
    authForgetPasswordInDto: AuthForgetPasswordInDtoInputs,
  ) {
    return await this.authService.forgetPassword(authForgetPasswordInDto);
  }
}
