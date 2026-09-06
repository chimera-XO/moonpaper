import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWallpapers, updateWallpaper, deleteWallpaper } from "@/services/wallpapers.service";
import type { Wallpaper } from "@/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/Loader";

export function AdminWallpapers() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    getWallpapers({ publishedOnly: false, sort: "newest" }).then((data) => {
      setWallpapers(data);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function togglePublished(w: Wallpaper) {
    setPendingId(w.id);
    await updateWallpaper(w.id, { published: !w.published });
    load();
    setPendingId(null);
  }

  async function toggleFeatured(w: Wallpaper) {
    setPendingId(w.id);
    await updateWallpaper(w.id, { featured: !w.featured });
    load();
    setPendingId(null);
  }

  async function handleDelete(w: Wallpaper) {
    if (!confirm(`Delete "${w.title}"? This can't be undone.`)) return;
    setPendingId(w.id);
    await deleteWallpaper(w.id);
    load();
    setPendingId(null);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Wallpapers</h1>
          <p className="mt-1 text-sm text-haze">{wallpapers.length} total</p>
        </div>
        <Link to="/admin/wallpapers/new">
          <Button size="sm">Add wallpaper</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16" />
          ))}
        </div>
      ) : wallpapers.length === 0 ? (
        <EmptyState
          title="No wallpapers yet."
          description="Add your first wallpaper to get the archive started."
          action={
            <Link to="/admin/wallpapers/new">
              <Button size="sm">Add wallpaper</Button>
            </Link>
          }
        />
      ) : (
        <div className="glass overflow-hidden rounded-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Wallpaper</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Device</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Downloads</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {wallpapers.map((w) => (
                <tr key={w.id} className={pendingId === w.id ? "opacity-50" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="block h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface2"><img src={w.image_url} alt={w.title} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} className="h-full w-full object-cover" /></span>
                      <span className="font-medium text-ink">{w.title}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 capitalize text-haze sm:table-cell">
                    {w.device_type === "pc" ? "Desktop" : "Mobile"}
                  </td>
                  <td className="hidden px-4 py-3 capitalize text-haze md:table-cell">
                    {w.category.replace("-", " ")}
                  </td>
                  <td className="hidden px-4 py-3 text-haze lg:table-cell">{w.downloads.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => togglePublished(w)}
                        className={`w-fit rounded-control px-2.5 py-0.5 text-[11px] font-medium ${
                          w.published ? "bg-purple-core/20 text-purple-glow" : "bg-surface2 text-haze"
                        }`}
                      >
                        {w.published ? "Published" : "Draft"}
                      </button>
                      <button
                        onClick={() => toggleFeatured(w)}
                        className={`w-fit rounded-control px-2.5 py-0.5 text-[11px] font-medium ${
                          w.featured ? "border border-purple-400/40 text-purple-300" : "bg-surface2 text-muted"
                        }`}
                      >
                        {w.featured ? "Featured" : "Not featured"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/wallpapers/${w.id}`}>
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(w)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
