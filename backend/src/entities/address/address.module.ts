import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';

@Module({
  controllers: [AddressController],
  providers: [],
})
export class AddressModule {}
