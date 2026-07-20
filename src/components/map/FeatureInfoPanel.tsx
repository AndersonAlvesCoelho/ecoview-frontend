import { Link } from "@tanstack/react-router";
import { ExternalLink, FileText, X } from "lucide-react";
import type { SelectedFeature } from "@/types/feature";
import { EmptyState } from "@/components/common/EmptyState";
import { MousePointerClick } from "lucide-react";

interface FeatureInfoPanelProps {
  feature: SelectedFeature | null;
  onClose?: () => void;
}

export function FeatureInfoPanel({ feature, onClose }: FeatureInfoPanelProps) {
  if (!feature) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
            Feature Selecionada
          </h2>
        </div>
        <div className="flex-1 p-4">
          <EmptyState
            icon={MousePointerClick}
            title="Nenhuma feature selecionada"
            description="Clique em uma feição no mapa para visualizar seus atributos e metadados."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {feature.layerName}
          </p>
          <h2 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
            {feature.name}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Fonte: {feature.source}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar painel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="eco-scroll flex-1 overflow-y-auto p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Atributos
        </h3>
        <dl className="grid grid-cols-1 gap-2">
          {feature.attributes.map((a) => (
            <div
              key={a.label}
              className="flex items-baseline justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2"
            >
              <dt className="text-xs text-muted-foreground">{a.label}</dt>
              <dd className="text-right text-xs font-medium text-foreground">
                {a.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-2 border-t border-border p-4">
        <Link
          to="/catalogo/$slug"
          params={{ slug: feature.datasetSlug }}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir dataset
        </Link>
        <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <FileText className="h-3.5 w-3.5" />
          Metadados INDE
        </button>
      </div>
    </div>
  );
}
