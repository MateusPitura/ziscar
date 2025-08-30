import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

const path = process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';
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
