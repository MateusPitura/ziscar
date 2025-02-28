import { PrismaClient } from '@prisma/client';
import {
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_ORGANIZATION_DEFAULT,
  POPULATE_USER_DEFAULT,
  SEED_ROLE_ADMIN_ID,
} from '../src/constants';
import { encryptPassword } from '../src/user/user.utils';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌠 Started to populate database');

  await prisma.client.create({
    data: {
      id: POPULATE_CLIENT_DEFAULT_ID,
    },
  });

  const promises: Promise<unknown>[] = [];

  promises.push(
    prisma.organization.create({
      data: {
        ...POPULATE_ORGANIZATION_DEFAULT,
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      },
    }),
  );

  promises.push(
    prisma.user.create({
      data: {
        ...POPULATE_USER_DEFAULT,
        password: await encryptPassword(POPULATE_USER_DEFAULT.password),
        clientId: POPULATE_CLIENT_DEFAULT_ID,
        roleId: SEED_ROLE_ADMIN_ID,
      },
    }),
  );

  const usersPromise = Array.from({ length: 30 }, async (_, index) => ({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    isActive: index > 5,
    password: await encryptPassword(faker.internet.password()),
    clientId: POPULATE_CLIENT_DEFAULT_ID,
    roleId: SEED_ROLE_ADMIN_ID,
  }));

  const users = await Promise.all(usersPromise);

  promises.push(
    prisma.user.createMany({
      data: users,
    }),
  );

  await Promise.all(promises);

  console.log('🌠 Successfully populated database');
}

seed()
  .catch((error) => {
    console.log('🌠 Failed to run populate', error);
    console.error(error);
  })
  .finally(() => void prisma.$disconnect());
