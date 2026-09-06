import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWallpaperBySlug, getRelatedWallpapers, incrementDownloadCount } from "@/services/wallpapers.service";
import type { Wallpaper } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/Loader";
import { WallpaperImage } from "@/components/ui/WallpaperImage";
import { DownloadIcon } from "@/components/ui/Icons";

export function WallpaperDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null | undefined>(undefined);
  const [related, setRelated] = useState<Wallpaper[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setWallpaper(undefined);
    getWallpaperBySlug(slug).then(async (w) => {
      setWallpaper(w);
      if (w) {
        document.title = `${w.title} - MOONpaper`;
        const rel = await getRelatedWallpapers(w);
        setRelated(rel);
      }
    });
  }, [slug]);

  async function handleDownload() {
    if (!wallpaper) return;
    setDownloading(true);
    try {
      await incrementDownloadCount(wallpaper.id);
      const link = document.createElement("a");
      link.href = wallpaper.download_url;
      link.download = `${wallpaper.slug}.jpg`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  if (wallpaper === null) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Wallpaper not found."
          description="This wallpaper may have been unpublished or removed."
          action={
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go back
            </Button>
          }
        />
      </div>
    );
  }

  const isPortrait = wallpaper?.device_type === "mobile";

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        {/* Preview - stays the visual centerpiece */}
        <div className={`glass overflow-hidden rounded-card ${isPortrait ? "mx-auto w-full max-w-sm lg:mx-0" : ""}`}>
          {wallpaper === undefined ? (
            <SkeletonBlock className={isPortrait ? "aspect-[9/16] rounded-none" : "aspect-[16/9] rounded-none"} />
          ) : (
            <WallpaperImage
              src={wallpaper.image_url}
              alt={wallpaper.title}
              aspect={isPortrait ? "portrait" : "landscape"}
              className="rounded-none"
              loading="eager"
            />
          )}
        </div>

        {/* Structured metadata panel */}
        <div>
          {wallpaper === undefined ? (
            <div className="space-y-4">
              <SkeletonBlock className="h-10 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="glass flex h-full flex-col rounded-card p-6 sm:p-7">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="emphasis">{wallpaper.category.replace("-", " ")}</Badge>
                <Badge>{wallpaper.device_type === "pc" ? "Desktop" : "Mobile"}</Badge>
              </div>

              <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{wallpaper.title}</h1>
              {wallpaper.description && <p className="mt-3 text-sm leading-relaxed text-haze">{wallpaper.description}</p>}

              <dl className="mt-7 grid grid-cols-2 gap-y-5 border-y border-white/10 py-6 text-sm">
                <Detail label="Resolution" value={wallpaper.resolution} />
                <Detail label="Aspect ratio" value={wallpaper.aspect_ratio} />
                <Detail label="Category" value={wallpaper.category.replace("-", " ")} />
                <Detail label="Downloads" value={wallpaper.downloads.toLocaleString()} />
              </dl>

              {wallpaper.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {wallpaper.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
              )}

              <Button onClick={handleDownload} disabled={downloading} className="mt-8 w-full sm:w-auto">
                <DownloadIcon size={16} />
                {downloading ? "Preparing download" : "Download wallpaper"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink">You may also like</h2>
          <WallpaperGrid wallpapers={related} />
        </section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-medium capitalize text-ink">{value}</dd>
    </div>
  );
}
