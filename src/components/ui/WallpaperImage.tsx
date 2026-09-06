import { useEffect, useState } from "react";
import { ImageOffIcon } from "@/components/ui/Icons";

interface WallpaperImageProps {
  src: string;
  alt: string;
  aspect: "landscape" | "portrait" | "square" | "wide";
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

const aspectClass: Record<WallpaperImageProps["aspect"], string> = {
  landscape: "aspect-[16/9]",
  portrait: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

/**
 * Wraps every wallpaper preview with a fixed aspect-ratio container so the
 * image always has real dimensions to render into (a collapsed-height
 * wrapper was the root cause of previews rendering as blank/"unavailable").
 * On a load failure it retries once with a cache-busting param (covers
 * transient network/rate-limit failures from the placeholder image host),
 * then falls back to an on-brand placeholder instead of a broken icon.
 */
export function WallpaperImage({ src, alt, aspect, className = "", imgClassName = "", loading = "lazy" }: WallpaperImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    setLoaded(false);
  }, [src]);

  function handleError() {
    if (attempt < 1) {
      setAttempt((a) => a + 1);
    } else {
      setFailed(true);
    }
  }

  const resolvedSrc = attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    <div className={`relative overflow-hidden bg-surface2 ${aspectClass[aspect]} ${className}`}>
      {!failed && (
        <img
          key={`${src}-${attempt}`}
          src={resolvedSrc}
          alt={alt}
          loading={loading}
          onError={handleError}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        />
      )}

      {(!loaded || failed) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-900/70 via-elevated to-void transition-opacity duration-300 ${
            failed ? "opacity-100" : loaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse"
          }`}
        >
          {failed && (
            <>
              <ImageOffIcon size={26} className="text-purple-300/70" />
              <span className="text-xs text-haze">Preview unavailable</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
