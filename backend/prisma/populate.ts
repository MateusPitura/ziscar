import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { addMonths, subDays } from 'date-fns';
import { SEED_ROLE_SALES_ID } from '../../shared/src/constants';
import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  InstallmentStatus,
  PAYMENTMETHODPAYABLETYPE_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VehicleStatus,
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

const prisma = new PrismaClient();

const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_INSTALLMENTS_PER_ACCOUNT = 12;
const MIN_INSTALLMENTS_PER_ACCOUNT = 1;
const EXPENSES_PER_VEHICLE = 3;

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

  const vehiclePurchases = Array.from(
    { length: POPULATE_OTHER_ENTITIES_AMOUNT },
    () => ({
      installmentValue: faker.number.int({ min: 500_000, max: 1_500_000 }),
      installmentCount: faker.number.int({
        min: MIN_INSTALLMENTS_PER_ACCOUNT,
        max: MAX_INSTALLMENTS_PER_ACCOUNT,
      }),
    }),
  );

  await prisma.$transaction(async (tx) => {
    const otherVehicles: Prisma.VehicleCreateManyInput[] = [];

    for (const [purchaseId, vehiclePurchase] of vehiclePurchases.entries()) {
      const totalValue =
        vehiclePurchase.installmentValue * vehiclePurchase.installmentCount;

      const minimumPrice = faker.number.int({
        min: totalValue + 100_000,
        max: totalValue + 1_000_000,
      });

      const yearOfManufacture = faker.number.int({
        min: 1990,
        max: new Date().getFullYear(),
      });

      otherVehicles.push({
        chassiNumber: generateChassi(),
        plateNumber: generatePlateNumber(),
        status:
          VEHICLESTATUS_VALUES[
            faker.number.int({ min: 0, max: VEHICLESTATUS_VALUES.length - 2 }) // Exclude 'SOLD' status
          ],
        commissionValue: faker.number.int({ min: 0, max: 50_000 }),
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
        kilometers: faker.number.int({ min: 0, max: 300_000 }),
        modelName: faker.vehicle.model(),
        modelYear: yearOfManufacture + 1,
        yearOfManufacture,
        archivedAt:
          purchaseId < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
      });
    }

    await tx.vehicle.createMany({
      data: otherVehicles,
    });
  });

  await prisma.$transaction(async (tx) => {
    const accountsPayableForVehiclePurchasePromise: unknown[] = [];

    for (const [purchaseId, vehiclePurchase] of vehiclePurchases.entries()) {
      const paidInstallmentsCount = faker.number.int({
        min: 0,
        max: vehiclePurchase.installmentCount,
      });

      const hasUpfront = faker.datatype.boolean();

      const firstDueDate = faker.date.between({
        from: new Date(Date.now() - 5 * YEAR_IN_MS),
        to: new Date(Date.now() - 2 * YEAR_IN_MS),
      });

      const installments = Array.from(
        { length: vehiclePurchase.installmentCount },
        (_, installmentId) => {
          return {
            installmentSequence: hasUpfront ? installmentId : installmentId + 1,
            dueDate: addMonths(firstDueDate, installmentId),
            value: vehiclePurchase.installmentValue,
            isRefund: false,
            isUpfront: hasUpfront && installmentId === 0,
            status:
              installmentId < paidInstallmentsCount
                ? InstallmentStatus.PAID
                : InstallmentStatus.PENDING,
            ...(installmentId < paidInstallmentsCount && {
              paymentMethodPayables: {
                create: {
                  type: PAYMENTMETHODPAYABLETYPE_VALUES[
                    faker.number.int({
                      min: 0,
                      max: PAYMENTMETHODPAYABLETYPE_VALUES.length - 1,
                    })
                  ],
                  value: vehiclePurchase.installmentValue,
                  paymentDate: subDays(
                    addMonths(firstDueDate, installmentId),
                    faker.number.int({ min: 0, max: 7 }),
                  ),
                  userId: POPULATE_USER.ADM.id,
                },
              },
            }),
          };
        },
      );

      accountsPayableForVehiclePurchasePromise.push(
        tx.accountPayable.create({
          data: {
            description: `Compra Veículo ${generatePlateNumber(true)}`,
            paidTo: faker.company.name(),
            accountPayableInstallments: {
              create: installments,
            },
            vehiclePurchases: {
              create: {
                date: faker.date.past({ years: 1 }),
                userId: POPULATE_USER.ADM.id,
                vehicleId: purchaseId + 1,
              },
            },
          },
        }),
      );
    }

    await Promise.all(accountsPayableForVehiclePurchasePromise);
  });

  await prisma.$transaction(async (tx) => {
    const accountsPayableForVehicleExpensesPromise = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      async (_, accountId) => {
        const installmentsCount = faker.number.int({
          min: MIN_INSTALLMENTS_PER_ACCOUNT,
          max: MAX_INSTALLMENTS_PER_ACCOUNT,
        });

        const paidInstallmentsCount = faker.number.int({
          min: 0,
          max: installmentsCount,
        });

        const hasUpfront = faker.datatype.boolean();

        const firstDueDate = faker.date.between({
          from: new Date(Date.now() - 5 * YEAR_IN_MS),
          to: new Date(Date.now() - 2 * YEAR_IN_MS),
        });

        const value = faker.number.int({ min: 5_000, max: 200_000 });

        const installments = Array.from(
          { length: installmentsCount },
          (_, installmentId) => {
            return {
              installmentSequence: hasUpfront
                ? installmentId
                : installmentId + 1,
              dueDate: addMonths(firstDueDate, installmentId),
              value,
              isRefund: false,
              isUpfront: hasUpfront && installmentId === 0,
              status:
                installmentId < paidInstallmentsCount
                  ? InstallmentStatus.PAID
                  : InstallmentStatus.PENDING,
              ...(installmentId < paidInstallmentsCount && {
                paymentMethodPayables: {
                  create: {
                    type: PAYMENTMETHODPAYABLETYPE_VALUES[
                      faker.number.int({
                        min: 0,
                        max: PAYMENTMETHODPAYABLETYPE_VALUES.length - 1,
                      })
                    ],
                    value,
                    paymentDate: subDays(
                      addMonths(firstDueDate, installmentId),
                      faker.number.int({ min: 0, max: 7 }),
                    ),
                    userId: POPULATE_USER.ADM.id,
                  },
                },
              }),
            };
          },
        );

        const hasDescription = faker.datatype.boolean();
        const vehicleId =
          Math.floor(accountId / EXPENSES_PER_VEHICLE) +
          1 +
          POPULATE_INACTIVE_ENTITIES_AMOUNT; // Pick ative vehicles

        const expense = {
          category:
            EXPENSECATEGORY_VALUES[
              faker.number.int({
                min: 0,
                max: EXPENSECATEGORY_VALUES.length - 1,
              })
            ],
          competencyDate: faker.date.past({ years: 1 }),
          observations: hasDescription ? faker.lorem.sentence(5) : '',
          userId: POPULATE_USER.ADM.id,
          vehicleId,
        };

        await tx.accountPayable.create({
          data: {
            description: `Gasto Veículo ${generatePlateNumber(true)}`,
            paidTo: faker.person.fullName(),
            accountPayableInstallments: {
              create: installments,
            },
            vehicleExpenses: {
              create: expense,
            },
          },
        });
      },
    );

    await Promise.all(accountsPayableForVehicleExpensesPromise);
  });

  await prisma.$transaction(async (tx) => {
    const otherAccountsReceivablePromise = Array.from(
      { length: POPULATE_OTHER_ENTITIES_AMOUNT },
      async () => {
        const installmentsCount = faker.number.int({
          min: MIN_INSTALLMENTS_PER_ACCOUNT,
          max: MAX_INSTALLMENTS_PER_ACCOUNT,
        });

        const paidInstallmentsCount = faker.number.int({
          min: 0,
          max: installmentsCount,
        });

        const hasUpfront = faker.datatype.boolean();

        const firstDueDate = faker.date.between({
          from: new Date(Date.now() - 5 * YEAR_IN_MS),
          to: new Date(Date.now() - 2 * YEAR_IN_MS),
        });

        const value = faker.number.int({ min: 500_000, max: 20_000_000 });

        const installments = Array.from(
          { length: installmentsCount },
          (_, installmentId) => {
            return {
              installmentSequence: hasUpfront
                ? installmentId
                : installmentId + 1,
              dueDate: addMonths(firstDueDate, installmentId),
              value,
              isRefund: false,
              isUpfront: hasUpfront && installmentId === 0,
              status:
                installmentId < paidInstallmentsCount
                  ? InstallmentStatus.PAID
                  : InstallmentStatus.PENDING,
              ...(installmentId < paidInstallmentsCount && {
                paymentMethodReceivables: {
                  create: {
                    type: PAYMENTMETHODRECEIVABLETYPE_VALUES[
                      faker.number.int({
                        min: 0,
                        max: PAYMENTMETHODRECEIVABLETYPE_VALUES.length - 1,
                      })
                    ],
                    value,
                    paymentDate: subDays(
                      addMonths(firstDueDate, installmentId),
                      faker.number.int({ min: 0, max: 7 }),
                    ),
                    userId: POPULATE_USER.ADM.id,
                  },
                },
              }),
            };
          },
        );

        const plateNumber = generatePlateNumber(true);

        const personName = faker.person.fullName();

        const maxCommissionValue = faker.number.int({ min: 0, max: 50_000 });

        const customerSnapshot = {
          cpf: generateCpf(),
          email: faker.internet.email(),
          phone: faker.string.numeric(11),
          fullName: personName,
        };

        const yearOfManufacture = faker.number.int({
          min: 1990,
          max: new Date().getFullYear(),
        });

        const minimumPrice = faker.number.int({
          min: 500_000,
          max: 18_000_000,
        });

        const saleDate = faker.date.past({ years: 1 });

        const vehicleSnapshot = {
          brand: {
            name: faker.vehicle.manufacturer(),
          },
          color: faker.color.rgb().replace('#', ''),
          store: {
            name: faker.company.name(),
          },
          status: VehicleStatus.SOLD,
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
          modelName: faker.vehicle.model(),
          modelYear: yearOfManufacture + 1,
          yearOfManufacture,
          kilometers: faker.number.int({ min: 0, max: 300000 }),
          chassiNumber: generateChassi(),
          plateNumber: plateNumber.replace(/[^a-zA-Z0-9]/g, ''),
          minimumPrice,
          announcedPrice:
            minimumPrice + faker.number.int({ min: 0, max: 1_000_000 }),
          commissionValue: maxCommissionValue,
          vehicleCharacteristicValues: [],
        };

        await tx.accountReceivable.create({
          data: {
            description: `Venda Veículo ${plateNumber}`,
            receivedFrom: personName,
            accountReceivableInstallments: {
              create: installments,
            },
            vehicleSales: {
              create: {
                customerSnapshot: customerSnapshot,
                date: saleDate,
                userId: POPULATE_USER.ADM.id,
                customerId: POPULATE_CUSTOMER.DEFAULT.id,
                vehicleId: POPULATE_INACTIVE_ENTITIES_AMOUNT + 1, // First active vehicle
                vehicleSnapshot: vehicleSnapshot,
              },
            },
          },
        });

        const commissionValue = faker.number.int({
          min: 0,
          max: maxCommissionValue,
        });

        if (commissionValue) {
          await tx.accountPayable.create({
            data: {
              description: `Comissão Venda Veículo ${plateNumber}`,
              paidTo: POPULATE_USER.ADM.fullName,
              accountPayableInstallments: {
                create: [
                  {
                    dueDate: addMonths(saleDate, 1),
                    value: faker.number.int({
                      min: 0,
                      max: maxCommissionValue,
                    }),
                    installmentSequence: 1,
                    isRefund: false,
                    isUpfront: false,
                    status: InstallmentStatus.PENDING,
                  },
                ],
              },
            },
          });
        }
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
