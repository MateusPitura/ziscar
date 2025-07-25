import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [],
})
export class RoleModule {}
