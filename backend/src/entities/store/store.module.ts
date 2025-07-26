import { PrismaService } from 'src/infra/database/prisma.service';
import { StoreRepository } from 'src/repositories/store-repository';
import { StoreService } from './store.service';
import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';

@Module({
  controllers: [StoreController],
  providers: [
    PrismaService,
    {
      provide: StoreRepository,
      useClass: StoreService,
    },
    StoreService,
  ],
  exports: [StoreRepository, StoreService],
})
export class StoreModule {}
