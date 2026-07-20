import { datasets, UF_LIST } from "@/mock/datasets";
import { Calendar, Filter } from "lucide-react";
import { toast } from "sonner";

const FIELDS = ["area_km2", "features", "ano", "uf", "bioma"];
const OPERATORS = [
  { value: "eq", label: "= igual" },
  { value: "gt", label: "> maior que" },
  { value: "lt", label: "< menor que" },
  { value: "in", label: "∈ contém" },
  { value: "like", label: "~ semelhante a" },
];

export interface DashboardFilters {
  primary: string;
  secondary: string;
  operator: string;
  field: string;
  value: string;
  uf: string;
  period: string;
}

export const defaultFilters: DashboardFilters = {
  primary: "desmatamento-prodes",
  secondary: "focos-queimadas",
  operator: "gt",
  field: "area_km2",
  value: "100",
  uf: "",
  period: "2019-2024",
};

interface DynamicFilterProps {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
  onApply: () => void;
}

export function DynamicFilter({ filters, onChange, onApply }: DynamicFilterProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/8 text-primary">
          <Filter className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
            Filtros Dinâmicos
          </h2>
          <p className="text-xs text-muted-foreground">
            Combine datasets, operadores e recortes territoriais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Dataset principal">
          <select
            value={filters.primary}
            onChange={(e) => onChange({ ...filters, primary: e.target.value })}
            className={selectCls}
          >
            {datasets.map((d) => (
              <option key={d.slug} value={d.slug}>{d.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Dataset secundário">
          <select
            value={filters.secondary}
            onChange={(e) => onChange({ ...filters, secondary: e.target.value })}
            className={selectCls}
          >
            <option value="">— nenhum —</option>
            {datasets.map((d) => (
              <option key={d.slug} value={d.slug}>{d.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Campo">
          <select
            value={filters.field}
            onChange={(e) => onChange({ ...filters, field: e.target.value })}
            className={selectCls}
          >
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Operador">
          <select
            value={filters.operator}
            onChange={(e) => onChange({ ...filters, operator: e.target.value })}
            className={selectCls}
          >
            {OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Valor">
          <input
            value={filters.value}
            onChange={(e) => onChange({ ...filters, value: e.target.value })}
            className={selectCls}
            placeholder="ex: 100"
          />
        </Field>
        <Field label="UF">
          <select
            value={filters.uf}
            onChange={(e) => onChange({ ...filters, uf: e.target.value })}
            className={selectCls}
          >
            <option value="">Brasil (todos)</option>
            {UF_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Período">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <select
              value={filters.period}
              onChange={(e) => onChange({ ...filters, period: e.target.value })}
              className={selectCls + " pl-8"}
            >
              <option value="2024">2024</option>
              <option value="2023-2024">2023 – 2024</option>
              <option value="2019-2024">2019 – 2024</option>
              <option value="2000-2024">2000 – 2024</option>
            </select>
          </div>
        </Field>
        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              onApply();
              toast.success("Filtros aplicados");
            }}
            className="h-10 flex-1 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Aplicar
          </button>
          <button
            onClick={() => {
              onChange(defaultFilters);
              toast("Filtros redefinidos");
            }}
            className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}

const selectCls =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
