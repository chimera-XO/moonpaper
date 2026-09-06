import { useEffect, useState } from "react";
import { getWallpapers } from "@/services/wallpapers.service";
import type { Wallpaper, WallpaperFilters } from "@/types";

export function useWallpapers(filters: WallpaperFilters) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getWallpapers(filters)
      .then((data) => {
        if (!cancelled) setWallpapers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { wallpapers, loading, error };
}
