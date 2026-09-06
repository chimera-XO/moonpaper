import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { Category, DeviceType, Wallpaper, WallpaperInput } from "@/types";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/localStore";

interface WallpaperFormProps {
  categories: Category[];
  initial?: Wallpaper;
  submitLabel: string;
  onSubmit: (input: WallpaperInput) => Promise<void>;
}

const emptyForm: WallpaperInput = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  download_url: "",
  device_type: "pc",
  category: "",
  resolution: "",
  aspect_ratio: "",
  tags: [],
  featured: false,
  published: true,
};

export function WallpaperForm({ categories, initial, submitLabel, onSubmit }: WallpaperFormProps) {
  const [form, setForm] = useState<WallpaperInput>(
    initial
      ? {
          title: initial.title,
          slug: initial.slug,
          description: initial.description,
          image_url: initial.image_url,
          download_url: initial.download_url,
          device_type: initial.device_type,
          category: initial.category,
          resolution: initial.resolution,
          aspect_ratio: initial.aspect_ratio,
          tags: initial.tags,
          featured: initial.featured,
          published: initial.published,
        }
      : emptyForm
  );
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relevantCategories = categories.filter((c) => c.type === form.device_type || c.type === "both");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        slug: form.slug ? slugify(form.slug) : slugify(form.title),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong saving this wallpaper.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-control border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-medium text-ink">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Slug (optional, auto-generated from title)">
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder={slugify(form.title) || "lunar-eclipse"}
            className="input"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="input resize-none"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Image / preview URL">
          <input
            required
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
            className="input"
          />
        </Field>
        <Field label="Download file URL">
          <input
            required
            value={form.download_url}
            onChange={(e) => setForm({ ...form, download_url: e.target.value })}
            placeholder="https://..."
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Device type">
          <select
            value={form.device_type}
            onChange={(e) =>
              setForm({ ...form, device_type: e.target.value as DeviceType, category: "" })
            }
            className="input"
          >
            <option value="pc">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </Field>
        <Field label="Category">
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input"
          >
            <option value="">Select category</option>
            {relevantCategories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Resolution">
          <input
            required
            value={form.resolution}
            onChange={(e) => setForm({ ...form, resolution: e.target.value })}
            placeholder="3840x2160"
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Aspect ratio">
          <input
            required
            value={form.aspect_ratio}
            onChange={(e) => setForm({ ...form, aspect_ratio: e.target.value })}
            placeholder="16:9"
            className="input"
          />
        </Field>
        <Field label="Tags (comma separated)">
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="space, dark, minimal"
            className="input"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-haze">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-line bg-surface accent-purple-core"
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-haze">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 rounded border-line bg-surface accent-purple-core"
          />
          Published
        </label>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-haze">{label}</span>
      {children}
    </label>
  );
}
