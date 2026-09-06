import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { getFeaturedWallpapers, getTrendingWallpapers, getLatestWallpapers } from "@/services/wallpapers.service";
import { getCategories } from "@/services/categories.service";
import { getCollections } from "@/services/collections.service";
import type { Category, Collection, Wallpaper } from "@/types";

const heroTiles = [
  { seed: "lunar-eclipse", rotate: "-rotate-3", size: "w-40 h-52", top: "top-2", left: "left-0" },
  { seed: "neon-grid", rotate: "rotate-2", size: "w-44 h-32", top: "top-0", left: "left-40" },
  { seed: "token-field", rotate: "-rotate-2", size: "w-36 h-48", top: "top-40", left: "left-4" },
  { seed: "chaos-render", rotate: "rotate-3", size: "w-48 h-32", top: "top-56", left: "left-44" },
  { seed: "cosmic-vein", rotate: "rotate-1", size: "w-32 h-56", top: "top-6", left: "left-[19rem]" },
];

export function Home() {
  const [featured, setFeatured] = useState<Wallpaper[]>([]);
  const [trending, setTrending] = useState<Wallpaper[]>([]);
  const [latest, setLatest] = useState<Wallpaper[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedWallpapers(8),
      getTrendingWallpapers(8),
      getLatestWallpapers(8),
      getCategories(),
      getCollections(),
    ]).then(([f, t, l, c, col]) => {
      setFeatured(f);
      setTrending(t);
      setLatest(l);
      setCategories(c);
      setCollections(col.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div className="relative z-10">
            <span className="glass mb-6 inline-flex items-center gap-2 rounded-control px-3.5 py-1.5 text-xs font-medium text-haze">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-core" /> New drops every week
            </span>
            <h1 className="font-display text-5xl font-bold leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
              YOUR SCREEN.
              <br />
              YOUR WORLD.
            </h1>
            <p className="mt-6 max-w-md text-balance text-lg text-haze">
              4K wallpapers for desktop and mobile, curated in one archive. Built for screens that deserve
              better than a stretched stock photo.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/desktop">
                <Button size="md">Explore Desktop</Button>
              </Link>
              <Link to="/mobile">
                <Button size="md" variant="secondary">
                  Explore Mobile
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[26rem] lg:block">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-glow-purple blur-2xl" />
            {heroTiles.map((tile, i) => (
              <img
                key={tile.seed}
                src={`https://picsum.photos/seed/${tile.seed}/400/500`}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className={`absolute ${tile.top} ${tile.left} ${tile.size} ${tile.rotate} rounded-card border border-white/10 object-cover shadow-card ${
                  i === 0 ? "animate-drift" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-20 py-16">
        {/* Featured */}
        <Section title="Featured wallpapers" description="Hand-picked from the current archive." to="/desktop">
          <WallpaperGrid wallpapers={featured} loading={loading} skeletonCount={8} />
        </Section>

        {/* Popular categories */}
        <section>
          <SectionHeading title="Popular categories" description="Jump straight to a look you're after." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/${category.type === "mobile" ? "mobile" : "desktop"}?category=${category.slug}`}
                className="glass group flex flex-col items-center justify-center gap-2 rounded-card px-4 py-7 text-center transition-colors hover:border-purple-400/50"
              >
                <span className="font-display text-base font-semibold text-ink capitalize">
                  {category.name}
                </span>
                <span className="text-xs text-muted">{category.type === "both" ? "All devices" : category.type}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending */}
        <Section title="Trending wallpapers" description="What everyone's downloading right now." to="/mobile">
          <WallpaperGrid wallpapers={trending} loading={loading} skeletonCount={8} />
        </Section>

        {/* Collections */}
        <section>
          <SectionHeading title="Featured collections" description="Wallpapers grouped by mood and theme." to="/collections" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        {/* Latest */}
        <Section title="Latest wallpapers" description="Freshly added to the archive." to="/desktop">
          <WallpaperGrid wallpapers={latest} loading={loading} skeletonCount={8} />
        </Section>

        {/* CTA */}
        <section className="glass relative overflow-hidden rounded-card px-8 py-16 text-center">
          <div className="absolute inset-0 bg-glow-purple opacity-40" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Find your next wallpaper</h2>
            <p className="mx-auto mt-3 max-w-md text-haze">
              Browse the full archive across desktop and mobile, or search by resolution, tag, or device.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/search">
                <Button>Search the archive</Button>
              </Link>
              <Link to="/collections">
                <Button variant="secondary">Browse collections</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ title, description, to }: { title: string; description: string; to?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-haze">{description}</p>
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 text-sm font-medium text-purple-300 hover:text-white sm:inline">
          View all
        </Link>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  to,
  children,
}: {
  title: string;
  description: string;
  to: string;
  children: ReactNode;
}) {
  return (
    <section>
      <SectionHeading title={title} description={description} to={to} />
      {children}
    </section>
  );
}
