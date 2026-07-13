import { PrismaClient } from "@prisma/client";
import {
  EXAMS,
  SUBJECTS,
  RESOURCE_TYPES,
} from "@/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed SUBJECTS
  console.log("📚 Seeding subjects...");
  for (const subject of SUBJECTS) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: {
        slug: subject.slug,
        name: subject.name,
        description: subject.description,
        color: subject.color,
        icon: subject.icon,
      },
    });
  }
  console.log(`✓ Seeded ${SUBJECTS.length} subjects`);

  // Seed RESOURCE_TYPES
  console.log("🏷️  Seeding resource types...");
  for (const type of RESOURCE_TYPES) {
    await prisma.resourceType.upsert({
      where: { slug: type.slug },
      update: {},
      create: {
        slug: type.slug,
        name: type.name,
        icon: type.icon,
      },
    });
  }
  console.log(`✓ Seeded ${RESOURCE_TYPES.length} resource types`);

  // Seed EXAMS and ExamSubject joins
  console.log("📖 Seeding exams...");
  for (let i = 0; i < EXAMS.length; i++) {
    const exam = EXAMS[i];

    // Upsert exam
    const createdExam = await prisma.exam.upsert({
      where: { slug: exam.slug },
      update: {},
      create: {
        slug: exam.slug,
        name: exam.name,
        fullName: exam.fullName,
        description: exam.description,
        color: exam.color,
        icon: exam.icon,
        order: i,
      },
    });

    // Create ExamSubject joins for this exam's subjects
    for (const subjectSlug of exam.subjects) {
      const subject = await prisma.subject.findUnique({
        where: { slug: subjectSlug },
      });

      if (subject) {
        await prisma.examSubject.upsert({
          where: {
            examId_subjectId: {
              examId: createdExam.id,
              subjectId: subject.id,
            },
          },
          update: {},
          create: {
            examId: createdExam.id,
            subjectId: subject.id,
          },
        });
      }
    }
  }
  console.log(`✓ Seeded ${EXAMS.length} exams with exam-subject joins`);



  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
