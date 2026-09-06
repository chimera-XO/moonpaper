import { Link } from "react-router-dom";
import type { Collection } from "@/types";
import { WallpaperImage } from "@/components/ui/WallpaperImage";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group glass relative block overflow-hidden rounded-card transition-colors duration-300 hover:border-purple-400/40"
    >
      <WallpaperImage
        src={collection.cover_image}
        alt={collection.name}
        aspect="wide"
        className="rounded-none"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-display text-xl font-semibold text-ink">{collection.name}</p>
        <p className="mt-1 text-xs text-haze">{collection.wallpaper_ids.length} wallpapers</p>
      </div>
      <div className="absolute right-4 top-4 rounded-control border border-white/15 bg-void/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-purple-300 backdrop-blur">
        Collection
      </div>
    </Link>
  );
}
