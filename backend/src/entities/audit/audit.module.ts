import { PrismaService } from 'src/infra/database/prisma.service';
import { AuditRepository } from 'src/repositories/audit-repository';
import { AuditService } from './audit.service';
import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';

@Module({
  controllers: [AuditController],
  providers: [PrismaService,
    {
      provide: AuditRepository,
      useClass: AuditService,
    },
    AuditService,],
  exports: [AuditRepository, AuditService],
})
export class AuditModule {}
