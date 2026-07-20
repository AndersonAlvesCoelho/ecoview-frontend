import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Eye, Calendar, Database } from "lucide-react";
import { ThemeBadge } from "./ThemeBadge";
import { GeometryIcon, GEOMETRY_LABEL } from "./GeometryIcon";
import type { Dataset } from "@/types/dataset";
import { formatDate, formatNumber } from "@/lib/utils";

const SOURCE_COLOR: Record<string, string> = {
  IBGE: "#0d6efd",
  INPE: "#c2410c",
  ICMBio: "#0f766e",
  FUNAI: "#a86b2a",
  ANA: "#0369a1",
  MapBiomas: "#65a30d",
  INCRA: "#7c3aed",
};

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  const color = SOURCE_COLOR[dataset.source] ?? "#006633";
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div
        className="relative h-32 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, ${color}0d 50%, #f4f6f9 100%)`,
        }}
      >
        <svg viewBox="0 0 320 128" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id={`p-${dataset.slug}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0 L0 0 L0 24" fill="none" stroke={color} strokeOpacity="0.14" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="320" height="128" fill={`url(#p-${dataset.slug})`} />
          <path
            d="M40 80 C 80 60, 140 40, 200 55 C 250 68, 285 80, 300 96"
            fill="none"
            stroke={color}
            strokeOpacity="0.55"
            strokeWidth="1.6"
          />
          <path
            d="M60 100 L 100 76 L 150 88 L 200 62 L 260 84 L 300 72"
            fill="none"
            stroke={color}
            strokeOpacity="0.35"
            strokeDasharray="3 3"
          />
          {dataset.geometry === "point" &&
            Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                cx={40 + i * 34}
                cy={50 + ((i * 13) % 40)}
                r="2.4"
                fill={color}
                opacity="0.75"
              />
            ))}
        </svg>
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-card/95 px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          {dataset.source}
        </div>
        <div className="absolute right-3 top-3">
          <ThemeBadge theme={dataset.theme} label={dataset.themeLabel} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-tight text-foreground group-hover:text-primary">
          {dataset.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
          {dataset.description}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
              <GeometryIcon type={dataset.geometry} className="h-3 w-3 text-primary" />
              {GEOMETRY_LABEL[dataset.geometry]}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <dt className="text-muted-foreground">Versão</dt>
            <dd className="mt-0.5 font-medium text-foreground">{dataset.version}</dd>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <dt className="flex items-center gap-1 text-muted-foreground">
              <Database className="h-3 w-3" /> Features
            </dt>
            <dd className="mt-0.5 font-medium text-foreground tabular-nums">
              {formatNumber(dataset.features)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <dt className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" /> Atualizado
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">{formatDate(dataset.updatedAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <Link
            to="/"
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Eye className="h-3.5 w-3.5" />
            Visualizar
          </Link>
          <Link
            to="/catalogo/$slug"
            params={{ slug: dataset.slug }}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Detalhes
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
