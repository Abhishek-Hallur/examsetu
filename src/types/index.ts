/** Core domain types for ExamSetu (UI-facing shapes; DB models live in Prisma). */

export type ExamSlug = "jee-main" | "jee-advanced" | "neet" | "kcet";

export type SubjectSlug = "physics" | "chemistry" | "mathematics" | "biology";

export type Language = "English" | "Hindi" | "Kannada";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ResourceFormat = "PDF" | "Video" | "Website";

export interface Exam {
  slug: ExamSlug;
  name: string;
  fullName: string;
  description: string;
  color: string; // tailwind gradient classes
  icon: string;
  resourceCount: number;
  subjects: SubjectSlug[];
}

export interface Subject {
  slug: SubjectSlug;
  name: string;
  description: string;
  color: string;
  icon: string;
  resourceCount: number;
}

export interface ResourceTypeMeta {
  slug: string;
  name: string;
  icon: string;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  exam: ExamSlug;
  subject: SubjectSlug;
  classLevel: "Class 11" | "Class 12" | "Dropper" | "All";
  chapter: string;
  resourceType: string;
  format: ResourceFormat;
  year?: number;
  language: Language;
  difficulty?: Difficulty;
  tags: string[];
  views: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  updatedAt: string;
  source: string;
  isPremium: boolean;
  fileUrl?: string | null;
}
