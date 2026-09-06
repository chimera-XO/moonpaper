import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWallpapers } from "@/services/wallpapers.service";
import { getCollections } from "@/services/collections.service";
import type { Wallpaper, Collection } from "@/types";
import { Button } from "@/components/ui/Button";

export function AdminDashboard() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWallpapers({ publishedOnly: false }), getCollections(false)]).then(([w, c]) => {
      setWallpapers(w);
      setCollections(c);
      setLoading(false);
    });
  }, []);

  const published = wallpapers.filter((w) => w.published).length;
  const featured = wallpapers.filter((w) => w.featured).length;
  const totalDownloads = wallpapers.reduce((sum, w) => sum + w.downloads, 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Overview</h1>
          <p className="mt-1 text-sm text-haze">A quick look at the wallpaper archive.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/wallpapers/new">
            <Button size="sm">Add wallpaper</Button>
          </Link>
          <Link to="/admin/collections/new">
            <Button size="sm" variant="secondary">
              New collection
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total wallpapers" value={loading ? "..." : wallpapers.length} />
        <StatCard label="Published" value={loading ? "..." : published} />
        <StatCard label="Featured" value={loading ? "..." : featured} />
        <StatCard label="Total downloads" value={loading ? "..." : totalDownloads.toLocaleString()} />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Recent wallpapers</h2>
            <Link to="/admin/wallpapers" className="text-xs font-medium text-purple-300">
              Manage all
            </Link>
          </div>
          <div className="space-y-3">
            {wallpapers.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center gap-3">
                <span className="block h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface2"><img src={w.image_url} alt={w.title} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} className="h-full w-full object-cover" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                  <p className="text-xs text-muted">{w.device_type === "pc" ? "Desktop" : "Mobile"} · {w.category}</p>
                </div>
                {!w.published && (
                  <span className="rounded-control bg-surface2 px-2 py-0.5 text-[10px] text-haze border border-white/10">Draft</span>
                )}
              </div>
            ))}
            {!loading && wallpapers.length === 0 && <p className="text-sm text-muted">No wallpapers yet.</p>}
          </div>
        </div>

        <div className="glass rounded-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Collections</h2>
            <Link to="/admin/collections" className="text-xs font-medium text-purple-300">
              Manage all
            </Link>
          </div>
          <div className="space-y-3">
            {collections.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="block h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface2"><img src={c.cover_image} alt={c.name} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} className="h-full w-full object-cover" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-muted">{c.wallpaper_ids.length} wallpapers</p>
                </div>
                {!c.published && (
                  <span className="rounded-control bg-surface2 px-2 py-0.5 text-[10px] text-haze border border-white/10">Draft</span>
                )}
              </div>
            ))}
            {!loading && collections.length === 0 && <p className="text-sm text-muted">No collections yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-card p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
