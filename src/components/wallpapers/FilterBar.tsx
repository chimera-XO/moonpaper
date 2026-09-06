import type { Category, WallpaperFilters } from "@/types";
import { SearchIcon } from "@/components/ui/Icons";

interface FilterBarProps {
  categories: Category[];
  filters: WallpaperFilters;
  onChange: (next: WallpaperFilters) => void;
  showSearch?: boolean;
}

export function FilterBar({ categories, filters, onChange, showSearch = false }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {showSearch && (
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            value={filters.query ?? ""}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search wallpapers, tags, resolution"
            className="w-full rounded-control border border-line bg-surface/80 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted backdrop-blur-sm focus:border-purple-400/70 focus:outline-none"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange({ ...filters, category: undefined })}
          className={`rounded-control px-4 py-2 text-sm font-medium transition-colors ${
            !filters.category ? "bg-purple-core text-white" : "glass text-haze hover:text-ink"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange({ ...filters, category: category.slug })}
            className={`rounded-control px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filters.category === category.slug ? "bg-purple-core text-white" : "glass text-haze hover:text-ink"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <select
        value={filters.sort ?? "newest"}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as WallpaperFilters["sort"] })}
        className="ml-auto rounded-control border border-line bg-surface/80 px-4 py-2.5 text-sm text-ink backdrop-blur-sm focus:border-purple-400/70 focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most downloaded</option>
        <option value="title">A to Z</option>
      </select>
    </div>
  );
}
