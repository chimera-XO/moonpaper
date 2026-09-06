import { useState } from "react";
import type { FormEvent } from "react";
import type { Collection, CollectionInput, Wallpaper } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { slugify } from "@/lib/localStore";

interface CollectionFormProps {
  wallpapers: Wallpaper[];
  initial?: Collection;
  submitLabel: string;
  onSubmit: (input: CollectionInput) => Promise<void>;
}

export function CollectionForm({ wallpapers, initial, submitLabel, onSubmit }: CollectionFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [selected, setSelected] = useState<string[]>(initial?.wallpaper_ids ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name,
        slug: slug ? slugify(slug) : slugify(name),
        description,
        cover_image: coverImage,
        published,
        wallpaper_ids: selected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong saving this collection.");
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
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-haze">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-haze">Slug (optional)</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugify(name) || "neon-future"}
            className="input"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-haze">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="input resize-none"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-haze">Cover image URL</span>
        <input
          required
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
          className="input"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-haze">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-line bg-surface accent-purple-core"
        />
        Published
      </label>

      <div>
        <span className="mb-2 block text-xs font-medium text-haze">
          Wallpapers in this collection ({selected.length} selected)
        </span>
        <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-line bg-elevated p-3 sm:grid-cols-4 md:grid-cols-6">
          {wallpapers.map((w) => {
            const isSelected = selected.includes(w.id);
            return (
              <button
                type="button"
                key={w.id}
                onClick={() => toggle(w.id)}
                className={`relative overflow-hidden rounded-xl border-2 transition-colors ${
                  isSelected ? "border-purple-core" : "border-transparent"
                }`}
              >
                <img
                  src={w.image_url}
                  alt={w.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="aspect-square w-full bg-surface2 object-cover"
                />
                {isSelected && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-core text-white">
                    <CheckIcon size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
