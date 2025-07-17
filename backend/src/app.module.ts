import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './infra/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { OrganizationModule } from './entities/organization/organization.module';
import { EmailModule } from './entities/email/email.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PdfModule } from './helpers/pdf/pdf.module';
import { SheetModule } from './sheet/sheet.module';
import { AuditInterceptor } from './infra/audit/audit.interceptor';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    DatabaseModule,
    ClientModule,
    OrganizationModule,
    EmailModule,
    PdfModule,
    SheetModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule { }
