import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding preorders database...');

  // Clear existing preorders
  await prisma.preorder.deleteMany({});

  const preordersData = [
    {
      id: 'preorder-1',
      name: 'iPhone 16 Pro Max',
      products: 150,
      preorderWhen: 'regardless-of-stock',
      startsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Ends in 30 days
      isActive: true,
    },
    {
      id: 'preorder-2',
      name: 'PlayStation 5 Pro',
      products: 50,
      preorderWhen: 'out-of-stock',
      startsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 'preorder-3',
      name: 'Nintendo Switch 2',
      products: 200,
      preorderWhen: 'regardless-of-stock',
      startsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Starts in 10 days
      endsAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 'preorder-4',
      name: 'RTX 5090 Graphics Card',
      products: 30,
      preorderWhen: 'out-of-stock',
      startsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 'preorder-5',
      name: 'Apple Watch Series 10',
      products: 80,
      preorderWhen: 'regardless-of-stock',
      startsAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ended yesterday
      isActive: false,
    },
    {
      id: 'preorder-6',
      name: 'Vision Pro 2',
      products: 10,
      preorderWhen: 'out-of-stock',
      startsAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      endsAt: null, // No end date
      isActive: true,
    },
    {
      id: 'preorder-7',
      name: 'Pixel 9 Pro Fold',
      products: 45,
      preorderWhen: 'regardless-of-stock',
      startsAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 'preorder-8',
      name: 'Steam Deck OLED White',
      products: 60,
      preorderWhen: 'out-of-stock',
      startsAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Ended 5 days ago
      isActive: false,
    },
  ];

  for (const preorder of preordersData) {
    await prisma.preorder.create({
      data: preorder,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });