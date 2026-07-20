import { GEOMETRY_LABEL, GeometryIcon } from "@/components/catalog/GeometryIcon";
import { ThemeBadge } from "@/components/catalog/ThemeBadge";
import { VersionTimeline } from "@/components/dataset/VersionTimeline";
import { Header } from "@/components/layout/Header";
import { MapContainer } from "@/components/map/MapContainer";
import { formatDate, formatNumber } from "@/lib/utils";
import { getDatasetBySlug } from "@/mock/datasets";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  Download,
  Eye,
  FileJson,
  FileType2,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/catalogo/$slug")({
  loader: ({ params }) => {
    const dataset = getDatasetBySlug(params.slug);
    if (!dataset) throw notFound();
    return { dataset };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.dataset.title} — EcoView` },
          { name: "description", content: loaderData.dataset.description },
          { property: "og:title", content: `${loaderData.dataset.title} — EcoView` },
          { property: "og:description", content: loaderData.dataset.description },
        ]
      : [{ title: "Dataset não encontrado — EcoView" }, { name: "robots", content: "noindex" }],
  }),
  component: DatasetDetailPage,
  notFoundComponent: DatasetNotFound,
});

function DatasetNotFound() {
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Dataset não encontrado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O recurso solicitado não existe no catálogo.
        </p>
        <Link
          to="/catalogo"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}

function DatasetDetailPage() {
  const { dataset } = Route.useLoaderData() as { dataset: import("@/types/dataset").Dataset };

  const copy = (label: string, url: string) => {
    navigator.clipboard?.writeText(url);
    toast.success(`${label} copiado para a área de transferência`);
  };

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 lg:py-10">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Catálogo
        </Link>

        {/* Hero */}
        <section className="mt-4 grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {dataset.source}
              </span>
              <ThemeBadge theme={dataset.theme} label={dataset.themeLabel} />
              {dataset.indeCompliant && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
                  <ShieldCheck className="h-3 w-3" /> Conforme INDE
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {dataset.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {dataset.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatBlock
                label="Geometria"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <GeometryIcon type={dataset.geometry} className="h-3.5 w-3.5 text-primary" />
                    {GEOMETRY_LABEL[dataset.geometry]}
                  </span>
                }
              />
              <StatBlock label="SRID" value={`EPSG:${dataset.srid}`} />
              <StatBlock label="Versão" value={dataset.version} />
              <StatBlock label="Features" value={formatNumber(dataset.features)} />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="h-56 lg:h-full">
              <MapContainer
                layers={[
                  {
                    id: dataset.slug,
                    name: dataset.title,
                    source: dataset.source,
                    geometry: dataset.geometry,
                    visible: true,
                    opacity: 0.75,
                    color: "#006633",
                  },
                  {
                    id: "l-estados",
                    name: "Estados",
                    source: "IBGE",
                    geometry: "polygon",
                    visible: true,
                    opacity: 0.9,
                    color: "#006633",
                  },
                ]}
                showLegend={false}
                compact
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Eye className="h-4 w-4" /> Visualizar no mapa
            </Link>
            <button
              onClick={() =>
                toast("Download simulado", { description: "GeoJSON não disponível no mock." })
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <FileJson className="h-4 w-4" /> Download GeoJSON
            </button>
            <button
              onClick={() =>
                toast("Download simulado", { description: "Shapefile não disponível no mock." })
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <FileType2 className="h-4 w-4" /> Download Shapefile
            </button>
            <button
              onClick={() => copy("URL WMS", dataset.wms)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LinkIcon className="h-4 w-4" /> Copiar WMS
            </button>
            <button
              onClick={() => copy("URL WFS", dataset.wfs)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="h-4 w-4" /> Copiar WFS
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              Última atualização:{" "}
              <span className="font-medium text-foreground">{formatDate(dataset.updatedAt)}</span>
            </span>
          </div>
        </section>

        {/* Metadata + Timeline */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Metadados
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetaRow label="Licença" value={dataset.license} />
              <MetaRow label="Resolução" value={dataset.resolution} />
              <MetaRow label="Sistema de referência" value={`EPSG:${dataset.srid}`} />
              <MetaRow label="Conformidade INDE" value={dataset.indeCompliant ? "Sim" : "Não"} />
              <MetaRow label="Contato" value={dataset.contact} />
              <MetaRow
                label="Cobertura"
                value={dataset.uf[0] === "BR" ? "Nacional" : dataset.uf.join(", ")}
              />
            </dl>

            <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Palavras-chave
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dataset.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                >
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 rounded-lg bg-primary/5 p-3">
              <Download className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                Endpoints disponíveis:{" "}
                <code className="rounded bg-card px-1 py-0.5 text-[11px] text-foreground">
                  {dataset.wms}
                </code>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Histórico de versões
            </h2>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">
              {dataset.history.length} versões publicadas
            </p>
            <VersionTimeline history={dataset.history} />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
