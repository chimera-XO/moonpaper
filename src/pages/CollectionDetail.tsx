import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCollectionBySlug, getCollectionWallpapers } from "@/services/collections.service";
import type { Collection, Wallpaper } from "@/types";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null | undefined>(undefined);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getCollectionBySlug(slug).then(async (col) => {
      setCollection(col);
      if (col) {
        const items = await getCollectionWallpapers(col);
        setWallpapers(items);
      }
      setLoading(false);
    });
  }, [slug]);

  if (collection === null) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Collection not found."
          description="This collection may have been unpublished or removed."
          action={
            <Link to="/collections">
              <Button variant="secondary">Back to collections</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden border-b border-white/10">
        {collection?.cover_image && (
          <>
            <img
              src={collection.cover_image}
              alt=""
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/85 to-void" />
          </>
        )}
        <div className="container-page relative py-16">
          <span className="glass mb-3 inline-block rounded-control px-3 py-1 text-xs font-medium uppercase tracking-wide text-purple-300">
            Collection
          </span>
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
            {collection?.name ?? "\u00A0"}
          </h1>
          {collection?.description && (
            <p className="mt-3 max-w-xl text-haze">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="container-page py-12">
        <WallpaperGrid wallpapers={wallpapers} loading={loading} skeletonCount={6} />
      </div>
    </div>
  );
}
