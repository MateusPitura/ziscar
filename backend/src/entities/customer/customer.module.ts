import { CustomerService } from './customer.service';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
