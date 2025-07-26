import { PrismaService } from 'src/infra/database/prisma.service';
import { CustomerRepository } from 'src/repositories/customer-repository';
import { CustomerService } from './customer.service';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [PrismaService,
    {
      provide: CustomerRepository,
      useClass: CustomerService,
    },
    CustomerService,],
  exports: [CustomerRepository, CustomerService],
})
export class CustomerModule {}
