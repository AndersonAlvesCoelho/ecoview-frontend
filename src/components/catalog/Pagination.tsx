import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, pageCount, onPage }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginação">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={page === p ? "page" : undefined}
          className={cn(
            "grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-medium transition-colors",
            page === p
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:bg-muted",
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
