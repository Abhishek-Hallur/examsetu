import { PrismaClient } from "@prisma/client";
import {
  EXAMS,
  SUBJECTS,
  RESOURCE_TYPES,
  DEMO_RESOURCES,
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

  // Seed RESOURCES with Tags and ResourceTag joins
  console.log("📄 Seeding resources...");
  for (const resource of DEMO_RESOURCES) {
    // Fetch related entities
    const exam = await prisma.exam.findUnique({
      where: { slug: resource.exam },
    });
    const subject = await prisma.subject.findUnique({
      where: { slug: resource.subject },
    });
    const resourceType = await prisma.resourceType.findUnique({
      where: { slug: resource.resourceType },
    });

    if (!exam || !subject || !resourceType) {
      console.warn(
        `⚠️  Skipping resource "${resource.slug}" — missing exam, subject, or resourceType`
      );
      continue;
    }

    // Upsert the resource
    const createdResource = await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: {
        title: resource.title,
        description: resource.description,
        classLevel: resource.classLevel,
        chapter: resource.chapter,
        format: resource.format,
        year: resource.year || null,
        language: resource.language,
        difficulty: resource.difficulty || null,
        views: resource.views,
        downloads: resource.downloads,
        rating: resource.rating,
        ratingCount: resource.ratingCount,
        source: resource.source,
        isPremium: resource.isPremium,
      },
      create: {
        slug: resource.slug,
        title: resource.title,
        description: resource.description,
        examId: exam.id,
        subjectId: subject.id,
        resourceTypeId: resourceType.id,
        classLevel: resource.classLevel,
        chapter: resource.chapter,
        format: resource.format,
        year: resource.year || null,
        language: resource.language,
        difficulty: resource.difficulty || null,
        views: resource.views,
        downloads: resource.downloads,
        rating: resource.rating,
        ratingCount: resource.ratingCount,
        source: resource.source,
        isPremium: resource.isPremium,
      },
    });

    // Upsert tags and create ResourceTag joins
    for (const tagName of resource.tags) {
      // Derive slug from tag name (lowercase, replace spaces with dashes)
      const tagSlug = tagName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: {
          slug: tagSlug,
          name: tagName,
        },
      });

      // Create ResourceTag join
      await prisma.resourceTag.upsert({
        where: {
          resourceId_tagId: {
            resourceId: createdResource.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          resourceId: createdResource.id,
          tagId: tag.id,
        },
      });
    }
  }
  console.log(`✓ Seeded ${DEMO_RESOURCES.length} resources with tags`);

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
