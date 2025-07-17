import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../../infra/database/prisma.service';
import {
  POPULATE_CLIENT_PRIMARY_ID,
  POPULATE_CLIENT_SECONDARY_ID,
  POPULATE_ORGANIZATION_DEFAULT,
  POPULATE_ORGANIZATION_INACTIVE,
} from '../../constants';
import { ConflictException, NotFoundException } from '@nestjs/common';

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
      Reflect.set(organizationService, 'prismaService', transaction);

      const user = await organizationService.create({
        organizationCreateInDto: {
          name: 'Wayne Enterprises',
          cnpj: '12345678901236',
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        },
      });

      expect(user).toHaveProperty('organizationId');

      transaction.rollback();
    });
  });

  it('should not create an organization with the same CNPJ', async () => {
    await expect(
      organizationService.create({
        organizationCreateInDto: {
          name: 'Wayne Enterprises',
          cnpj: POPULATE_ORGANIZATION_DEFAULT.cnpj,
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an organization with a CNPJ of an inactive organization', async () => {
    await expect(
      organizationService.create({
        organizationCreateInDto: {
          name: 'Stark Industries',
          cnpj: POPULATE_ORGANIZATION_INACTIVE.cnpj,
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should find one organization by id', async () => {
    const user = await organizationService.findOne({
      where: { id: POPULATE_ORGANIZATION_DEFAULT.id },
      select: { id: true },
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find an inactive organization by id', async () => {
    await expect(
      organizationService.findOne({
        where: { id: POPULATE_ORGANIZATION_INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find an inactive organization by id', async () => {
    const user = await organizationService.findOne({
      where: { id: POPULATE_ORGANIZATION_INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find with outer client id provided', async () => {
    await expect(
      organizationService.findOne({
        where: { id: POPULATE_ORGANIZATION_DEFAULT.id },
        select: { id: true },
        clientId: POPULATE_CLIENT_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
