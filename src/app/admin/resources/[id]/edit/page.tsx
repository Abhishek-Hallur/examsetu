import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getResourceForEdit } from "@/lib/data";
import { ResourceForm } from "@/components/admin/resource-form";

export const metadata = { title: "Edit Resource — ExamSetu Admin" };

async function getFormData() {
  const [exams, subjects, resourceTypes] = await Promise.all([
    prisma.exam.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.resourceType.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return { exams, subjects, resourceTypes };
}

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resource, formData] = await Promise.all([
    getResourceForEdit(id),
    getFormData(),
  ]);

  if (!resource) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Resource</h1>
        <p className="mt-1 text-sm text-slate-400 truncate">
          {resource.title}
        </p>
      </div>

      <ResourceForm
        mode="edit"
        resourceId={resource.id}
        exams={formData.exams}
        subjects={formData.subjects}
        resourceTypes={formData.resourceTypes}
        defaultValues={resource}
      />
    </div>
  );
}
