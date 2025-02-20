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
  AuthSignupInDto,
  AuthVerifyAccountInDto,
} from './auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authSigninInDto: AuthSigninInDto) {
    return await this.authService.signIn(authSigninInDto);
  }

  @Post('createPassword')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async singUp(
    @Req() req: AuthRequest,
    @Body() authSignupInDto: Pick<AuthSignupInDto, 'password'>,
  ) {
    const signUpPayload = {
      ...(req.authToken as AuthVerifyAccountInDto),
      ...authSignupInDto,
    };
    return await this.authService.signUp(signUpPayload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async verifyAccount(@Body() authSignupInDto: AuthVerifyAccountInDto) {
    return await this.authService.verifyAccount(authSignupInDto);
  }
}
