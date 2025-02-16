import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninInDto, AuthSignupInDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authSigninInDto: AuthSigninInDto) {
    return await this.authService.signIn(authSigninInDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authSignupInDto: AuthSignupInDto) {
    return await this.authService.signUp(authSignupInDto);
  }
}
