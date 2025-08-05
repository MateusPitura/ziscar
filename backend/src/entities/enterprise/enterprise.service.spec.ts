import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseService } from './enterprise.service';
import { PrismaService } from '../../infra/database/prisma.service';

describe('EnterpriseService', () => {
  let enterpriseService: EnterpriseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseService, PrismaService],
    }).compile();

    enterpriseService = module.get<EnterpriseService>(EnterpriseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create enterprise', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(enterpriseService, 'prismaService', transaction);

      const response = await enterpriseService.create({});

      expect(response).toHaveProperty('enterpriseId');

      transaction.rollback();
    });
  });
});
