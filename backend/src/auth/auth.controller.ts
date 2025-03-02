import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthRequest,
  AuthSigninInDto,
  AuthVerifyCreateAccountInDto,
  AuthPasswordInDto,
  AuthVerifyCreateAccountOutDto,
  AuthVerifyResetPasswordOutDto,
  AuthVerifyResetPasswordInDto,
} from './auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() authSigninInDto: AuthSigninInDto) {
    return await this.authService.signIn(authSigninInDto);
  }

  @Post('create-password')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createAccount(
    @Req() req: AuthRequest,
    @Body() authPasswordInDto: AuthPasswordInDto,
  ) {
    const createAccountPayload = {
      ...(req.authToken as AuthVerifyCreateAccountOutDto),
      ...authPasswordInDto,
    };
    return await this.authService.createAccount(createAccountPayload);
  }

  @Post('sign-up')
  async verifyCreateAccount(
    @Body() authVerifyCreateAccountInDto: AuthVerifyCreateAccountInDto,
  ) {
    return await this.authService.verifyCreateAccount(
      authVerifyCreateAccountInDto,
    );
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Req() req: AuthRequest,
    @Body() authPasswordInDto: AuthPasswordInDto,
  ) {
    const resetPasswordPayload = {
      ...(req.authToken as AuthVerifyResetPasswordOutDto),
      ...authPasswordInDto,
    };
    return await this.authService.resetPassword(resetPasswordPayload);
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
