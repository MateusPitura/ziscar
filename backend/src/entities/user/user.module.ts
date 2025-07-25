import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRepository } from 'src/repositories/user-repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../infra/database/database.module';
import { EmailModule } from 'src/entities/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PdfModule } from 'src/helpers/pdf/pdf.module';
import { SheetModule } from 'src/sheet/sheet.module';
import { JWT_EXPIRATION_TIME } from 'src/constants';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: JWT_EXPIRATION_TIME,
        },
      }),
      inject: [ConfigService],
    }),
    PdfModule,
    SheetModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
