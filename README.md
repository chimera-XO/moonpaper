# MOONpaper

A premium 4K wallpaper platform for desktop and mobile: curated collections, search,
filtering, and an admin dashboard for managing the archive.

Built with React, TypeScript, Vite, Tailwind CSS, React Router, and Supabase.

> **Demo mode built in.** The app runs immediately with `npm install && npm run dev`,
> no backend required. Without Supabase credentials it falls back to an in-memory sample
> dataset (10 desktop + 10 mobile wallpapers, 11 categories, 8 collections), so you can
> browse the whole site and try the admin dashboard before connecting a real database.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Run locally (demo mode, no setup required)

```bash
npm run dev
```

Visit `http://localhost:5173`. The storefront works fully. To preview the admin
dashboard in demo mode, add one line to a `.env` file:

```bash
cp .env.example .env
# then set:
VITE_ADMIN_DEMO_PASSWORD=choose-a-password
```

Go to `/admin`, sign in with any email and that password. Changes made in demo mode
(adding/editing/deleting wallpapers or collections) are stored in memory only and reset
on page reload: connect Supabase (below) for changes that persist.

## 3. Connect a real backend with Supabase

### 3a. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL** and the **anon/public key**.

### 3b. Create the database tables

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates:
   - `wallpapers`, `categories`, `collections`, `collection_wallpapers` tables
   - a `downloads` counter function
   - Row Level Security policies: anyone can read published content, only signed-in
     (authenticated) users can create/edit/delete

### 3c. Create storage buckets

In **Storage**, create three buckets:

| Bucket | Purpose | Public |
|---|---|---|
| `wallpaper-previews` | Thumbnail/preview images shown in the gallery | Yes |
| `wallpaper-originals` | Full-resolution downloadable files | Yes (or signed URLs if you want gated downloads) |
| `collection-covers` | Cover images for collections | Yes |

Upload files through the Supabase dashboard (or wire up `supabase.storage` calls in
`src/services` later), then paste the resulting public URLs into the admin forms'
**Image URL** / **Download URL** fields when adding wallpapers.

### 3d. Add environment variables

```bash
cp .env.example .env
```

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart `npm run dev` after editing `.env`. The app automatically switches from the
in-memory sample data to live Supabase queries once both variables are present.

### 3e. Admin authentication

This project treats **any signed-in Supabase Auth user as an admin**: there's no public
sign-up flow. Create your own admin account manually:

1. In Supabase, go to **Authentication → Users → Add user**.
2. Create yourself an email + password.
3. Sign in at `/admin/login` on the site with those credentials.

`VITE_ADMIN_DEMO_PASSWORD` is ignored automatically once Supabase is configured, so it's
safe to leave unset in production.

## 4. Run locally

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
```

This runs a TypeScript check followed by the Vite production build, output to `dist/`.

```bash
npm run preview   # preview the production build locally
```

## 6. Deploy to Vercel

1. Push this repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Add the same environment variables from your `.env` (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in **Project Settings → Environment Variables**.
5. Deploy. `vercel.json` is already configured to rewrite all routes to `index.html`,
   so client-side routes (`/desktop`, `/wallpaper/:slug`, `/admin`, etc.) won't 404 on
   refresh.

---

## Project structure

```
src/
  components/     Reusable UI, wallpaper, collection, layout, and admin components
  data/           Sample dataset used as the local-mode fallback
  hooks/          useWallpapers, useCollections, useAuth, useDebounce
  layouts/        MainLayout (storefront) and AdminLayout (dashboard)
  lib/            Supabase client + in-memory local store
  pages/          Route-level pages, including pages/admin/
  services/       Data access layer: Supabase-backed with local fallback
  types/          Shared TypeScript types
supabase/
  schema.sql      Full database schema + RLS policies
```

## How the local/Supabase fallback works

Every function in `src/services/*.service.ts` checks `isSupabaseConfigured`
(`src/lib/supabase.ts`). If Supabase credentials are present, it queries Supabase
directly. If not, it reads/writes an in-memory store (`src/lib/localStore.ts`) seeded
from `src/data/`. This means:

- The site is fully browsable with zero configuration.
- The admin dashboard is fully clickable in demo mode (add/edit/delete/publish/feature),
  useful for previewing UI before wiring up a real database.
- Swapping in Supabase requires no code changes: just environment variables.

## Design system

The interface uses a purple and white only palette (see `tailwind.config.ts`) with a
glassmorphism treatment applied through shared utility classes in `src/index.css`:
`.glass`, `.glass-strong`, and `.glass-surface-purple`. Buttons and controls use
rectangular proportions with subtly rounded corners rather than pill shapes.

On first load, `src/components/layout/MoonLaunch.tsx` plays a short CSS-driven moon
rising intro (once per browser session, tracked in sessionStorage). It fully respects
`prefers-reduced-motion`, showing a fast simplified fade instead of the full animation.

Wallpaper previews render through `src/components/ui/WallpaperImage.tsx`, which always
reserves a fixed aspect ratio (fixing a previous bug where landscape previews could
collapse to zero height and appear blank), retries a failed load once, and falls back to
an on-brand placeholder instead of a broken image icon.

## Notes

- Sample wallpaper imagery uses picsum.photos placeholders. Replace with real uploads
  via the admin dashboard once Supabase Storage is connected.
- The brand name **MOONpaper** and all visual identity here are original: inspired by,
  but not copied from, MoonPay's brand assets.
