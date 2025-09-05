import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { SEED_ROLE_SALES_ID } from '../../shared/src/constants';
import {
  FUELTYPE_VALUES,
  InstallmentStatus,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
} from '../../shared/src/enums';
import {
  generateChassi,
  generateCnpj,
  generateCpf,
  generatePlateNumber,
} from '../../shared/src/test/';
import {
  POPULATE_INACTIVE_ENTITIES_AMOUNT,
  POPULATE_OTHER_ENTITIES_AMOUNT,
} from '../src/constants';
import {
  POPULATE_CUSTOMER,
  POPULATE_ENTERPRISE,
  POPULATE_STORE,
  POPULATE_USER,
} from '../src/constants/populate';
import { encryptPassword } from '../src/entities/user/user.utils';
import { vehicleBrands } from './seed-data/vehicleBrands';
import { addMonths, subDays } from 'date-fns';

const prisma = new PrismaClient();

const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

async function populate() {
  console.log('👥 Starting database population...');
  await prisma.$transaction(async (tx) => {
    await tx.enterprise.createMany({
      data: [{ ...POPULATE_ENTERPRISE.DEFAULT }],
    });
  });

  await prisma.$transaction(async (tx) => {
    await tx.store.createMany({
      data: [
        {
          ...POPULATE_STORE.DEFAULT,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
        {
          ...POPULATE_STORE.INACTIVE,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      ],
    });

    const otherStores = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      (_, index) => ({
        name: faker.company.name(),
        cnpj: generateCnpj(),
        archivedAt:
          index < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    );

    await tx.store.createMany({
      data: otherStores,
    });
  });

  await prisma.$transaction(async (tx) => {
    await tx.customer.createMany({
      data: [
        {
          ...POPULATE_CUSTOMER.DEFAULT,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
        {
          ...POPULATE_CUSTOMER.INACTIVE,
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      ],
    });

    const otherCustomers = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      (_, index) => ({
        fullName: faker.person.fullName(),
        cpf: generateCpf(),
        archivedAt:
          index < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    );

    await tx.customer.createMany({
      data: otherCustomers,
    });
  });

  await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: [
        {
          ...POPULATE_USER.ADM,
          password: await encryptPassword({
            password: POPULATE_USER.ADM.password,
          }),
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
        {
          ...POPULATE_USER.SALES,
          password: await encryptPassword({
            password: POPULATE_USER.SALES.password,
          }),
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
        {
          ...POPULATE_USER.INACTIVE,
          password: await encryptPassword({
            password: POPULATE_USER.INACTIVE.password,
          }),
          enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        },
      ],
    });

    const otherUsersPromise = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      async (_, index) => ({
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        archivedAt:
          index < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
        password: await encryptPassword({
          password: faker.internet.password(),
        }),
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
        roleId: SEED_ROLE_SALES_ID,
      }),
    );

    const otherUsers = await Promise.all(otherUsersPromise);

    await tx.user.createMany({
      data: otherUsers,
    });
  });

  await prisma.$transaction(async (tx) => {
    const otherVehiclesPromise = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      (_, index) => {
        const minimumPrice = faker.number.int({
          min: 500_000,
          max: 20_000_000,
        });
        const yearOfManufacture = faker.number.int({
          min: 1990,
          max: new Date().getFullYear(),
        });

        return {
          chassiNumber: generateChassi(),
          plateNumber: generatePlateNumber(),
          status:
            VEHICLESTATUS_VALUES[
              faker.number.int({ min: 0, max: VEHICLESTATUS_VALUES.length - 1 })
            ],
          commissionValue: faker.number.int({ min: 0, max: 100_000 }), // 🌠 precisa conferir o valor de compra
          announcedPrice:
            minimumPrice + faker.number.int({ min: 0, max: 1_000_000 }),
          minimumPrice,
          brandId: faker.number.int({
            min: 1,
            max: vehicleBrands.length,
          }),
          storeId: POPULATE_STORE.DEFAULT.id,
          category:
            VEHICLECATEGORY_VALUES[
              faker.number.int({
                min: 0,
                max: VEHICLECATEGORY_VALUES.length - 1,
              })
            ],
          fuelType:
            FUELTYPE_VALUES[
              faker.number.int({ min: 0, max: FUELTYPE_VALUES.length - 1 })
            ],
          color: faker.color.rgb().replace('#', ''),
          kilometers: faker.number.int({ min: 0, max: 30_000_000 }),
          modelName: faker.vehicle.model(),
          modelYear: yearOfManufacture + 1,
          yearOfManufacture,
          archivedAt:
            index < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
        };
      },
    );

    const otherVehicles = await Promise.all(otherVehiclesPromise);

    await tx.vehicle.createMany({
      data: otherVehicles,
    });
  });

  await prisma.$transaction(async (tx) => {
    const otherAccountsReceivablePromise = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      async () => {
        const installmentsCount = faker.number.int({ min: 1, max: 12 });

        const paidInstallmentsCount = faker.number.int({
          min: 0,
          max: installmentsCount,
        });

        const hasUpfront = faker.datatype.boolean();

        const firstDueDate = faker.date.between({
          from: new Date(Date.now() - 5 * YEAR_IN_MS),
          to: new Date(Date.now() - 2 * YEAR_IN_MS),
        });

        const installments = Array.from(
          { length: installmentsCount },
          (_, idx) => {
            return {
              installmentSequence: hasUpfront ? idx : idx + 1,
              dueDate: addMonths(firstDueDate, idx),
              value: faker.number.int({ min: 500_000, max: 20_000_000 }),
              isRefund: false,
              isUpfront: hasUpfront && idx === 0,
              status:
                idx < paidInstallmentsCount
                  ? InstallmentStatus.PAID
                  : InstallmentStatus.PENDING,
              ...(idx < paidInstallmentsCount && {
                paymentMethodReceivables: {
                  create: {
                    type: PAYMENTMETHODRECEIVABLETYPE_VALUES[
                      faker.number.int({
                        min: 0,
                        max: PAYMENTMETHODRECEIVABLETYPE_VALUES.length - 1,
                      })
                    ],
                    value: faker.number.int({
                      min: 500_000,
                      max: 20_000_000,
                    }),
                    paymentDate: subDays(
                      addMonths(firstDueDate, idx),
                      faker.number.int({ min: 0, max: 7 }),
                    ),
                    userId: POPULATE_USER.ADM.id,
                  },
                },
              }),
            };
          },
        );

        await tx.accountReceivable.create({
          data: {
            description: `Venda Veículo ${generatePlateNumber(true)}`,
            receivedFrom: faker.person.fullName(),
            accountReceivableInstallments: {
              create: installments,
            },
          },
        });
      },
    );

    await Promise.all(otherAccountsReceivablePromise);
  });
}

populate()
  .then(() => {
    console.log('👥 Database populated successfully.');
  })
  .catch((error) => {
    console.error('❌ Failed to run populate:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
