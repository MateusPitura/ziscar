import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseService } from './enterprise.service';
import { PrismaService } from 'src/infra/database/prisma.service';

describe('EnterpriseService', () => {
  let enterpriseService: EnterpriseService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [EnterpriseService, PrismaService],
    }).compile();

    enterpriseService = module.get<EnterpriseService>(EnterpriseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
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
