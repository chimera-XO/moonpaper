import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MoonLaunch } from "@/components/layout/MoonLaunch";

import { Home } from "@/pages/Home";
import { PCWallpapers } from "@/pages/PCWallpapers";
import { MobileWallpapers } from "@/pages/MobileWallpapers";
import { Collections } from "@/pages/Collections";
import { CollectionDetail } from "@/pages/CollectionDetail";
import { WallpaperDetail } from "@/pages/WallpaperDetail";
import { Search } from "@/pages/Search";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { NotFound } from "@/pages/NotFound";

import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminWallpapers } from "@/pages/admin/AdminWallpapers";
import { AdminWallpaperNew } from "@/pages/admin/AdminWallpaperNew";
import { AdminWallpaperEdit } from "@/pages/admin/AdminWallpaperEdit";
import { AdminCollections } from "@/pages/admin/AdminCollections";
import { AdminCollectionNew } from "@/pages/admin/AdminCollectionNew";
import { AdminCollectionEdit } from "@/pages/admin/AdminCollectionEdit";

export default function App() {
  return (
    <BrowserRouter>
      <MoonLaunch />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/desktop" element={<PCWallpapers />} />
          <Route path="/mobile" element={<MobileWallpapers />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/wallpaper/:slug" element={<WallpaperDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="wallpapers" element={<AdminWallpapers />} />
          <Route path="wallpapers/new" element={<AdminWallpaperNew />} />
          <Route path="wallpapers/:id" element={<AdminWallpaperEdit />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="collections/new" element={<AdminCollectionNew />} />
          <Route path="collections/:id" element={<AdminCollectionEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
