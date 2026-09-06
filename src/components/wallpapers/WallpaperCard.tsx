import { Link } from "react-router-dom";
import type { MouseEvent } from "react";

import type { Wallpaper } from "@/types";

import { WallpaperImage } from "@/components/ui/WallpaperImage";
import { EyeIcon, DownloadIcon } from "@/components/ui/Icons";

export function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  const isPortrait = wallpaper.device_type === "mobile";

  const handleDownload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(wallpaper.download_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${wallpaper.slug || wallpaper.title}.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(wallpaper.download_url, "_blank");
    }
  };

  return (
    <Link
      to={`/wallpaper/${wallpaper.slug}`}
      className="group glass relative block overflow-hidden rounded-card transition-colors duration-300 hover:border-purple-400/40"
    >
      <WallpaperImage
        src={wallpaper.image_url}
        alt={wallpaper.title}
        aspect={isPortrait ? "portrait" : "landscape"}
        className="rounded-none"
        imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/95 via-void/15 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">
              {wallpaper.title}
            </p>

            <p className="mt-0.5 text-xs text-haze">
              {wallpaper.resolution} &middot;{" "}
              {wallpaper.device_type === "pc" ? "Desktop" : "Mobile"}
            </p>
          </div>

          <span className="shrink-0 rounded-control border border-white/15 bg-void/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-haze backdrop-blur">
            {wallpaper.category.replace("-", " ")}
          </span>
        </div>

        <div className="flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="glass-strong flex flex-1 items-center justify-center gap-1.5 rounded-control py-2 text-center text-xs font-semibold text-ink">
            <EyeIcon size={13} /> View
          </span>

          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-control bg-purple-core py-2 text-center text-xs font-semibold text-white"
          >
            <DownloadIcon size={13} /> Download
          </button>
        </div>
      </div>
    </Link>
  );
}
