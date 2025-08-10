import { execSync } from 'child_process';
import connect from './connect';

async function init() {
  await connect();

  // 🌠 Remover comentário depois da banca do projeto
  // if (process.env.NODE_ENV === 'production') {
  //   console.log('\n🔧 Setting up database...');

  //   console.log('📃 Applying migrations...');
  //   execSync('npx prisma migrate deploy');

  //   console.log('🔨 Generating prisma client...');
  //   execSync('npx prisma generate');

  //   console.log('🌱 Running seed...');
  //   execSync('ts-node ./prisma/seed.ts');

  //   console.log('✅ Successfully set up database');

  //   return;
  // }

  console.log('\n🔧 Setting up database...');

  console.log('🔄 Resetting database and applying migrations...');
  execSync('npx prisma migrate reset --force');

  console.log('🔨 Generating prisma client...');
  execSync('npx prisma generate');

  console.log('🌱 Running seed...');
  execSync('ts-node ./prisma/seed.ts');

  console.log('👥 Running populate...');
  execSync('ts-node ./prisma/populate.ts');

  console.log('✅ Successfully set up database');
}

void init();
