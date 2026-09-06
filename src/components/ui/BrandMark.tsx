interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className = "" }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="MOONpaper"
    >
      <rect width="32" height="32" rx="9" fill="#7C4DFF" />
      <circle cx="14" cy="18" r="7.5" fill="#FFFFFF" />
      <circle cx="23" cy="10.5" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight text-ink ${className}`}>
      MOON<span className="text-purple-300">paper</span>
    </span>
  );
}
