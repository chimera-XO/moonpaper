import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getWallpapers } from "@/services/wallpapers.service";
import { createCollection } from "@/services/collections.service";
import type { Wallpaper } from "@/types";
import { Spinner } from "@/components/ui/Loader";

export function AdminCollectionNew() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getWallpapers({ publishedOnly: false, sort: "newest" }).then((data) => {
      setWallpapers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 font-display text-3xl font-bold text-ink">New collection</h1>
      <p className="mb-8 text-sm text-haze">Group wallpapers into a themed collection.</p>
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : (
        <CollectionForm
          wallpapers={wallpapers}
          submitLabel="Create collection"
          onSubmit={async (input) => {
            await createCollection(input);
            navigate("/admin/collections");
          }}
        />
      )}
    </div>
  );
}
