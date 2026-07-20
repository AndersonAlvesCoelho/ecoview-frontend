import { Plus, Minus, LocateFixed, Layers as LayersIcon, Ruler } from "lucide-react";

const BASE_MAPS = [
  { id: "streets", label: "Ruas" },
  { id: "satellite", label: "Satélite" },
  { id: "terrain", label: "Relevo" },
];

interface MapControlsProps {
  zoom: number;
  onZoom: (delta: number) => void;
  baseMap: string;
  onBaseMap: (id: string) => void;
  coordinates: { lat: number; lng: number };
}

export function MapControls({
  zoom,
  onZoom,
  baseMap,
  onBaseMap,
  coordinates,
}: MapControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 px-4 pb-4 md:flex-row md:items-end md:justify-between">
      {/* Zoom + locate */}
      <div className="pointer-events-auto flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <button
          onClick={() => onZoom(1)}
          className="grid h-10 w-10 place-items-center text-foreground transition-colors hover:bg-muted"
          aria-label="Aumentar zoom"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-px bg-border" />
        <button
          onClick={() => onZoom(-1)}
          className="grid h-10 w-10 place-items-center text-foreground transition-colors hover:bg-muted"
          aria-label="Diminuir zoom"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-px bg-border" />
        <button
          className="grid h-10 w-10 place-items-center text-foreground transition-colors hover:bg-muted"
          aria-label="Minha localização"
        >
          <LocateFixed className="h-4 w-4" />
        </button>
      </div>

      {/* Coordinates + scale */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-md">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium text-foreground">Zoom</span>
          <span>{zoom}</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium text-foreground">Lat</span>
          <span>{coordinates.lat.toFixed(4)}°</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium text-foreground">Lng</span>
          <span>{coordinates.lng.toFixed(4)}°</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <Ruler className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-14 rounded-sm bg-foreground/85" />
            <span className="text-muted-foreground">200 km</span>
          </div>
        </div>
      </div>

      {/* Basemap selector */}
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-md">
        <LayersIcon className="ml-1.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {BASE_MAPS.map((bm) => (
          <button
            key={bm.id}
            onClick={() => onBaseMap(bm.id)}
            className={
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors " +
              (baseMap === bm.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            {bm.label}
          </button>
        ))}
      </div>
    </div>
  );
}
