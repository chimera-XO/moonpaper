import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WallpaperForm } from "@/components/admin/WallpaperForm";
import { getCategories } from "@/services/categories.service";
import { createWallpaper } from "@/services/wallpapers.service";
import type { Category } from "@/types";

export function AdminWallpaperNew() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-3xl font-bold text-ink">Add wallpaper</h1>
      <p className="mb-8 text-sm text-haze">Add a new wallpaper to the archive.</p>
      <WallpaperForm
        categories={categories}
        submitLabel="Add wallpaper"
        onSubmit={async (input) => {
          await createWallpaper(input);
          navigate("/admin/wallpapers");
        }}
      />
    </div>
  );
}
