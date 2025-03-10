import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Methods } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { AuthRequest } from 'src/auth/auth.type';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest<AuthRequest>();
        if (req.method !== 'GET' && !req.url.includes('auth')) {
          const { userId, clientId } = req.authToken || {};
          const ipAddress = req.ip?.replace('::ffff:', '');

          void this.prismaService.audit
            .create({
              data: {
                method: req.method as Methods,
                url: req.url,
                ipAddress,
                userId,
                clientId,
              },
            })
            .then(() => {});
        }
      }),
    );
  }
}
