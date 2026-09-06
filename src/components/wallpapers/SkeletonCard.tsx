import { SkeletonBlock } from "@/components/ui/Loader";

export function SkeletonCard({ portrait = false }: { portrait?: boolean }) {
  return <SkeletonBlock className={portrait ? "aspect-[9/16]" : "aspect-[16/9]"} />;
}
