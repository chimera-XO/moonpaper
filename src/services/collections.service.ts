import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { localStore, simulateLatency, generateId, slugify } from "@/lib/localStore";
import type { Collection, CollectionInput, Wallpaper } from "@/types";
import { getWallpaperById } from "@/services/wallpapers.service";

export async function getCollections(publishedOnly = true): Promise<Collection[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("collections").select("*, collection_wallpapers(wallpaper_id)");
    if (publishedOnly) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      ...row,
      wallpaper_ids: (row.collection_wallpapers ?? []).map((r: any) => r.wallpaper_id),
    })) as Collection[];
  }

  const list = publishedOnly ? localStore.collections.filter((c) => c.published) : localStore.collections;
  return simulateLatency(list, 180);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("collections")
      .select("*, collection_wallpapers(wallpaper_id)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...(data as any),
      wallpaper_ids: ((data as any).collection_wallpapers ?? []).map((r: any) => r.wallpaper_id),
    } as Collection;
  }

  const found = localStore.collections.find((c) => c.slug === slug) ?? null;
  return simulateLatency(found, 150);
}

export async function getCollectionWallpapers(collection: Collection): Promise<Wallpaper[]> {
  const results = await Promise.all(collection.wallpaper_ids.map((id) => getWallpaperById(id)));
  return results.filter((w): w is Wallpaper => Boolean(w));
}

// ---- Admin operations ----

export async function createCollection(input: CollectionInput): Promise<Collection> {
  const payload: Collection = {
    ...input,
    id: generateId("col"),
    slug: input.slug || slugify(input.name),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { wallpaper_ids, ...collectionRow } = payload;
    const { data, error } = await supabase.from("collections").insert(collectionRow).select().single();
    if (error) throw error;
    if (wallpaper_ids.length) {
      await supabase
        .from("collection_wallpapers")
        .insert(wallpaper_ids.map((wallpaper_id) => ({ collection_id: data.id, wallpaper_id })));
    }
    return { ...(data as Collection), wallpaper_ids };
  }

  localStore.collections.unshift(payload);
  return simulateLatency(payload, 300);
}

export async function updateCollection(id: string, input: Partial<CollectionInput>): Promise<Collection> {
  if (isSupabaseConfigured && supabase) {
    const { wallpaper_ids, ...rest } = input;
    const { data, error } = await supabase.from("collections").update(rest).eq("id", id).select().single();
    if (error) throw error;
    if (wallpaper_ids) {
      await supabase.from("collection_wallpapers").delete().eq("collection_id", id);
      if (wallpaper_ids.length) {
        await supabase
          .from("collection_wallpapers")
          .insert(wallpaper_ids.map((wallpaper_id) => ({ collection_id: id, wallpaper_id })));
      }
    }
    return { ...(data as Collection), wallpaper_ids: wallpaper_ids ?? [] };
  }

  const index = localStore.collections.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Collection not found");
  localStore.collections[index] = { ...localStore.collections[index], ...input };
  return simulateLatency(localStore.collections[index], 300);
}

export async function deleteCollection(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("collection_wallpapers").delete().eq("collection_id", id);
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  localStore.collections = localStore.collections.filter((c) => c.id !== id);
  await simulateLatency(null, 200);
}
