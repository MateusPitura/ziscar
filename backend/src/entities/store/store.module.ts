import { StoreService } from './store.service';
import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
