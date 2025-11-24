import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Observable, tap } from 'rxjs';
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
          process.env.DISABLE_AUDIT === 'true' ||
          url === HEALTH_CHECK_URL ||
          req.cookies['DISABLE_AUDIT'] === 'true'
        ) {
          return;
        }

        const { userId, enterpriseId } = req.authToken || {};
        const ipAddress = req?.ip;

        const audit = {
          method: req?.method ?? null,
          url,
          ipAddress: ipAddress ?? null,
          userId: userId ?? null,
          enterpriseId: enterpriseId ?? null,
          timestamp: new Date()?.toISOString() ?? null,
          stage: process.env.NODE_ENV ?? null,
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
