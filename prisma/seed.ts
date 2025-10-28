import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@local.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    const password = await bcrypt.hash(defaultPassword, 10);
    await prisma.admin.create({
      data: {
        name: 'Admin', // Default name is set to 'Admin'
        email: defaultEmail,
        password,
      },
    });
    console.log(`Seeded default admin: ${defaultEmail} / ${defaultPassword}`);
  } else {
    console.log('Admin table already has accounts, skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
