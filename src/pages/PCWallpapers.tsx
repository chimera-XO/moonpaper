import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { FilterBar } from "@/components/wallpapers/FilterBar";
import { useWallpapers } from "@/hooks/useWallpapers";
import { getCategories } from "@/services/categories.service";
import type { Category, WallpaperFilters } from "@/types";

export function PCWallpapers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<WallpaperFilters>({
    device_type: "pc",
    category: searchParams.get("category") ?? undefined,
    sort: "newest",
  });

  useEffect(() => {
    getCategories("pc").then(setCategories);
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.category) next.set("category", filters.category);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category]);

  const { wallpapers, loading } = useWallpapers(filters);

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Desktop wallpapers</h1>
        <p className="mt-2 max-w-xl text-haze">
          4K, ultrawide, and dual-monitor wallpapers built for large displays.
        </p>
      </div>

      <div className="mb-8">
        <FilterBar categories={categories} filters={filters} onChange={setFilters} />
      </div>

      <WallpaperGrid
        wallpapers={wallpapers}
        loading={loading}
        emptyTitle="Nothing here yet."
        emptyDescription="New desktop wallpapers are landing soon, try a different category."
      />
    </div>
  );
}
