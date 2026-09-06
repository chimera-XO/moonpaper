import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WallpaperForm } from "@/components/admin/WallpaperForm";
import { getCategories } from "@/services/categories.service";
import { getWallpaperById, updateWallpaper } from "@/services/wallpapers.service";
import type { Category, Wallpaper } from "@/types";
import { Spinner } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminWallpaperEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallpaper, setWallpaper] = useState<Wallpaper | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getCategories().then(setCategories);
    getWallpaperById(id).then(setWallpaper);
  }, [id]);

  if (wallpaper === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (wallpaper === null) {
    return <EmptyState title="Wallpaper not found." description="It may have already been deleted." />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-3xl font-bold text-ink">Edit wallpaper</h1>
      <p className="mb-8 text-sm text-haze">{wallpaper.title}</p>
      <WallpaperForm
        categories={categories}
        initial={wallpaper}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await updateWallpaper(wallpaper.id, input);
          navigate("/admin/wallpapers");
        }}
      />
    </div>
  );
}
