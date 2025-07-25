import { PrismaService } from 'src/infra/database/prisma.service';
import { ClientRepository } from 'src/repositories/client-repository';
import { ClientService } from './client.service';
import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  providers: [PrismaService,
    {
      provide: ClientRepository,
      useClass: ClientService,
    },
    ClientService,],
  exports: [ClientRepository, ClientService],
})
export class ClientModule {}
