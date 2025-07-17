import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OrganizationModule } from '../entities/organization/organization.module';
import { UserModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';
import { EmailModule } from '../entities/email/email.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JWT_EXPIRATION_TIME } from 'src/constants';

@Module({
  imports: [
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
    OrganizationModule,
    UserModule,
    ClientModule,
    EmailModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
