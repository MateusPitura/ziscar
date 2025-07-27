import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { StoreService } from './store.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  POPULATE_ENTERPRISE_PRIMARY_ID,
  POPULATE_ENTERPRISE_SECONDARY_ID,
  POPULATE_STORE_DEFAULT,
  POPULATE_STORE_INACTIVE,
} from 'src/constants';

describe('StoreService', () => {
  let storeService: StoreService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService, PrismaService],
    }).compile();

    storeService = module.get<StoreService>(StoreService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const user = await storeService.create({
        storeCreateInDto: {
          name: 'Wayne Enterprises',
          cnpj: '12345678901236',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      });

      expect(user).toHaveProperty('storeId');

      transaction.rollback();
    });
  });

  it('should not create an store with the same CNPJ', async () => {
    await expect(
      storeService.create({
        storeCreateInDto: {
          name: 'Wayne Enterprises',
          cnpj: POPULATE_STORE_DEFAULT.cnpj,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an store with a CNPJ of an inactive store', async () => {
    await expect(
      storeService.create({
        storeCreateInDto: {
          name: 'Stark Industries',
          cnpj: POPULATE_STORE_INACTIVE.cnpj,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should find one store by id', async () => {
    const user = await storeService.findOne({
      where: { id: POPULATE_STORE_DEFAULT.id },
      select: { id: true },
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find an inactive store by id', async () => {
    await expect(
      storeService.findOne({
        where: { id: POPULATE_STORE_INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find an inactive store by id', async () => {
    const user = await storeService.findOne({
      where: { id: POPULATE_STORE_INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find with outer enterprise id provided', async () => {
    await expect(
      storeService.findOne({
        where: { id: POPULATE_STORE_DEFAULT.id },
        select: { id: true },
        enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
