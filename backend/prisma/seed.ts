import { PrismaClient } from '@prisma/client';

export const ADMIN_ROLE_ID = 1;

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.permission.createMany({
      data: [
        {
          id: 1,
          resource: 'USERS',
          action: 'CREATE',
        },
        {
          id: 2,
          resource: 'USERS',
          action: 'READ',
        },
        {
          id: 3,
          resource: 'USERS',
          action: 'UPDATE',
        },
        {
          id: 4,
          resource: 'USERS',
          action: 'DELETE',
        },
      ],
    });

    await prisma.role.create({
      data: {
        id: ADMIN_ROLE_ID,
        name: 'ADMIN',
        permissions: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        },
      },
    });
  } catch (error) {
    console.log('Failed to run seed', error);
  }
}

seed()
  .catch(console.error)
  .finally(() => void prisma.$disconnect());
