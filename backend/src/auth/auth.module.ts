import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailModule } from '../entities/email/email.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JWT_EXPIRATION_TIME } from 'src/constants';
import { UserModule } from 'src/entities/user/user.module';
import { StoreModule } from 'src/entities/store/store.module';
import { EnterpriseModule } from 'src/entities/enterprise/enterprise.module';

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
    StoreModule,
    UserModule,
    EnterpriseModule,
    EmailModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
