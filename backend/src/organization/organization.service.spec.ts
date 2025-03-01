import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../database/prisma.service';
import {
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_ORGANIZATION_DEFAULT,
} from '../constants';
import { ConflictException } from '@nestjs/common';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService, PrismaService],
    }).compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an organization', async () => {
    await prismaService.transaction(async (transaction) => {
      const user = await organizationService.create(
        {
          name: 'Wayne Enterprises',
          cnpj: '12345678901235',
          clientId: POPULATE_CLIENT_DEFAULT_ID,
        },
        transaction,
      );

      expect(user).toHaveProperty('organizationId');

      transaction.rollback();
    });
  });

  it('should not create an organization with the same CNPJ', async () => {
    await prismaService.transaction(async (transaction) => {
      await expect(
        organizationService.create(
          {
            name: 'Wayne Enterprises',
            cnpj: POPULATE_ORGANIZATION_DEFAULT.cnpj,
            clientId: POPULATE_CLIENT_DEFAULT_ID,
          },
          transaction,
        ),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should find one organization by id', async () => {
    const user = await organizationService.get(
      { id: POPULATE_ORGANIZATION_DEFAULT.id },
      { id: true },
    );

    expect(user).toHaveProperty('id');
  });
});
