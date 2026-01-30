import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { Observable, tap } from 'rxjs';
import { isProduction } from 'src/constants';
import { AuthRequest } from '../auth/auth.type';

const app = initializeApp({ projectId: 'project-ziscar' });
const db = getFirestore(app);

const HEALTH_CHECK_URL = '/';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest<AuthRequest>();

        const url = req?.url ?? null;

        if (
          process.env.DISABLE_AUDIT_ZISCAR === 'true' ||
          url === HEALTH_CHECK_URL ||
          req.cookies['DISABLE_AUDIT_ZISCAR'] === 'true'
        ) {
          return;
        }

        let clientId = req.cookies['CLIENT_ID_ZISCAR'] as string;
        if (!clientId) {
          clientId = nanoid();

          const res = context.switchToHttp().getResponse<Response>();

          res?.cookie('CLIENT_ID_ZISCAR', clientId, {
            httpOnly: true,
            secure: isProduction ? true : false,
            sameSite: isProduction ? 'none' : 'lax',
          });
        }

        const { userId, enterpriseId } = req.authToken || {};

        const forwarded = req.headers['x-forwarded-for'];
        const ipAddress = Array.isArray(forwarded)
          ? forwarded[0]
          : forwarded?.split(',')[0];

        const audit = {
          method: req?.method ?? null,
          url,
          ipAddress: ipAddress ?? null,
          userId: userId ?? null,
          enterpriseId: enterpriseId ?? null,
          timestamp: new Date()?.toISOString() ?? null,
          stage: process.env.NODE_ENV ?? null,
          clientId,
        };

        try {
          void addDoc(collection(db, 'backend'), audit);
        } catch (error) {
          console.error('Cannot save audit', error);
        }
      }),
    );
  }
}
