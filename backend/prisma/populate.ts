import { PrismaClient } from '@prisma/client';
import {
  POPULATE_ENTERPRISE_ID,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../src/constants';
import { faker } from '@faker-js/faker';
import {
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '../../shared/src/constants';
import { encryptPassword } from '../src/entities/user/user.utils';

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction(async (tx) => {
    console.log('🌱 Starting database population...');

    const enterprise = await tx.enterprise.upsert({
      where: { id: POPULATE_ENTERPRISE_ID },
      update: {},
      create: {
        id: POPULATE_ENTERPRISE_ID,
      },
    });
    console.log(`✅ Enterprise "${enterprise.id}" created or verified.`);

    await tx.user.createMany({
      data: [
        {
          ...POPULATE_USER_DEFAULT,
          password: await encryptPassword({
            password: POPULATE_USER_DEFAULT.password,
          }),
          enterpriseId: enterprise.id,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        {
          ...POPULATE_USER_INACTIVE,
          password: await encryptPassword({
            password: POPULATE_USER_INACTIVE.password,
          }),
          enterpriseId: enterprise.id,
          roleId: SEED_ROLE_ADMIN_ID,
        },
      ],
      skipDuplicates: true,
    });
    console.log('✅ Default users created.');

    const usersPromise = Array.from({ length: 30 }, async (_, index) => ({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      archivedAt: index > 5 ? null : new Date(),
      password: await encryptPassword({ password: faker.internet.password() }),
      enterpriseId: enterprise.id,
      roleId: SEED_ROLE_SALES_ID,
    }));

    const usersToCreate = await Promise.all(usersPromise);

    await tx.user.createMany({
      data: usersToCreate,
      skipDuplicates: true,
    });
    console.log(`✅ ${usersToCreate.length} fake users created.`);
  });
}

seed()
  .then(() => {
    console.log('🌱 Database populated successfully.');
  })
  .catch((error) => {
    console.error('❌ Failed to run populate:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });