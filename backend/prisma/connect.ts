import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

let path: string;
switch (process.env.NODE_ENV) {
  case 'test':
    path = '../.env.test';
    break;
  case 'production':
    path = '../.env.prod';
    break;
  default:
    path = '../.env';
}
config({ path, override: true });

export default async function () {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
  } catch {
    console.error('\n❌ Cannot connect to database');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
