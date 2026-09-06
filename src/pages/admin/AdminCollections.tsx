import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCollections, updateCollection, deleteCollection } from "@/services/collections.service";
import type { Collection } from "@/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/Loader";

export function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    getCollections(false).then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function togglePublished(c: Collection) {
    setPendingId(c.id);
    await updateCollection(c.id, { published: !c.published });
    load();
    setPendingId(null);
  }

  async function handleDelete(c: Collection) {
    if (!confirm(`Delete "${c.name}"? This can't be undone.`)) return;
    setPendingId(c.id);
    await deleteCollection(c.id);
    load();
    setPendingId(null);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Collections</h1>
          <p className="mt-1 text-sm text-haze">{collections.length} total</p>
        </div>
        <Link to="/admin/collections/new">
          <Button size="sm">New collection</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-40" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections yet."
          description="Group wallpapers into a themed collection."
          action={
            <Link to="/admin/collections/new">
              <Button size="sm">New collection</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div
              key={c.id}
              className={`glass overflow-hidden rounded-card ${
                pendingId === c.id ? "opacity-50" : ""
              }`}
            >
              <span className="block h-32 w-full overflow-hidden bg-surface2">
                <img
                  src={c.cover_image}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-display font-semibold text-ink">{c.name}</p>
                  <button
                    onClick={() => togglePublished(c)}
                    className={`shrink-0 rounded-control px-2.5 py-0.5 text-[11px] font-medium ${
                      c.published ? "bg-purple-core/20 text-purple-glow" : "bg-surface2 text-haze"
                    }`}
                  >
                    {c.published ? "Published" : "Draft"}
                  </button>
                </div>
                <p className="mb-4 text-xs text-muted">{c.wallpaper_ids.length} wallpapers</p>
                <div className="flex gap-2">
                  <Link to={`/admin/collections/${c.id}`} className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(c)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
