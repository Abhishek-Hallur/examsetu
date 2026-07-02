import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.count();
  const resources = await prisma.resource.count();
  const exams = await prisma.exam.count();
  console.log({ users, resources, exams });
}
main().catch(console.error).finally(() => prisma.$disconnect());
