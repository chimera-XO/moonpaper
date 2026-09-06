import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { useWallpapers } from "@/hooks/useWallpapers";
import { useDebounce } from "@/hooks/useDebounce";
import { getCategories } from "@/services/categories.service";
import { SearchIcon } from "@/components/ui/Icons";
import type { Category, DeviceType, WallpaperFilters } from "@/types";

export function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const filters: WallpaperFilters = {
    query: debouncedQuery || undefined,
    device_type: device,
    category,
    sort: "newest",
  };

  const { wallpapers, loading } = useWallpapers(filters);
  const relevantCategories = categories.filter((c) => !device || c.type === device || c.type === "both");

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Search</h1>
        <p className="mt-2 max-w-xl text-haze">
          Search by title, category, tag, device, or resolution.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try ultrawide, amoled, or space"
            className="w-full rounded-control border border-line bg-surface/80 py-3.5 pl-12 pr-5 text-base text-ink placeholder:text-muted backdrop-blur-sm focus:border-purple-400/70 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DevicePill label="All devices" active={!device} onClick={() => setDevice(undefined)} />
          <DevicePill label="Desktop" active={device === "pc"} onClick={() => setDevice("pc")} />
          <DevicePill label="Mobile" active={device === "mobile"} onClick={() => setDevice("mobile")} />
          <span className="mx-1 h-5 w-px bg-line" />
          <DevicePill label="All categories" active={!category} onClick={() => setCategory(undefined)} />
          {relevantCategories.map((c) => (
            <DevicePill
              key={c.id}
              label={c.name}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            />
          ))}
        </div>
      </div>

      <WallpaperGrid
        wallpapers={wallpapers}
        loading={loading}
        emptyTitle="No results."
        emptyDescription="Try a different search term or clear your filters."
      />
    </div>
  );
}

function DevicePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-control px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
        active ? "bg-purple-core text-white" : "glass text-haze hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
