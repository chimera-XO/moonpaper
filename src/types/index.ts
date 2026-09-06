export type DeviceType = "pc" | "mobile";

export interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  download_url: string;
  device_type: DeviceType;
  category: string; // category slug
  resolution: string;
  aspect_ratio: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export type CategoryType = DeviceType | "both";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description: string;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  published: boolean;
  created_at: string;
  wallpaper_ids: string[];
}

export interface WallpaperFilters {
  device_type?: DeviceType;
  category?: string;
  query?: string;
  tags?: string[];
  sort?: "newest" | "popular" | "title";
  publishedOnly?: boolean;
}

export type WallpaperInput = Omit<Wallpaper, "id" | "created_at" | "updated_at" | "downloads">;
export type CollectionInput = Omit<Collection, "id" | "created_at">;
