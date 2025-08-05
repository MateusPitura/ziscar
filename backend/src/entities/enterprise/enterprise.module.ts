import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  providers: [EnterpriseService],
  imports: [DatabaseModule],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
