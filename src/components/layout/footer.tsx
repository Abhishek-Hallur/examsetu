import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { SITE, EXAMS, SUBJECTS } from "@/lib/constants";

const footerCols = [
  {
    title: "Exams",
    links: EXAMS.map((e) => ({ label: e.name, href: `/exams/${e.slug}` })),
  },
  {
    title: "Subjects",
    links: SUBJECTS.map((s) => ({
      label: s.name,
      href: `/subjects/${s.slug}`,
    })),
  },
  {
    title: "Platform",
    links: [
      { label: "All Resources", href: "/resources" },
      { label: "Premium", href: "/premium" },
      { label: "Blog", href: "/blog" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Copyright / DMCA", href: "/copyright" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <GraduationCap className="size-5" />
              </span>
              <span className="text-lg">{SITE.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {SITE.tagline} India&apos;s largest organized library of free
              educational resources.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All resources are linked
            from approved, redistributable sources.
          </p>
          <p>Made with care for Indian students 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
