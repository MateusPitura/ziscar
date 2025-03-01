import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { PrismaService } from '../database/prisma.service';

describe('ClientService', () => {
  let clientService: ClientService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService, PrismaService],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create client', async () => {
    await prismaService.transaction(async (transaction) => {
      const response = await clientService.create(transaction);

      expect(response).toHaveProperty('clientId');

      transaction.rollback();
    });
  });
});
