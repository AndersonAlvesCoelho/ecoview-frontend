import { Header } from "@/components/layout/Header";
import { FeatureInfoPanel } from "@/components/map/FeatureInfoPanel";
import { LayerManager } from "@/components/map/LayerManager";
import { MapContainer } from "@/components/map/MapContainer";
import { MapControls } from "@/components/map/MapControls";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { sampleFeature } from "@/mock/features";
import { initialLayerGroups } from "@/mock/layers";
import type { SelectedFeature } from "@/types/feature";
import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";

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
  const [groups, setGroups] = useState(initialLayerGroups);
  const [feature, setFeature] = useState<SelectedFeature | null>(null);
  const [zoom, setZoom] = useState(5);
  const [baseMap, setBaseMap] = useState("streets");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobileLayersOpen, setMobileLayersOpen] = useState(false);

  const layers = groups.flatMap((g) => g.layers);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <Header overlay />

      <main className="absolute inset-0 top-16">
        <MapContainer layers={layers} onFeatureClick={() => setFeature(sampleFeature)} />

        {/* Left sidebar — Layer Manager (desktop) */}
        <aside
          className={cn(
            "pointer-events-auto absolute left-4 top-4 z-30 hidden w-[320px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-panel)] transition-all lg:flex",
            !leftOpen && "w-14",
          )}
          style={{ height: "calc(100% - 8rem)" }}
          aria-label="Gerenciador de camadas"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
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
          {leftOpen && (
            <div className="flex-1 overflow-hidden">
              <LayerManager groups={groups} onChange={setGroups} />
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
