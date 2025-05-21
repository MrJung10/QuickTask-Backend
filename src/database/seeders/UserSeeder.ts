import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function UserSeeder() {
  const adminEmail = 'admin@example.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('🟡 Admin user already exists. Skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'System Admin',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin user seeded successfully!');
}

export default UserSeeder;
