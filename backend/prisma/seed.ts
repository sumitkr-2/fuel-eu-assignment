import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.route.createMany({
    data: [
      {
        routeId: 'R1',
        vesselType: 'Cargo',
        fuelType: 'Diesel',
        year: 2024,
        ghgIntensity: 75.4,
        fuelConsumption: 1200.5,
        distance: 800.2,
        totalEmissions: 300.6,
        isBaseline: false,
      },
      {
        routeId: 'R2',
        vesselType: 'Tanker',
        fuelType: 'LNG',
        year: 2024,
        ghgIntensity: 62.1,
        fuelConsumption: 900.3,
        distance: 600.8,
        totalEmissions: 250.9,
        isBaseline: false,
      },
      {
        routeId: 'R3',
        vesselType: 'Passenger',
        fuelType: 'Biofuel',
        year: 2023,
        ghgIntensity: 50.2,
        fuelConsumption: 700.0,
        distance: 450.0,
        totalEmissions: 180.2,
        isBaseline: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
