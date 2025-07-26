import { PrismaService } from 'src/infra/database/prisma.service';
import { AddressRepository } from 'src/repositories/address-repository';
import { AddressService } from './address.service';
import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';

@Module({
  controllers: [AddressController],
  providers: [
    PrismaService,
    {
      provide: AddressRepository,
      useClass: AddressService,
    },
    AddressService,
  ],
  exports: [AddressRepository, AddressService],
})
export class AddressModule {}
