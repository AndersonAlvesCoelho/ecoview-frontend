import { Download, Maximize2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className, footer }: ChartCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div>
          <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toast("Download PNG", { description: "Exportação simulada." })}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Baixar como PNG"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => toast("Tela cheia", { description: "Modo fullscreen indisponível no mock." })}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Tela cheia"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="flex-1 p-4">{children}</div>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </section>
  );
}
