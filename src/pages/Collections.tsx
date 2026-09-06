import { useCollections } from "@/hooks/useCollections";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/Loader";

export function Collections() {
  const { collections, loading } = useCollections();

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Collections</h1>
        <p className="mt-2 max-w-xl text-haze">
          Wallpapers curated by mood and theme: Lunar, After Dark, Digital Chaos, and more.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBlock key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : collections.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing here yet." description="New collections are landing soon." />
      )}
    </div>
  );
}
