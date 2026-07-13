import type {
  Exam,
  Subject,
  ResourceTypeMeta,
} from "@/types";

export const SITE = {
  name: "ExamSetu",
  tagline: "One Platform. Every Resource. Every Exam.",
  description:
    "India's largest organized library of FREE educational resources for JEE Main, JEE Advanced, NEET and KCET. Notes, PYQs, mock tests, formula sheets and more — all in one place.",
  url: "https://examsetu.in",
} as const;

export const EXAMS: Exam[] = [
  {
    slug: "jee-main",
    name: "JEE Main",
    fullName: "Joint Entrance Examination (Main)",
    description: "Notes, PYQs, mock tests & formula sheets for JEE Main aspirants.",
    color: "from-blue-500 to-indigo-600",
    icon: "Atom",
    resourceCount: 4820,
    subjects: ["physics", "chemistry", "mathematics"],
  },
  {
    slug: "jee-advanced",
    name: "JEE Advanced",
    fullName: "Joint Entrance Examination (Advanced)",
    description: "Advanced problem sets, theory & past papers for IIT aspirants.",
    color: "from-violet-500 to-purple-600",
    icon: "Sigma",
    resourceCount: 3110,
    subjects: ["physics", "chemistry", "mathematics"],
  },
  {
    slug: "neet",
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    description: "Biology, Physics & Chemistry resources for medical aspirants.",
    color: "from-emerald-500 to-teal-600",
    icon: "Dna",
    resourceCount: 5240,
    subjects: ["physics", "chemistry", "biology"],
  },
  {
    slug: "kcet",
    name: "KCET",
    fullName: "Karnataka Common Entrance Test",
    description: "Karnataka state syllabus notes & PYQs for engineering & medical.",
    color: "from-amber-500 to-orange-600",
    icon: "GraduationCap",
    resourceCount: 1870,
    subjects: ["physics", "chemistry", "mathematics", "biology"],
  },
];

export const SUBJECTS: Subject[] = [
  {
    slug: "physics",
    name: "Physics",
    description: "Mechanics, electromagnetism, modern physics & more.",
    color: "from-blue-500 to-cyan-500",
    icon: "Atom",
    resourceCount: 4120,
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    description: "Physical, organic & inorganic chemistry.",
    color: "from-rose-500 to-pink-500",
    icon: "FlaskConical",
    resourceCount: 3980,
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    description: "Calculus, algebra, coordinate geometry & trigonometry.",
    color: "from-indigo-500 to-blue-500",
    icon: "Sigma",
    resourceCount: 3450,
  },
  {
    slug: "biology",
    name: "Biology",
    description: "Botany & zoology for NEET and KCET.",
    color: "from-emerald-500 to-green-500",
    icon: "Leaf",
    resourceCount: 2890,
  },
];

export const RESOURCE_TYPES: ResourceTypeMeta[] = [
  { slug: "notes", name: "Notes", icon: "FileText" },
  { slug: "formula-sheets", name: "Formula Sheets", icon: "Calculator" },
  { slug: "revision-notes", name: "Revision Notes", icon: "BookMarked" },
  { slug: "pyqs", name: "PYQs", icon: "History" },
  { slug: "question-banks", name: "Question Banks", icon: "Library" },
  { slug: "practice-questions", name: "Practice Questions", icon: "PencilRuler" },
  { slug: "mock-tests", name: "Mock Tests", icon: "Timer" },
  { slug: "sample-papers", name: "Sample Papers", icon: "FileStack" },
  { slug: "ncert", name: "NCERT", icon: "BookOpen" },
  { slug: "cheat-sheets", name: "Cheat Sheets", icon: "Zap" },
  { slug: "mind-maps", name: "Mind Maps", icon: "Network" },
  { slug: "important-questions", name: "Important Questions", icon: "Star" },
  { slug: "videos", name: "Videos", icon: "Play" },
];

export const LANGUAGES = ["English", "Hindi", "Kannada"] as const;
export const CLASS_LEVELS = ["Class 11", "Class 12", "Dropper", "All"] as const;
export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const FAQS = [
  {
    q: "Is ExamSetu really free?",
    a: "Yes. Browsing and downloading free resources is completely free, forever. We offer an optional Premium plan that removes ads and adds offline downloads, analytics and more.",
  },
  {
    q: "Where do the resources come from?",
    a: "We only organize and link resources from approved sources that permit indexing or redistribution — NCERT, open courseware, public exam archives and state board open material. We never bypass paywalls or copyright.",
  },
  {
    q: "Which exams do you cover?",
    a: "Currently JEE Main, JEE Advanced, NEET and KCET — across Physics, Chemistry, Mathematics and Biology. More exams are on the way.",
  },
  {
    q: "How are resources organized?",
    a: "Every document is auto-categorized into Exam → Subject → Class → Chapter → Resource Type → Year → Language, so you find exactly what you need in seconds.",
  },
  {
    q: "Can I request a resource?",
    a: "Absolutely. Premium and registered users can request specific topics, and our automation looks for matching approved material.",
  },
];

export const NAV_LINKS = [
  { label: "Exams", href: "/exams" },
  { label: "Subjects", href: "/subjects" },
  { label: "Resources", href: "/resources" },
  { label: "Premium", href: "/premium" },
  { label: "Blog", href: "/blog" },
];
