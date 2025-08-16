import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  addressNullableFields,
  POPULATE_INACTIVE_ENTITIES_AMOUNT,
  POPULATE_OTHER_ENTITIES_AMOUNT,
} from 'src/constants';
import { POPULATE_ENTERPRISE, POPULATE_CUSTOMER } from 'src/constants/populate';
import { ITEMS_PER_PAGE } from '@shared/constants';
import { GET_CUSTOMER } from './customer.constant';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [CustomerService, PrismaService],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should create an customer with minimal data', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const customer = await customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: '00458468045',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      });

      for (const key in GET_CUSTOMER) {
        expect(customer).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should not create an customer with the same email', async () => {
    await expect(
      customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: '00458468045',
          email: POPULATE_CUSTOMER.DEFAULT.email,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an customer with a email of an inactive customer', async () => {
    await expect(
      customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: '00458468045',
          email: POPULATE_CUSTOMER.INACTIVE.email,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an customer with the same CPF', async () => {
    await expect(
      customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: POPULATE_CUSTOMER.DEFAULT.cpf,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an customer with a CPF of an inactive customer', async () => {
    await expect(
      customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: POPULATE_CUSTOMER.INACTIVE.cpf,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create an customer with full data and minimal address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const customer = await customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: '00458468045',
          email: 'sam@email.com',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
          phone: '42988884444',
          address: {
            cep: '12345678',
            number: '123',
          },
        },
      });

      for (const key in GET_CUSTOMER) {
        expect(customer).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should create an customer with full data and full address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const customer = await customerService.create({
        customerCreateInDto: {
          fullName: 'Sam',
          cpf: '00458468045',
          email: 'sam@email.com',
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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

      for (const key in GET_CUSTOMER) {
        expect(customer).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should update customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      expect(
        await customerService.update({
          where: {
            id: POPULATE_CUSTOMER.DEFAULT.id,
          },
          customerUpdateInDto: {
            fullName: 'InGen',
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not verify duplicated if cpf is not passed', async () => {
    const spy = jest.spyOn(customerService, 'verifyDuplicated');

    await customerService.update({
      where: {
        id: POPULATE_CUSTOMER.DEFAULT.id,
      },
      customerUpdateInDto: {
        phone: '42988884444',
      },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update customer cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      expect(
        await customerService.update({
          where: {
            id: POPULATE_CUSTOMER.DEFAULT.id,
          },
          customerUpdateInDto: {
            cpf: '11591802024',
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update customer with cpf that already exist', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          cpf: POPULATE_CUSTOMER.DEFAULT.cpf,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not update customer with cpf of an inactive customer', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          cpf: POPULATE_CUSTOMER.INACTIVE.cpf,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not update customer with outer enterprise id provided', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          fullName: 'Sam',
        },
        enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create customer address and if already exist update all to null', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);
      const spy = jest.spyOn(transaction.customer, 'update');

      const commonPayload = {
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      };

      await customerService.update({
        ...commonPayload,
        customerUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const customer = await customerService.update({
        ...commonPayload,
        customerUpdateInDto: {
          address: {
            add: { cep: '87654321', number: '321' },
          },
        },
      });

      expect(customer).toHaveProperty('address.cep', '87654321');
      expect(customer).toHaveProperty('address.number', '321');
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

  it('should create customer address and update customer address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      await customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      });

      const customer = await customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          address: {
            update: { cityIbgeCode: 4119905 },
          },
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      });

      expect(customer).toHaveProperty('address.cep', '12345678');
      expect(customer).toHaveProperty('address.number', '123');
      expect(customer).toHaveProperty('address.city.ibgeCode', 4119905);
      expect(customer).toHaveProperty('address.city.state', 'PR');
      expect(customer).toHaveProperty('address.city.name', 'Ponta Grossa');

      transaction.rollback();
    });
  });

  it('should thrown an exception if try to update customer address and it not exist', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        customerUpdateInDto: {
          address: {
            update: { street: 'Broadway' },
          },
        },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should delete customer address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const commonPayload = {
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      };

      await expect(
        customerService.update({
          ...commonPayload,
          customerUpdateInDto: {
            address: {
              remove: true,
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await customerService.update({
        ...commonPayload,
        customerUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123', cityIbgeCode: 4119905 },
          },
        },
      });

      const customer = await customerService.update({
        ...commonPayload,
        customerUpdateInDto: {
          address: {
            remove: true,
          },
        },
      });

      expect(customer).toHaveProperty('address', null);

      transaction.rollback();
    });
  });

  it('should disable customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      expect(
        await customerService.update({
          where: {
            id: POPULATE_CUSTOMER.DEFAULT.id,
          },
          customerUpdateInDto: {
            archivedAt: new Date(),
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not disable inactive customer', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.INACTIVE.id,
        },
        customerUpdateInDto: {
          archivedAt: new Date(),
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should enable inactive customer', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      expect(
        await customerService.update({
          where: {
            id: POPULATE_CUSTOMER.INACTIVE.id,
          },
          customerUpdateInDto: {
            archivedAt: null,
          },
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not enable active customer', async () => {
    await expect(
      customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          archivedAt: null,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update customer with allowed null values', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(customerService, 'prismaService', transaction);

      const result = await customerService.update({
        where: {
          id: POPULATE_CUSTOMER.DEFAULT.id,
        },
        customerUpdateInDto: {
          email: null,
          phone: null,
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
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

  it('should find customer', async () => {
    const customer = await customerService.findOne({
      where: { id: POPULATE_CUSTOMER.DEFAULT.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not find inactive customer', async () => {
    await expect(
      customerService.findOne({
        where: { id: POPULATE_CUSTOMER.INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find inactive customer', async () => {
    const customer = await customerService.findOne({
      where: { id: POPULATE_CUSTOMER.INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not find customer with outer enterprise id provided', async () => {
    await expect(
      customerService.findOne({
        where: { id: POPULATE_CUSTOMER.DEFAULT.id },
        select: { id: true },
        enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find many customers with pagination', async () => {
    const result = await customerService.findMany({
      customerFindManyInDto: { page: 1 },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const calculatedCustomers =
      POPULATE_OTHER_ENTITIES_AMOUNT +
      Object.keys(POPULATE_CUSTOMER).length -
      POPULATE_INACTIVE_ENTITIES_AMOUNT -
      Object.values(POPULATE_CUSTOMER).filter(
        (item) => item.archivedAt !== null,
      ).length;

    expect(result).toHaveProperty('total', calculatedCustomers);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many customers by fullName', async () => {
    const spy = jest.spyOn(prismaService.customer, 'findMany');

    await customerService.findMany({
      customerFindManyInDto: {
        fullName: POPULATE_CUSTOMER.DEFAULT.fullName,
      },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          fullName: {
            contains: POPULATE_CUSTOMER.DEFAULT.fullName.toLocaleLowerCase(),
            mode: 'insensitive',
          },
        }) as object,
      }),
    );
  });

  it('should find many customers ordered by fullName', async () => {
    const spy = jest.spyOn(prismaService.customer, 'findMany');

    await customerService.findMany({
      customerFindManyInDto: { orderBy: 'fullName' },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many customers by status igual to inactive', async () => {
    const result = await customerService.findMany({
      customerFindManyInDto: { status: 'inactive' },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const calculatedCustomers =
      POPULATE_INACTIVE_ENTITIES_AMOUNT +
      Object.values(POPULATE_CUSTOMER).filter(
        (item) => item.archivedAt !== null,
      ).length;

    expect(result).toHaveProperty('total', calculatedCustomers);
  });

  it('should find many customers by startDate', async () => {
    const result = await customerService.findMany({
      customerFindManyInDto: { startDate: '2000-01-01' },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    const calculatedCustomers =
      POPULATE_OTHER_ENTITIES_AMOUNT +
      Object.keys(POPULATE_CUSTOMER).length -
      POPULATE_INACTIVE_ENTITIES_AMOUNT -
      Object.values(POPULATE_CUSTOMER).filter(
        (item) => item.archivedAt !== null,
      ).length;

    expect(result).toHaveProperty('total', calculatedCustomers);
  });

  it('should find many customers by CPF', async () => {
    const result = await customerService.findMany({
      customerFindManyInDto: { cpf: 123 },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(result).toHaveProperty('total', expect.any(Number));
  });

  it('should find many customers with many filters', async () => {
    const spy = jest.spyOn(prismaService.customer, 'findMany');

    await customerService.findMany({
      customerFindManyInDto: {
        page: 1,
        status: 'active',
        fullName: POPULATE_CUSTOMER.DEFAULT.fullName,
        orderBy: 'fullName',
        startDate: '2000-01-01',
        cpf: 123,
      },
      enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      select: undefined,
      where: {
        fullName: {
          contains: POPULATE_CUSTOMER.DEFAULT.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        archivedAt: null,
        createdAt: {
          gte: new Date('2000-01-01'),
        },
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        cpf: {
          contains: '123',
        },
      },
      orderBy: [{ fullName: 'asc' }],
    });
  });

  it('should not find many customers with outer enterprise id provided', async () => {
    const result = await customerService.findMany({
      customerFindManyInDto: { status: 'active' },
      enterpriseId: POPULATE_ENTERPRISE.OUTER.id,
    });

    expect(result).toHaveProperty('total', 0);
    expect(result).toHaveProperty('data', []);
  });
});
