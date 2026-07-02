"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface SelectOption {
  id: string;
  name: string;
}

interface ResourceFormProps {
  mode: "create" | "edit";
  resourceId?: string;
  exams: SelectOption[];
  subjects: SelectOption[];
  resourceTypes: SelectOption[];
  defaultValues?: {
    title?: string;
    description?: string;
    examId?: string;
    subjectId?: string;
    resourceTypeId?: string;
    classLevel?: string;
    chapter?: string;
    format?: string;
    year?: number | null;
    language?: string;
    difficulty?: string | null;
    source?: string;
    fileUrl?: string | null;
    isPremium?: boolean;
    published?: boolean;
    tags?: string[];
  };
}

const CLASS_LEVELS = ["Class 11", "Class 12", "Dropper", "All"];
const FORMATS = ["PDF", "Video", "Website"];
const LANGUAGES = ["English", "Hindi", "Kannada"];
const DIFFICULTIES = ["", "Easy", "Medium", "Hard"];

export function ResourceForm({
  mode,
  resourceId,
  exams,
  subjects,
  resourceTypes,
  defaultValues = {},
}: ResourceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: defaultValues.title ?? "",
    description: defaultValues.description ?? "",
    examId: defaultValues.examId ?? "",
    subjectId: defaultValues.subjectId ?? "",
    resourceTypeId: defaultValues.resourceTypeId ?? "",
    classLevel: defaultValues.classLevel ?? "All",
    chapter: defaultValues.chapter ?? "",
    format: defaultValues.format ?? "PDF",
    year: defaultValues.year?.toString() ?? "",
    language: defaultValues.language ?? "English",
    difficulty: defaultValues.difficulty ?? "",
    source: defaultValues.source ?? "",
    fileUrl: defaultValues.fileUrl ?? "",
    isPremium: defaultValues.isPremium ?? false,
    published: defaultValues.published ?? true,
    tags: defaultValues.tags?.join(", ") ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const url =
      mode === "create"
        ? "/api/admin/resources"
        : `/api/admin/resources/${resourceId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    startTransition(async () => {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setSuccess(true);
      if (mode === "create") {
        router.push("/admin/resources");
      } else {
        router.refresh();
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500/50 focus:bg-white/10 focus:outline-none transition-colors";
  const labelCls = "block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5";
  const sectionCls = "rounded-2xl border border-white/10 bg-white/[0.03] p-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className={sectionCls}>
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="rf-title">Title *</label>
            <input
              id="rf-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. JEE Main 2024 Physics Paper"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-description">Description</label>
            <textarea
              id="rf-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the resource…"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-source">Source URL *</label>
            <input
              id="rf-source"
              name="source"
              value={form.source}
              onChange={handleChange}
              required
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-fileUrl">File / Embed URL</label>
            <input
              id="rf-fileUrl"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://... (PDF embed or direct link)"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className={sectionCls}>
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Classification</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="rf-examId">Exam *</label>
            <select id="rf-examId" name="examId" value={form.examId} onChange={handleChange} required className={inputCls}>
              <option value="">Select exam…</option>
              {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-subjectId">Subject *</label>
            <select id="rf-subjectId" name="subjectId" value={form.subjectId} onChange={handleChange} required className={inputCls}>
              <option value="">Select subject…</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-resourceTypeId">Resource Type *</label>
            <select id="rf-resourceTypeId" name="resourceTypeId" value={form.resourceTypeId} onChange={handleChange} required className={inputCls}>
              <option value="">Select type…</option>
              {resourceTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-classLevel">Class Level *</label>
            <select id="rf-classLevel" name="classLevel" value={form.classLevel} onChange={handleChange} className={inputCls}>
              {CLASS_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-chapter">Chapter *</label>
            <input
              id="rf-chapter"
              name="chapter"
              value={form.chapter}
              onChange={handleChange}
              required
              placeholder="e.g. Thermodynamics"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-format">Format *</label>
            <select id="rf-format" name="format" value={form.format} onChange={handleChange} className={inputCls}>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-language">Language *</label>
            <select id="rf-language" name="language" value={form.language} onChange={handleChange} className={inputCls}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-year">Year</label>
            <input
              id="rf-year"
              name="year"
              value={form.year}
              onChange={handleChange}
              type="number"
              min="2000"
              max="2100"
              placeholder="e.g. 2024"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-difficulty">Difficulty</label>
            <select id="rf-difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className={inputCls}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d || "None"}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="rf-tags">Tags (comma-separated)</label>
            <input
              id="rf-tags"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. jee-2024, organic, neet"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className={sectionCls}>
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Visibility & Access</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isPremium"
              checked={form.isPremium}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-rose-500"
            />
            <span className="text-sm text-slate-300">Premium only</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-500"
            />
            <span className="text-sm text-slate-300">Published (visible to users)</span>
          </label>
        </div>
      </div>

      {/* Error / Success */}
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && mode === "edit" && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          Resource updated successfully.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:opacity-60"
        >
          {isPending
            ? mode === "create" ? "Creating…" : "Saving…"
            : mode === "create" ? "Create Resource" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
