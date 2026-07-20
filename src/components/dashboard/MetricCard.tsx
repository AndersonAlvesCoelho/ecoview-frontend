import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, delta, trend = "flat", icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/8 text-primary">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs",
            trend === "up" && "text-emerald-600",
            trend === "down" && "text-red-600",
            trend === "flat" && "text-muted-foreground",
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
