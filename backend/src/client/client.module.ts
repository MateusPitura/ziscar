import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [ClientService],
  imports: [DatabaseModule],
  exports: [ClientService],
})
export class ClientModule {}
