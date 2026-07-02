import { prisma } from "@/lib/prisma";
import { ResourceForm } from "@/components/admin/resource-form";

export const metadata = { title: "New Resource — ExamSetu Admin" };

async function getFormData() {
  const [exams, subjects, resourceTypes] = await Promise.all([
    prisma.exam.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.resourceType.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return { exams, subjects, resourceTypes };
}

export default async function NewResourcePage() {
  const { exams, subjects, resourceTypes } = await getFormData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Resource</h1>
        <p className="mt-1 text-sm text-slate-400">
          Add a new study resource to the library.
        </p>
      </div>

      <ResourceForm
        mode="create"
        exams={exams}
        subjects={subjects}
        resourceTypes={resourceTypes}
      />
    </div>
  );
}
