import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find the first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found in DB!");
    return;
  }
  
  // Update to ADMIN
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });
  
  console.log(`Successfully upgraded user ${user.email} to ADMIN!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
