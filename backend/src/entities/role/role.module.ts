import { PrismaService } from 'src/infra/database/prisma.service';
import { RoleRepository } from 'src/repositories/role-repository';
import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [
    PrismaService,
    {
      provide: RoleRepository,
      useClass: RoleService,
    },
    RoleService,
  ],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
