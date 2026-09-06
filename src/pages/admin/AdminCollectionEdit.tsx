import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getWallpapers } from "@/services/wallpapers.service";
import { getCollections, updateCollection } from "@/services/collections.service";
import type { Collection, Wallpaper } from "@/types";
import { Spinner } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminCollectionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [collection, setCollection] = useState<Collection | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getWallpapers({ publishedOnly: false, sort: "newest" }).then(setWallpapers);
    getCollections(false).then((all) => {
      setCollection(all.find((c) => c.id === id) ?? null);
    });
  }, [id]);

  if (collection === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (collection === null) {
    return <EmptyState title="Collection not found." description="It may have already been deleted." />;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 font-display text-3xl font-bold text-ink">Edit collection</h1>
      <p className="mb-8 text-sm text-haze">{collection.name}</p>
      <CollectionForm
        wallpapers={wallpapers}
        initial={collection}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await updateCollection(collection.id, input);
          navigate("/admin/collections");
        }}
      />
    </div>
  );
}
