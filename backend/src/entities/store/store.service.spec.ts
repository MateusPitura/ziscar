import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  addressNullableFields,
  POPULATE_ENTERPRISE_PRIMARY_ID,
  POPULATE_ENTERPRISE_SECONDARY_ID,
  POPULATE_STORE_DEFAULT,
  POPULATE_STORE_INACTIVE,
} from 'src/constants';
import { ITEMS_PER_PAGE } from '@shared/constants';

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

  it('should create an store with minimal data', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const store = await storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
          cnpj: '12345678901236',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      });

      expect(store).toHaveProperty('storeId');

      transaction.rollback();
    });
  });

  it('should not create an store with the same email', async () => {
    await expect(
      storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
          cnpj: '12345678901236',
          email: POPULATE_STORE_DEFAULT.email,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an store with a email of an inactive store', async () => {
    await expect(
      storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
          cnpj: '12345678901236',
          email: POPULATE_STORE_INACTIVE.email,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an store with the same CNPJ', async () => {
    await expect(
      storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
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
          name: 'LexCorp',
          cnpj: POPULATE_STORE_INACTIVE.cnpj,
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create an store with full data and minimal address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const store = await storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
          cnpj: '12345678901236',
          email: 'lex@corp.email',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
          phone: '42988884444',
          address: {
            cep: '12345678',
            number: '123',
          },
        },
      });

      expect(store).toHaveProperty('storeId');

      transaction.rollback();
    });
  });

  it('should create an store with full data and full address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const store = await storeService.create({
        storeCreateInDto: {
          name: 'LexCorp',
          cnpj: '12345678901236',
          email: 'lex@corp.email',
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
          phone: '42988884444',
          address: {
            cep: '12345678',
            number: '123',
            street: 'Broadway',
            cityIbgeCode: 4119905,
            neighborhood: 'Manhattan',
          },
        },
      });

      expect(store).toHaveProperty('storeId');

      transaction.rollback();
    });
  });

  it('should update store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      expect(
        await storeService.update({
          where: {
            id: POPULATE_STORE_DEFAULT.id,
          },
          storeUpdateInDto: {
            name: 'InGen',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not verify duplicated if cnpj is not passed', async () => {
    const spy = jest.spyOn(storeService, 'verifyDuplicated');

    await storeService.update({
      where: {
        id: POPULATE_STORE_DEFAULT.id,
      },
      storeUpdateInDto: {
        phone: '42988884444',
      },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update store cnpj', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      expect(
        await storeService.update({
          where: {
            id: POPULATE_STORE_DEFAULT.id,
          },
          storeUpdateInDto: {
            cnpj: '12345678901237',
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update store with cnpj that already exist', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          cnpj: POPULATE_STORE_DEFAULT.cnpj,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not update store with cnpj of an inactive store', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          cnpj: POPULATE_STORE_INACTIVE.cnpj,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not update store with outer enterprise id provided', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          name: 'LexCorp',
        },
        enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create store address and if already exist update all to null', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);
      const spy = jest.spyOn(transaction.store, 'update');

      const commonPayload = {
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      };

      await storeService.update({
        ...commonPayload,
        storeUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const user = await storeService.update({
        ...commonPayload,
        storeUpdateInDto: {
          address: {
            add: { cep: '87654321', number: '321' },
          },
        },
      });

      expect(user).toHaveProperty('address.cep', '87654321');
      expect(user).toHaveProperty('address.number', '321');
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            address: {
              update: {
                ...addressNullableFields,
                cep: '87654321',
                number: '321',
              },
            },
          },
        }),
      );

      transaction.rollback();
    });
  });

  it('should create store address and update store address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      await storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      const user = await storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          address: {
            update: { cityIbgeCode: 4119905 },
          },
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.city.ibgeCode', 4119905);
      expect(user).toHaveProperty('address.city.state', 'PR');
      expect(user).toHaveProperty('address.city.name', 'Ponta Grossa');

      transaction.rollback();
    });
  });

  it('should thrown an exception if try to update store address and it not exist', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        storeUpdateInDto: {
          address: {
            update: { street: 'Broadway' },
          },
        },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete store address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const commonPayload = {
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      };

      await expect(
        storeService.update({
          ...commonPayload,
          storeUpdateInDto: {
            address: {
              remove: true,
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await storeService.update({
        ...commonPayload,
        storeUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const user = await storeService.update({
        ...commonPayload,
        storeUpdateInDto: {
          address: {
            remove: true,
          },
        },
      });

      expect(user).toHaveProperty('address', null);

      transaction.rollback();
    });
  });

  it('should disable store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      expect(
        await storeService.update({
          where: {
            id: POPULATE_STORE_DEFAULT.id,
          },
          storeUpdateInDto: {
            archivedAt: new Date(),
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not disable inactive store', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_INACTIVE.id,
        },
        storeUpdateInDto: {
          archivedAt: new Date(),
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should enable inactive store', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      expect(
        await storeService.update({
          where: {
            id: POPULATE_STORE_INACTIVE.id,
          },
          storeUpdateInDto: {
            archivedAt: null,
          },
          enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not enable active store', async () => {
    await expect(
      storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          archivedAt: null,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update store with allowed null values', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(storeService, 'prismaService', transaction);

      const result = await storeService.update({
        where: {
          id: POPULATE_STORE_DEFAULT.id,
        },
        storeUpdateInDto: {
          email: null,
          phone: null,
        },
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          email: null,
          phone: null,
        }),
      );

      transaction.rollback();
    });
  });

  it('should find store', async () => {
    const store = await storeService.findOne({
      where: { id: POPULATE_STORE_DEFAULT.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(store).toHaveProperty('id');
  });

  it('should not find inactive store', async () => {
    await expect(
      storeService.findOne({
        where: { id: POPULATE_STORE_INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find inactive store', async () => {
    const user = await storeService.findOne({
      where: { id: POPULATE_STORE_INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find store with outer enterprise id provided', async () => {
    await expect(
      storeService.findOne({
        where: { id: POPULATE_STORE_DEFAULT.id },
        select: { id: true },
        enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find many stores with pagination', async () => {
    const result = await storeService.findMany({
      storeFindManyInDto: { page: 1 },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 24);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many stores by name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await storeService.findMany({
      storeFindManyInDto: {
        name: POPULATE_STORE_DEFAULT.name,
      },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: {
            contains: POPULATE_STORE_DEFAULT.name.toLocaleLowerCase(),
            mode: 'insensitive',
          },
        }) as object,
      }),
    );
  });

  it('should find many stores ordered by name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await storeService.findMany({
      storeFindManyInDto: { orderBy: 'name' },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ name: 'asc' }] }),
    );
  });

  it('should find many stores by status igual to inactive', async () => {
    const result = await storeService.findMany({
      storeFindManyInDto: { status: 'inactive' },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 7);
  });

  it('should find many stores with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await storeService.findMany({
      storeFindManyInDto: {
        page: 1,
        status: 'active',
        name: POPULATE_STORE_DEFAULT.name,
        orderBy: 'name',
      },
      enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      select: undefined,
      where: {
        name: {
          contains: POPULATE_STORE_DEFAULT.name.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        enterpriseId: POPULATE_ENTERPRISE_PRIMARY_ID,
        id: { not: POPULATE_STORE_DEFAULT.id },
      },
      orderBy: [{ name: 'asc' }],
    });
  });

  it('should not find many stores with outer enterprise id provided', async () => {
    const result = await storeService.findMany({
      storeFindManyInDto: { status: 'active' },
      enterpriseId: POPULATE_ENTERPRISE_SECONDARY_ID,
    });

    expect(result).toHaveProperty('total', 0);
    expect(result).toHaveProperty('data', []);
  });
});
