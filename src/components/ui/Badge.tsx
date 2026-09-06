import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "emphasis" }) {
  const toneClass =
    tone === "emphasis"
      ? "bg-purple-core/20 text-purple-glow border-purple-400/40"
      : "glass text-haze";
  return (
    <span className={`inline-flex items-center rounded-control px-2.5 py-1 text-[11px] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}
