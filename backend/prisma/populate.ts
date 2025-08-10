import { PrismaClient } from '@prisma/client';
import {
  POPULATE_ENTERPRISE,
  POPULATE_STORE,
  POPULATE_USER,
} from '../src/constants/populate';
import { faker } from '@faker-js/faker';
import { SEED_ROLE_SALES_ID } from '../../shared/src/constants';
import { encryptPassword } from '../src/entities/user/user.utils';
import {
  POPULATE_INACTIVE_ENTITIES_AMOUNT,
  POPULATE_OTHER_ENTITIES_AMOUNT,
} from '../src/constants';

const prisma = new PrismaClient();

async function populate() {
  await prisma.$transaction(async (tx) => {
    console.log('👥 Starting database population...');

    await tx.enterprise.createMany({
      data: [{ ...POPULATE_ENTERPRISE.DEFAULT }],
    });

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
        cnpj: faker.string.numeric(14),
        archivedAt:
          index < POPULATE_INACTIVE_ENTITIES_AMOUNT ? new Date() : null,
        enterpriseId: POPULATE_ENTERPRISE.DEFAULT.id,
      }),
    );

    await tx.store.createMany({
      data: otherStores,
    });

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
