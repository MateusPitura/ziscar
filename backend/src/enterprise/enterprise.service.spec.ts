import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseService } from './enterprise.service';
import { PrismaService } from '../infra/database/prisma.service';

describe('EnterpriseService', () => {
  let clientService: EnterpriseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseService, PrismaService],
    }).compile();

    clientService = module.get<EnterpriseService>(EnterpriseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create client', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(clientService, 'prismaService', transaction);

      const response = await clientService.create({});

      expect(response).toHaveProperty('clientId');

      transaction.rollback();
    });
  });
});
