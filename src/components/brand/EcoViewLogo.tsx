import { cn } from "@/lib/utils";

interface EcoViewLogoProps {
  className?: string;
  showText?: boolean;
}

export function EcoViewLogo({ className, showText = true }: EcoViewLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="eco-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#006633" />
            <stop offset="100%" stopColor="#669933" />
          </linearGradient>
        </defs>
        {/* Rounded map tile */}
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#eco-leaf)" />
        {/* Grid lines */}
        <path
          d="M2 14 H38 M2 26 H38 M14 2 V38 M26 2 V38"
          stroke="#ffffff"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        {/* Leaf */}
        <path
          d="M12 26 C 12 16, 20 10, 30 10 C 30 20, 24 28, 14 28 Z"
          fill="#ffffff"
        />
        <path
          d="M14 28 C 18 22, 24 16, 30 10"
          stroke="#006633"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
            EcoView
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Inteligência Geoespacial
          </span>
        </div>
      )}
    </div>
  );
}
