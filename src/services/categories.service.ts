import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { localStore, simulateLatency } from "@/lib/localStore";
import type { Category, DeviceType } from "@/types";

export async function getCategories(type?: DeviceType): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("categories").select("*");
    const { data, error } = await query;
    if (error) throw error;
    let list = (data ?? []) as Category[];
    if (type) list = list.filter((c) => c.type === type || c.type === "both");
    return list;
  }

  let list = localStore.categories;
  if (type) list = list.filter((c) => c.type === type || c.type === "both");
  return simulateLatency(list, 120);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const list = await getCategories();
  return list.find((c) => c.slug === slug) ?? null;
}
