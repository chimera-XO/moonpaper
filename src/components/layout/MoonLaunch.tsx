import { useEffect, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/ui/BrandMark";

const SESSION_KEY = "moonpaper_intro_seen";

export function MoonLaunch() {
  const [phase, setPhase] = useState<"hidden" | "playing" | "leaving">("hidden");

  useEffect(() => {
    const alreadySeen = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadySeen) return;

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setPhase("playing");
    document.body.style.overflow = "hidden";

    const playMs = prefersReducedMotion ? 250 : 1500;
    const leaveMs = prefersReducedMotion ? 200 : 450;

    const leaveTimer = setTimeout(() => setPhase("leaving"), playMs);
    const doneTimer = setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
      sessionStorage.setItem(SESSION_KEY, "1");
    }, playMs + leaveMs);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void transition-opacity duration-[450ms] ease-out motion-reduce:transition-opacity motion-reduce:duration-200 ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient purple atmosphere */}
      <div className="absolute inset-0 bg-glow-purple opacity-0 motion-safe:animate-moonGlowPulse motion-reduce:opacity-40" />

      {/* Rising moon */}
      <div className="relative flex flex-col items-center">
        <div className="relative h-28 w-28 translate-y-0 opacity-100 motion-safe:animate-moonRise sm:h-36 sm:w-36">
          <div className="absolute -inset-8 rounded-full bg-glow-soft blur-2xl" />
          <div className="relative h-full w-full rounded-full bg-moon-surface shadow-glow" />
        </div>

        <div className="mt-7 flex translate-y-2 items-center gap-2 opacity-0 motion-safe:animate-brandReveal motion-reduce:translate-y-0 motion-reduce:opacity-100">
          <BrandMark size={22} />
          <BrandWordmark className="text-base" />
        </div>
      </div>
    </div>
  );
}
