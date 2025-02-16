import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [OrganizationService],
  imports: [DatabaseModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}
