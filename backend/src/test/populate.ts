import { PrismaClient } from '@prisma/client';
import {
  POPULATE_CLIENT_DEFAULT_ID,
  POPULATE_ORGANIZATION_DEFAULT_ID,
  POPULATE_USER_DEFAULT_ID,
  SEED_ROLE_ADMIN_ID,
} from '../constants';

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
        id: POPULATE_ORGANIZATION_DEFAULT_ID,
        name: 'Organization Test',
        cnpj: '12345678901234',
        clientId: POPULATE_CLIENT_DEFAULT_ID,
      },
    }),
  );

  promises.push(
    prisma.user.create({
      data: {
        id: POPULATE_USER_DEFAULT_ID,
        fullName: 'Test User',
        email: 'testuser+001@email.com',
        password: 'admin',
        clientId: POPULATE_CLIENT_DEFAULT_ID,
        roleId: SEED_ROLE_ADMIN_ID,
      },
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
