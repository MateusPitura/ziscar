import { PrismaService } from 'src/infra/database/prisma.service';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { PermissionService } from './permission.service';
import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [
    PrismaService,
    {
      provide: PermissionRepository,
      useClass: PermissionService,
    },
    PermissionService,
  ],
  exports: [PermissionRepository, PermissionService],
})
export class PermissionModule {}
