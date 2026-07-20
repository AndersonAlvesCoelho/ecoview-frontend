import { cn } from "@/lib/utils";
import type { ThemeKey } from "@/types/dataset";

const THEME_COLORS: Record<ThemeKey, string> = {
  biomas: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  territorio: "bg-sky-100 text-sky-800 ring-sky-200",
  indigena: "bg-amber-100 text-amber-800 ring-amber-200",
  conservacao: "bg-teal-100 text-teal-800 ring-teal-200",
  clima: "bg-orange-100 text-orange-800 ring-orange-200",
  florestas: "bg-lime-100 text-lime-900 ring-lime-200",
  infraestrutura: "bg-slate-100 text-slate-800 ring-slate-200",
  agua: "bg-blue-100 text-blue-800 ring-blue-200",
  "uso-solo": "bg-yellow-100 text-yellow-900 ring-yellow-200",
};

interface ThemeBadgeProps {
  theme: ThemeKey;
  label: string;
  className?: string;
}

export function ThemeBadge({ theme, label, className }: ThemeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        THEME_COLORS[theme],
        className,
      )}
    >
      {label}
    </span>
  );
}
