import { sampleWallpapers } from "@/data/sampleWallpapers";
import { sampleCategories } from "@/data/sampleCategories";
import { sampleCollections } from "@/data/sampleCollections";
import type { Wallpaper, Category, Collection } from "@/types";

/**
 * A tiny in-memory "database" that mirrors the shape of the Supabase tables.
 * Only used when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are absent, so
 * the storefront and admin dashboard are fully explorable without a backend.
 * Changes made here live only for the current browser session.
 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export const localStore = {
  wallpapers: clone(sampleWallpapers) as Wallpaper[],
  categories: clone(sampleCategories) as Category[],
  collections: clone(sampleCollections) as Collection[],
};

export function simulateLatency<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
