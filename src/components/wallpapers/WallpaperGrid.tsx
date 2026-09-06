import type { Wallpaper } from "@/types";
import { WallpaperCard } from "@/components/wallpapers/WallpaperCard";
import { SkeletonCard } from "@/components/wallpapers/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  skeletonCount?: number;
}

export function WallpaperGrid({
  wallpapers,
  loading,
  emptyTitle = "Nothing here yet.",
  emptyDescription = "New wallpapers are landing soon.",
  skeletonCount = 8,
}: WallpaperGridProps) {
  if (loading) {
    return (
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} portrait={i % 3 === 0} />
        ))}
      </div>
    );
  }

  if (!wallpapers.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
}
