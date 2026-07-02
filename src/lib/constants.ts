import type {
  Exam,
  Subject,
  ResourceTypeMeta,
  Resource,
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

/**
 * Demo resources for Phase 1 (no DB yet). Replaced by Prisma queries in Phase 2.
 * Sources shown are placeholders for approved/redistributable origins only.
 */
export const DEMO_RESOURCES: Resource[] = [
  {
    id: "r1",
    slug: "jee-main-physics-kinematics-notes",
    title: "Kinematics — Complete Notes (Class 11)",
    description:
      "Detailed notes covering motion in 1D & 2D, projectile motion, relative velocity with solved examples.",
    exam: "jee-main",
    subject: "physics",
    classLevel: "Class 11",
    chapter: "Kinematics",
    resourceType: "notes",
    format: "PDF",
    language: "English",
    difficulty: "Medium",
    tags: ["kinematics", "mechanics", "class-11", "motion"],
    views: 48210,
    downloads: 12840,
    rating: 4.7,
    ratingCount: 1203,
    updatedAt: "2026-06-12",
    source: "NCERT / Open Courseware",
    isPremium: false,
  },
  {
    id: "r2",
    slug: "neet-biology-human-physiology-pyq",
    title: "Human Physiology — Previous Year Questions (2014–2025)",
    description:
      "Chapter-wise NEET PYQs on human physiology with detailed solutions and answer keys.",
    exam: "neet",
    subject: "biology",
    classLevel: "Class 12",
    chapter: "Human Physiology",
    resourceType: "pyqs",
    format: "PDF",
    year: 2025,
    language: "English",
    difficulty: "Hard",
    tags: ["physiology", "pyq", "neet", "biology"],
    views: 67320,
    downloads: 24110,
    rating: 4.9,
    ratingCount: 2890,
    updatedAt: "2026-06-20",
    source: "NTA Public Archive",
    isPremium: false,
  },
  {
    id: "r3",
    slug: "jee-advanced-maths-calculus-formula-sheet",
    title: "Calculus — One-Page Formula Sheet",
    description:
      "All limits, derivatives, integrals & series formulas condensed into a printable revision sheet.",
    exam: "jee-advanced",
    subject: "mathematics",
    classLevel: "All",
    chapter: "Calculus",
    resourceType: "formula-sheets",
    format: "PDF",
    language: "English",
    difficulty: "Medium",
    tags: ["calculus", "formula-sheet", "revision"],
    views: 91500,
    downloads: 41200,
    rating: 4.8,
    ratingCount: 3540,
    updatedAt: "2026-06-25",
    source: "Open Courseware",
    isPremium: false,
  },
  {
    id: "r4",
    slug: "jee-main-chemistry-mole-concept-mock",
    title: "Mole Concept — Full Mock Test (30 Qs)",
    description:
      "Timed mock test on mole concept & stoichiometry with instant scoring and solutions.",
    exam: "jee-main",
    subject: "chemistry",
    classLevel: "Class 11",
    chapter: "Some Basic Concepts of Chemistry",
    resourceType: "mock-tests",
    format: "PDF",
    language: "English",
    difficulty: "Medium",
    tags: ["mole-concept", "mock-test", "stoichiometry"],
    views: 33120,
    downloads: 9870,
    rating: 4.6,
    ratingCount: 870,
    updatedAt: "2026-06-18",
    source: "Open Courseware",
    isPremium: false,
  },
  {
    id: "r5",
    slug: "kcet-physics-current-electricity-revision",
    title: "Current Electricity — Quick Revision (Kannada + English)",
    description:
      "Bilingual revision notes on current electricity tailored to the Karnataka state syllabus.",
    exam: "kcet",
    subject: "physics",
    classLevel: "Class 12",
    chapter: "Current Electricity",
    resourceType: "revision-notes",
    format: "PDF",
    language: "Kannada",
    difficulty: "Easy",
    tags: ["current-electricity", "kcet", "revision", "bilingual"],
    views: 14200,
    downloads: 5120,
    rating: 4.5,
    ratingCount: 410,
    updatedAt: "2026-06-22",
    source: "State Board Open Material",
    isPremium: false,
  },
  {
    id: "r6",
    slug: "neet-chemistry-organic-named-reactions",
    title: "Organic Chemistry — Named Reactions Mind Map",
    description:
      "Visual mind map of 60+ named reactions with conditions, reagents and mechanisms.",
    exam: "neet",
    subject: "chemistry",
    classLevel: "Class 12",
    chapter: "Organic Chemistry — Basic Principles",
    resourceType: "mind-maps",
    format: "PDF",
    language: "English",
    difficulty: "Hard",
    tags: ["organic", "named-reactions", "mind-map"],
    views: 52800,
    downloads: 19340,
    rating: 4.9,
    ratingCount: 2110,
    updatedAt: "2026-06-28",
    source: "Open Courseware",
    isPremium: false,
  },
];

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

export const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "NEET 2025 • AIR 1,204",
    quote:
      "ExamSetu saved me hours every week. Everything I needed for Biology revision was in one place, perfectly organized.",
    avatar: "AS",
  },
  {
    name: "Rohit Verma",
    role: "JEE Advanced 2025 • IIT Bombay",
    quote:
      "The formula sheets and PYQ banks are gold. I stopped jumping between 10 different websites.",
    avatar: "RV",
  },
  {
    name: "Sneha Patil",
    role: "KCET 2025 • Top 500",
    quote:
      "Finally a platform with Kannada + English material for the state syllabus. Clean, fast and free.",
    avatar: "SP",
  },
];

export const NAV_LINKS = [
  { label: "Exams", href: "/exams" },
  { label: "Subjects", href: "/subjects" },
  { label: "Resources", href: "/resources" },
  { label: "Premium", href: "/premium" },
  { label: "Blog", href: "/blog" },
];
