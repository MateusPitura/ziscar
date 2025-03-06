import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { COOKIE_JWT_NAME } from 'src/constants';
import { UNAUTHORIZED } from '@shared/constants';
import { AuthResetPassword, AuthSignin } from './auth.type';

@Injectable()
abstract class BaseAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  abstract getToken(request: Request): string | undefined;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const token = this.getToken(request);

      if (!token) {
        throw new UnauthorizedException(UNAUTHORIZED);
      }

      const payload = await this.jwtService.verifyAsync<
        AuthSignin | AuthResetPassword
      >(token, {
        secret: process.env.JWT_SECRET,
      });
      request['authToken'] = payload;
    } catch (error) {
      console.log('🌠 error: ', error);
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return true;
  }
}

@Injectable()
export class AuthGuard extends BaseAuthGuard {
  getToken(request: Request): string | undefined {
    return request.cookies[COOKIE_JWT_NAME] as string;
  }
}

@Injectable()
export class AuthGuardBodyToken extends BaseAuthGuard {
  getToken(request: Request): string | undefined {
    const body = request.body as Record<string, string | undefined>;
    const token = body?.token;
    if (token) {
      delete body.token;
    }
    return token;
  }
}
