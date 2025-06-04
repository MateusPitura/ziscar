import { execSync } from 'child_process';
import { config } from 'dotenv';

const path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
config({ path, override: true });

function setup() {
  console.log('\n🌠 Setting up database...');

  console.log('🌠 Resetting database and applying migrations...');
  execSync('npx prisma migrate reset --force');

  console.log('🌠 Generating prisma client...');
  execSync('npx prisma generate');

  console.log('🌠 Running seed...');
  execSync('ts-node ./prisma/seed.ts');

  console.log('🌠 Running populate...');
  execSync('ts-node ./prisma/populate.ts');

  console.log('🌠 Successfully set up database');
}

setup();
