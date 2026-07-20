import type { DatasetVersion } from "@/types/dataset";
import { formatDate } from "@/lib/utils";

export function VersionTimeline({ history }: { history: DatasetVersion[] }) {
  return (
    <ol className="relative border-l-2 border-border pl-5">
      {history.map((v, i) => (
        <li key={v.version} className="relative pb-6 last:pb-0">
          <span
            className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full bg-card ring-2 ring-primary"
            aria-hidden="true"
          >
            {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </span>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              v{v.version}
            </span>
            <time className="text-xs text-muted-foreground">{formatDate(v.date)}</time>
          </div>
          <p className="mt-1.5 text-sm text-foreground">{v.changes}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">por {v.author}</p>
        </li>
      ))}
    </ol>
  );
}
