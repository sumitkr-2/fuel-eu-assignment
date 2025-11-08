import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // clean existing data
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.route.deleteMany();

  // seed a few routes (3 years, one baseline)
  await prisma.route.createMany({
    data: [
      {
        routeId: 'R001',
        vesselType: 'Cargo',
        fuelType: 'Diesel',
        year: 2025,
        ghgIntensity: 75.4,
        fuelConsumption: 1200.5,
        distance: 800.2,
        totalEmissions: 300.6,
        isBaseline: false,
      },
      {
        routeId: 'R002',
        vesselType: 'Tanker',
        fuelType: 'LNG',
        year: 2025,
        ghgIntensity: 62.1,
        fuelConsumption: 900.3,
        distance: 600.8,
        totalEmissions: 250.9,
        isBaseline: false,
      },
      {
        routeId: 'R003',
        vesselType: 'Passenger',
        fuelType: 'Biofuel',
        year: 2025,
        ghgIntensity: 50.2,
        fuelConsumption: 700.0,
        distance: 450.0,
        totalEmissions: 180.2,
        isBaseline: true, // baseline route
      },
      {
        routeId: 'R004',
        vesselType: 'Container Ship',
        fuelType: 'Methanol',
        year: 2024,
        ghgIntensity: 55.0,
        fuelConsumption: 1000.0,
        distance: 700.0,
        totalEmissions: 220.0,
        isBaseline: false,
      },
      {
        routeId: 'R005',
        vesselType: 'Bulker',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 80.0,
        fuelConsumption: 1300.0,
        distance: 900.0,
        totalEmissions: 350.0,
        isBaseline: false,
      },
      {
        routeId: 'R006',
        vesselType: 'Tanker',
        fuelType: 'Diesel',
        year: 2023,
        ghgIntensity: 77.5,
        fuelConsumption: 1100.0,
        distance: 750.0,
        totalEmissions: 290.0,
        isBaseline: false,
      },
    ],
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
