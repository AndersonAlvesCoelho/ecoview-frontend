import { useThemes } from "@/hooks/use-themes";
import { cn } from "@/lib/utils";
import type { GeometryType, SourceKey } from "@/types/dataset";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";

// ── Constantes locais (não mudam) ────────────────────────────

export const UF_LIST = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

const GEOMETRIES: { value: GeometryType; label: string }[] = [
  { value: "polygon", label: "Polígonos" },
  { value: "line", label: "Linhas" },
  { value: "point", label: "Pontos" },
  { value: "raster", label: "Raster" },
];

const SOURCES: SourceKey[] = ["IBGE", "INPE", "ICMBio", "FUNAI", "ANA", "MapBiomas", "INCRA"];

export const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "az", label: "A → Z" },
  { value: "features", label: "Mais features" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

// ── Tipos ─────────────────────────────────────────────────────

export interface CatalogFilters {
  query: string;
  themes: string[]; // codes da API: "meio_ambiente", "limites", etc.
  geometries: GeometryType[];
  sources: SourceKey[];
  uf: string;
  sort: SortKey;
}

export const emptyFilters: CatalogFilters = {
  query: "",
  themes: [],
  geometries: [],
  sources: [],
  uf: "",
  sort: "recent",
};

// ── Componente ────────────────────────────────────────────────

interface FilterBarProps {
  filters: CatalogFilters;
  onChange: (f: CatalogFilters) => void;
  resultCount: number;
}

export function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const { data: themes, isLoading: loadingThemes } = useThemes();

  const toggle = <T,>(list: T[], v: T): T[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const activeChipCount =
    filters.themes.length +
    filters.geometries.length +
    filters.sources.length +
    (filters.uf ? 1 : 0);

  // Monta os itens de tema a partir da API
  const themeItems = loadingThemes
    ? []
    : (themes ?? []).map((t) => ({ value: t.code, label: t.name }));

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Buscar datasets, palavras-chave, fontes…"
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Buscar no catálogo"
          />
        </div>

        <select
          value={filters.uf}
          onChange={(e) => onChange({ ...filters, uf: e.target.value })}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Filtrar por UF"
        >
          <option value="">Todas as UFs</option>
          {UF_LIST.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        <div className="relative">
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
            className="h-11 w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-8 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 md:w-56"
            aria-label="Ordenar"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <ChipRow
          label="Tema"
          items={themeItems}
          selected={filters.themes}
          loading={loadingThemes}
          onToggle={(v) => onChange({ ...filters, themes: toggle(filters.themes, v) })}
        />
        <ChipRow
          label="Geometria"
          items={GEOMETRIES}
          selected={filters.geometries}
          onToggle={(v) => onChange({ ...filters, geometries: toggle(filters.geometries, v) })}
        />
        <ChipRow
          label="Fonte"
          items={SOURCES.map((s) => ({ value: s, label: s }))}
          selected={filters.sources}
          onToggle={(v) => onChange({ ...filters, sources: toggle(filters.sources, v) })}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{resultCount}</span> datasets encontrados
          {activeChipCount > 0 && (
            <span>
              · {activeChipCount} filtro{activeChipCount > 1 ? "s" : ""} ativo
              {activeChipCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {activeChipCount > 0 && (
          <button
            onClick={() => onChange({ ...emptyFilters, query: filters.query, sort: filters.sort })}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
          >
            <X className="h-3 w-3" /> Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}

// ── ChipRow ───────────────────────────────────────────────────

interface ChipRowProps<T extends string> {
  label: string;
  items: { value: T; label: string }[];
  selected: T[];
  loading?: boolean;
  onToggle: (v: T) => void;
}

function ChipRow<T extends string>({ label, items, selected, loading, onToggle }: ChipRowProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {loading ? (
          <span className="text-[11px] text-muted-foreground">Carregando...</span>
        ) : (
          items.map((item) => {
            const active = selected.includes(item.value);
            return (
              <button
                key={item.value}
                onClick={() => onToggle(item.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5",
                )}
              >
                {item.label}
                {active && <X className="h-3 w-3" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
