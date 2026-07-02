import * as React from "react";
import {
  Atom,
  BookMarked,
  BookOpen,
  Calculator,
  Circle,
  Dna,
  FileStack,
  FileText,
  FlaskConical,
  GraduationCap,
  History,
  Leaf,
  Library,
  Network,
  PencilRuler,
  Play,
  Sigma,
  Star,
  Timer,
  Zap,
  type LucideProps,
} from "lucide-react";

/**
 * Static map of icon names used across the app.
 * Keeping this explicit avoids importing the entire lucide-react icon set,
 * which would bloat the client JS bundle by ~500 KB.
 */
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Atom,
  BookMarked,
  BookOpen,
  Calculator,
  Dna,
  FileStack,
  FileText,
  FlaskConical,
  GraduationCap,
  History,
  Leaf,
  Library,
  Network,
  PencilRuler,
  Play,
  Sigma,
  Star,
  Timer,
  Zap,
};

/** Render a Lucide icon by its string name (falls back to a circle). */
export function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = ICON_MAP[name];
  if (!Cmp) return <Circle {...props} />;
  return <Cmp {...props} />;
}

