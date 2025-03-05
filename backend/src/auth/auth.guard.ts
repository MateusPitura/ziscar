import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResetPassword, AuthSignin } from './auth.type';
import { Request } from 'express';
import { COOKIE_JWT_NAME } from 'src/constants';
import { UNAUTHORIZED } from '@shared/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const token = request.cookies[COOKIE_JWT_NAME] as string;

      if (!token) {
        throw new UnauthorizedException(UNAUTHORIZED);
      }

      const payload = await this.jwtService.verifyAsync<AuthSignin>(token, {
        secret: process.env.JWT_SECRET,
      });
      request['authToken'] = payload;
    } catch {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return true;
  }
}

@Injectable()
export class AuthGuardBodyToken implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const body = request.body as Record<string, string>;
      const token = body?.token;

      if (!token) {
        throw new UnauthorizedException(UNAUTHORIZED);
      }

      delete body.token;

      const payload = await this.jwtService.verifyAsync<AuthResetPassword>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      request['authToken'] = payload;
    } catch {
      throw new UnauthorizedException(UNAUTHORIZED);
    }

    return true;
  }
}
