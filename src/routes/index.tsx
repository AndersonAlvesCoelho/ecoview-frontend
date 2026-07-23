import { Header } from "@/components/layout/Header";
import { FeatureInfoPanel } from "@/components/map/FeatureInfoPanel";
import { CollapsedLayerIcons, LayerManager } from "@/components/map/LayerManager";
import { MapContainer } from "@/components/map/MapContainer";
import { MapControls } from "@/components/map/MapControls";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDatasets } from "@/hooks/use-datasets";
import { useThemes } from "@/hooks/use-themes";
import { cn } from "@/lib/utils";
import { sampleFeature } from "@/mock/features";
import { fetchDatasets } from "@/service/datasets";
import { adaptThemesToLayerGroups } from "@/service/layer-adapters";
import type { SelectedFeature } from "@/types/feature";
import type { LayerGroup } from "@/types/layer";
import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa — EcoView" },
      {
        name: "description",
        content:
          "Visualize camadas geoespaciais de todo o Brasil: biomas, unidades de conservação, terras indígenas, queimadas e mais.",
      },
      { property: "og:title", content: "Mapa — EcoView" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [groups, setGroups] = useState<LayerGroup[]>([]);
  const [feature, setFeature] = useState<SelectedFeature | null>(null);
  const [zoom, setZoom] = useState(5);
  const [baseMap, setBaseMap] = useState("streets");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobileLayersOpen, setMobileLayersOpen] = useState(false);
  const [focusGroupId, setFocusGroupId] = useState<string | null>(null);

  // Busca temas e datasets da API
  const { data: themes } = useThemes();
  const { data: datasetsResponse } = useDatasets({ limit: 100 });

  // Monta os grupos quando os dados chegam
  useEffect(() => {
    if (!themes || !datasetsResponse?.data) return;

    // Para o adaptador precisamos dos ApiDataset originais (não adaptados)
    // então buscamos direto via fetchDatasets
    fetchDatasets({ limit: 100 }).then((response) => {
      const layerGroups = adaptThemesToLayerGroups(themes, response.data);
      setGroups(layerGroups);
    });
  }, [themes, datasetsResponse]);

  // Quando menu fechado e usuário clica num grupo:
  // abre o menu e garante que o grupo clicado está expandido
  function handleGroupSelect(groupId: string) {
    setLeftOpen(true);
    setFocusGroupId(groupId);
  }

  const layers = groups.flatMap((g) => g.layers);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <Header overlay />

      <main className="absolute inset-0 top-16">
        <MapContainer layers={layers} onFeatureClick={() => setFeature(sampleFeature)} />

        {/* Left sidebar — Layer Manager (desktop) */}
        <aside
          className={cn(
            "pointer-events-auto absolute left-4 top-4 z-30 hidden flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-panel)] transition-all duration-200 lg:flex",
            leftOpen ? "w-[320px]" : "w-14",
          )}
          style={{ height: "calc(100% - 8rem)" }}
          aria-label="Gerenciador de camadas"
        >
          {/* Header do painel */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
            {leftOpen && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Painel de Camadas
              </span>
            )}
            <button
              onClick={() => setLeftOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={leftOpen ? "Recolher painel de camadas" : "Expandir painel de camadas"}
            >
              {leftOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Conteúdo: expandido ou recolhido */}
          {leftOpen ? (
            <div className="flex-1 overflow-hidden">
              <LayerManager
                groups={groups}
                onChange={setGroups}
                focusGroupId={focusGroupId}
                onFocusHandled={() => setFocusGroupId(null)}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <CollapsedLayerIcons groups={groups} onGroupClick={handleGroupSelect} />
            </div>
          )}
        </aside>

        {/* Right sidebar — Feature Info (desktop) */}
        <aside
          className={cn(
            "pointer-events-auto absolute right-4 top-4 z-30 hidden w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-panel)] transition-all lg:flex",
            !rightOpen && "w-14",
          )}
          style={{ height: "calc(100% - 8rem)" }}
          aria-label="Informações da feição"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <button
              onClick={() => setRightOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={rightOpen ? "Recolher painel" : "Expandir painel"}
            >
              {rightOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>
            {rightOpen && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Feature Info
              </span>
            )}
          </div>
          {rightOpen && (
            <div className="flex-1 overflow-hidden">
              <FeatureInfoPanel feature={feature} onClose={() => setFeature(null)} />
            </div>
          )}
        </aside>

        {/* Mobile layer trigger */}
        <div className="absolute left-4 top-4 z-30 flex gap-2 lg:hidden">
          <Sheet open={mobileLayersOpen} onOpenChange={setMobileLayersOpen}>
            <SheetTrigger asChild>
              <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium shadow-md">
                Camadas
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Camadas</SheetTitle>
              <LayerManager groups={groups} onChange={setGroups} />
            </SheetContent>
          </Sheet>
          {feature && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium shadow-md">
                  Feature
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <SheetTitle className="sr-only">Feature</SheetTitle>
                <FeatureInfoPanel feature={feature} onClose={() => setFeature(null)} />
              </SheetContent>
            </Sheet>
          )}
        </div>

        <MapControls
          zoom={zoom}
          onZoom={(d) => setZoom((z) => Math.max(1, Math.min(18, z + d)))}
          baseMap={baseMap}
          onBaseMap={setBaseMap}
          coordinates={{ lat: -14.235, lng: -51.9253 }}
        />
      </main>
    </div>
  );
}
