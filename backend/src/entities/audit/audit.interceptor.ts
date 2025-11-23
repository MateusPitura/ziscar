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

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        if (process.env.DISABLE_AUDIT === 'true') return;

        const req = context.switchToHttp().getRequest<AuthRequest>();
        const { userId, enterpriseId } = req.authToken || {};
        const ipAddress = req?.ip;

        const audit = {
          method: req?.method ?? null,
          url: req?.url ?? null,
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
