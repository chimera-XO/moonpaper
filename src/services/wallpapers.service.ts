import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { localStore, simulateLatency, generateId, slugify } from "@/lib/localStore";
import type { Wallpaper, WallpaperFilters, WallpaperInput } from "@/types";

function applyFilters(list: Wallpaper[], filters: WallpaperFilters = {}): Wallpaper[] {
  let result = [...list];

  if (filters.publishedOnly !== false) {
    result = result.filter((w) => w.published);
  }
  if (filters.device_type) {
    result = result.filter((w) => w.device_type === filters.device_type);
  }
  if (filters.category) {
    result = result.filter((w) => w.category === filters.category);
  }
  if (filters.tags?.length) {
    result = result.filter((w) => filters.tags!.every((t) => w.tags.includes(t)));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)) ||
        w.device_type.toLowerCase().includes(q) ||
        w.resolution.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "popular":
      result.sort((a, b) => b.downloads - a.downloads);
      break;
    case "title":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

export async function getWallpapers(filters: WallpaperFilters = {}): Promise<Wallpaper[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("wallpapers").select("*");
    if (filters.publishedOnly !== false) query = query.eq("published", true);
    if (filters.device_type) query = query.eq("device_type", filters.device_type);
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.query) query = query.ilike("title", `%${filters.query}%`);
    const { data, error } = await query;
    if (error) throw error;
    return applyFilters((data ?? []) as Wallpaper[], { ...filters, query: undefined });
  }

  return simulateLatency(applyFilters(localStore.wallpapers, filters));
}

export async function getFeaturedWallpapers(limit = 8): Promise<Wallpaper[]> {
  const all = await getWallpapers({ sort: "newest" });
  return all.filter((w) => w.featured).slice(0, limit);
}

export async function getTrendingWallpapers(limit = 8): Promise<Wallpaper[]> {
  const all = await getWallpapers({ sort: "popular" });
  return all.slice(0, limit);
}

export async function getLatestWallpapers(limit = 8): Promise<Wallpaper[]> {
  const all = await getWallpapers({ sort: "newest" });
  return all.slice(0, limit);
}

export async function getWallpaperBySlug(slug: string): Promise<Wallpaper | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("wallpapers").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Wallpaper) ?? null;
  }
  const found = localStore.wallpapers.find((w) => w.slug === slug) ?? null;
  return simulateLatency(found, 150);
}

export async function getWallpaperById(id: string): Promise<Wallpaper | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("wallpapers").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as Wallpaper) ?? null;
  }
  const found = localStore.wallpapers.find((w) => w.id === id) ?? null;
  return simulateLatency(found, 100);
}

export async function getRelatedWallpapers(wallpaper: Wallpaper, limit = 6): Promise<Wallpaper[]> {
  const pool = await getWallpapers({ device_type: wallpaper.device_type });
  return pool
    .filter((w) => w.id !== wallpaper.id)
    .sort((a, b) => {
      const aScore = a.category === wallpaper.category ? 1 : 0;
      const bScore = b.category === wallpaper.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export async function incrementDownloadCount(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.rpc("increment_wallpaper_downloads", { wallpaper_id: id });
    return;
  }
  const item = localStore.wallpapers.find((w) => w.id === id);
  if (item) item.downloads += 1;
}

// ---- Admin operations ----

export async function createWallpaper(input: WallpaperInput): Promise<Wallpaper> {
  const slug = input.slug || slugify(input.title);

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("wallpapers")
      .insert({ ...input, slug })
      .select()
      .single();
    if (error) throw error;
    return data as Wallpaper;
  }

  const now = new Date().toISOString();
  const payload: Wallpaper = {
    ...input,
    id: generateId("wp"),
    slug,
    downloads: 0,
    created_at: now,
    updated_at: now,
  };
  localStore.wallpapers.unshift(payload);
  return simulateLatency(payload, 300);
}

export async function updateWallpaper(id: string, input: Partial<WallpaperInput>): Promise<Wallpaper> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("wallpapers")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Wallpaper;
  }

  const index = localStore.wallpapers.findIndex((w) => w.id === id);
  if (index === -1) throw new Error("Wallpaper not found");
  localStore.wallpapers[index] = {
    ...localStore.wallpapers[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  return simulateLatency(localStore.wallpapers[index], 300);
}

export async function deleteWallpaper(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("wallpapers").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  localStore.wallpapers = localStore.wallpapers.filter((w) => w.id !== id);
  await simulateLatency(null, 200);
}
