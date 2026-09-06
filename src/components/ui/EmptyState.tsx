import type { ReactNode } from "react";
import { MoonIcon } from "@/components/ui/Icons";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-card px-6 py-20 text-center">
      {icon ?? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface">
          <MoonIcon size={22} className="text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-haze">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
