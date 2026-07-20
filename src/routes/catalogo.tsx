import { DatasetCard } from "@/components/catalog/DatasetCard";
import { FilterBar, emptyFilters, type CatalogFilters } from "@/components/catalog/FilterBar";
import { Pagination } from "@/components/catalog/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Header } from "@/components/layout/Header";
import { useDatasets } from "@/hooks/use-datasets";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo de Datasets — EcoView" },
      {
        name: "description",
        content:
          "Explore o catálogo nacional de dados geoespaciais com filtros por tema, geometria, fonte e UF.",
      },
      { property: "og:title", content: "Catálogo — EcoView" },
    ],
  }),
  component: CatalogPage,
});

const PAGE_SIZE = 9;

function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);
  const [page, setPage] = useState(1);

  // Monta os params para a API com base nos filtros ativos
  const apiParams = {
    search: filters.query.trim() || undefined,
    theme: filters.themes[0] || undefined, // API aceita um tema por vez
    uf: filters.uf || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const { data, isLoading, isError } = useDatasets(apiParams);

  const datasets = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Filtros locais que a API não suporta ainda (geometria e fonte)
  const visible = datasets.filter((d) => {
    if (filters.geometries.length && !filters.geometries.includes(d.geometry)) return false;
    if (filters.sources.length && !filters.sources.includes(d.source)) return false;
    return true;
  });

  // Ordenação local
  const sorted = [...visible].sort((a, b) => {
    if (filters.sort === "az") return a.title.localeCompare(b.title);
    if (filters.sort === "features") return b.features - a.features;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  function handleFilterChange(f: CatalogFilters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 lg:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Catálogo
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Explorador de Datasets
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {isLoading
                ? "Carregando datasets..."
                : `${total} datasets disponíveis de IBGE, INPE, ICMBio, FUNAI, ANA, MapBiomas e INCRA.`}
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onChange={handleFilterChange} resultCount={total} />

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={SearchX}
              title="Erro ao carregar datasets"
              description="Não foi possível conectar à API. Verifique se o backend está rodando."
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-[var(--color-primary-hover)]"
                >
                  Tentar novamente
                </button>
              }
            />
          ) : sorted.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nenhum dataset corresponde aos filtros"
              description="Tente remover filtros de tema, geometria ou fonte para ampliar sua busca."
              action={
                <button
                  onClick={() => handleFilterChange(emptyFilters)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-[var(--color-primary-hover)]"
                >
                  Limpar filtros
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((d) => (
                <DatasetCard key={d.slug} dataset={d} />
              ))}
            </div>
          )}
        </div>

        {total > PAGE_SIZE && (
          <div className="mt-10">
            <Pagination page={page} pageCount={pageCount} onPage={setPage} />
          </div>
        )}
      </main>
    </div>
  );
}
