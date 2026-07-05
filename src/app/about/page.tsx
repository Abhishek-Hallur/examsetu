export default function AboutPage() {
  return (
    <main className="container py-12 md:py-24">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-lg text-muted-foreground">
            ExamSetu is India&apos;s largest organized library of free educational resources.
            Our mission is to democratize education by providing high-quality study materials
            for all major exams in one place.
          </p>
        </div>
      </div>
    </main>
  );
}
