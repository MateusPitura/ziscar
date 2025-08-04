import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const vehicleBrands = [
  { name: 'Fiat' },
  { name: 'Volkswagen' },
  { name: 'BYD' },
  { name: 'Chevrolet' },
  { name: 'Hyundai' },
  { name: 'Toyota' },
  { name: 'Jeep' },
  { name: 'Renault' },
  { name: 'Nissan' },
  { name: 'Honda' },
  { name: 'Caoa Chery' },
  { name: 'Peugeot' },
  { name: 'Citroën' },
  { name: 'Ford' },
  { name: 'Mitsubishi' },
  { name: 'BMW' },
  { name: 'Mercedes-Benz' },
  { name: 'Audi' },
  { name: 'Kia' },
  { name: 'Volvo' },
  { name: 'Land Rover' },
  { name: 'GWM' },
  { name: 'BYD' },
  { name: 'Ram' },
  { name: 'JAC' },
  { name: 'Iveco' },

  { name: 'Yamaha' },
  { name: 'Shineray' },
  { name: 'Mottu' },
  { name: 'Royal Enfield' },
  { name: 'Triumph' },
  { name: 'Kawasaki' },
  { name: 'Haojue' },
  { name: 'Avelloz' },
  { name: 'Bajaj' },
  { name: 'Suzuki' },
  { name: 'Dafra' },
  { name: 'Harley-Davidson' },
  { name: 'Ducati' },

  { name: 'DAF' },
  { name: 'Scania' },
  { name: 'Agrale' },
  { name: 'Foton' },
  { name: 'MAN' },
];


async function main() {
  for (const brand of vehicleBrands) {
    await prisma.vehicleBrand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand,
    });
  }

  console.log('✅ Vehicle brands seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding vehicle brands:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
