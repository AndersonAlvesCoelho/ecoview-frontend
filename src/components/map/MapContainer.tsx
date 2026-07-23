import { cn } from "@/lib/utils";
import type { Layer } from "@/types/layer";

interface MapContainerProps {
  layers: Layer[];
  onFeatureClick?: () => void;
  className?: string;
  showLegend?: boolean;
  compact?: boolean;
}

/**
 * Placeholder MapContainer — SVG-based cartographic surface.
 * Designed to be swapped later with OpenLayers/MapLibre without changing the API.
 */
export function MapContainer({
  layers,
  onFeatureClick,
  className,
  showLegend = true,
  compact = false,
}: MapContainerProps) {
  const activeLayers = layers.filter((l) => l.visible);

  return (
    <div
      className={cn(
        "relative isolate h-full w-full overflow-hidden",
        "bg-[radial-gradient(ellipse_at_top_left,#e6efe6_0%,#f4f6f9_50%,#eef2ee_100%)]",
        className,
      )}
      role="img"
      aria-label="Mapa placeholder do território brasileiro"
    >
      {/* Grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 800"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M60 0 L0 0 L0 60"
              fill="none"
              stroke="#c8d3c8"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
          </pattern>
          <pattern id="grid-major" width="240" height="240" patternUnits="userSpaceOnUse">
            <path
              d="M240 0 L0 0 L0 240"
              fill="none"
              stroke="#a8b7a8"
              strokeOpacity="0.35"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dbe9f2" />
            <stop offset="100%" stopColor="#c3d9e6" />
          </linearGradient>
        </defs>

        <rect width="1200" height="800" fill="url(#grid)" />
        <rect width="1200" height="800" fill="url(#grid-major)" />

        {/* Simplified Brazil silhouette (stylized) */}
        <g transform="translate(0,0)">
          {/* Ocean fill outside */}
          <rect width="1200" height="800" fill="url(#water)" fillOpacity="0.35" />
          <path
            d="M420 110 C 520 90, 640 100, 740 140 C 830 175, 900 220, 930 300 C 960 380, 940 470, 890 540
               C 830 620, 740 690, 640 720 C 540 745, 440 730, 370 680 C 300 630, 260 555, 260 470
               C 260 380, 290 300, 340 230 C 370 180, 390 140, 420 110 Z"
            fill="#f6faf6"
            stroke="#7fa07f"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />

          {/* Biomes layer */}
          {activeLayers.some((l) => l.id === "l-biomas") && (
            <g opacity={activeLayers.find((l) => l.id === "l-biomas")?.opacity ?? 0.55}>
              <path
                d="M420 110 C 520 90, 640 100, 740 140 C 820 172, 870 210, 890 260 L 640 380 L 460 320 L 380 220 Z"
                fill="#3b8b3b"
                fillOpacity="0.55"
              />
              <path
                d="M380 220 L 460 320 L 640 380 L 700 480 L 540 540 L 420 520 L 340 430 Z"
                fill="#c4b25a"
                fillOpacity="0.65"
              />
              <path
                d="M700 480 L 890 260 L 930 340 L 900 460 L 830 540 Z"
                fill="#e2a34a"
                fillOpacity="0.55"
              />
              <path
                d="M420 520 L 540 540 L 700 480 L 830 540 L 780 640 L 620 700 L 460 660 Z"
                fill="#5aa869"
                fillOpacity="0.55"
              />
              <path
                d="M460 660 L 620 700 L 640 720 L 540 745 L 440 730 L 400 700 Z"
                fill="#8fb46d"
                fillOpacity="0.6"
              />
              <path
                d="M340 430 L 420 520 L 460 660 L 400 700 L 340 660 L 300 580 Z"
                fill="#c78a5d"
                fillOpacity="0.5"
              />
            </g>
          )}

          {/* UCs (blobs) */}
          {activeLayers.some((l) => l.id === "l-uc") && (
            <g opacity={activeLayers.find((l) => l.id === "l-uc")?.opacity ?? 0.7}>
              <ellipse
                cx="560"
                cy="260"
                rx="34"
                ry="22"
                fill="#008a4b"
                fillOpacity="0.35"
                stroke="#008a4b"
                strokeWidth="1.2"
              />
              <ellipse
                cx="480"
                cy="380"
                rx="28"
                ry="18"
                fill="#008a4b"
                fillOpacity="0.35"
                stroke="#008a4b"
                strokeWidth="1.2"
              />
              <ellipse
                cx="700"
                cy="330"
                rx="24"
                ry="20"
                fill="#008a4b"
                fillOpacity="0.35"
                stroke="#008a4b"
                strokeWidth="1.2"
              />
              <ellipse
                cx="600"
                cy="580"
                rx="30"
                ry="18"
                fill="#008a4b"
                fillOpacity="0.35"
                stroke="#008a4b"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* Estados outline */}
          {activeLayers.some((l) => l.id === "l-estados") && (
            <g
              opacity={activeLayers.find((l) => l.id === "l-estados")?.opacity ?? 0.9}
              fill="none"
              stroke="#006633"
              strokeWidth="1.4"
            >
              <path d="M420 110 C 520 90, 640 100, 740 140 C 830 175, 900 220, 930 300 C 960 380, 940 470, 890 540 C 830 620, 740 690, 640 720 C 540 745, 440 730, 370 680 C 300 630, 260 555, 260 470 C 260 380, 290 300, 340 230 C 370 180, 390 140, 420 110 Z" />
              <path
                d="M380 220 L 460 320 L 640 380 L 700 480 L 540 540 L 420 520 L 340 430 Z"
                strokeOpacity="0.5"
              />
              <path d="M700 480 L 890 260" strokeOpacity="0.5" />
              <path d="M540 540 L 620 700" strokeOpacity="0.5" />
              <path d="M460 320 L 460 660" strokeOpacity="0.4" />
            </g>
          )}

          {/* Terras Indígenas */}
          {activeLayers.some((l) => l.id === "l-ti") && (
            <g opacity={activeLayers.find((l) => l.id === "l-ti")?.opacity ?? 0.7}>
              {[
                [520, 300],
                [590, 340],
                [500, 420],
                [640, 260],
                [720, 400],
              ].map(([x, y], i) => (
                <path
                  key={i}
                  d={`M${x} ${y} l 24 6 l -6 22 l -26 -4 z`}
                  fill="#a86b2a"
                  fillOpacity="0.35"
                  stroke="#a86b2a"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Municipios (dense grid) */}
          {activeLayers.some((l) => l.id === "l-municipios") && (
            <g
              opacity={activeLayers.find((l) => l.id === "l-municipios")?.opacity ?? 0.6}
              fill="none"
              stroke="#339966"
              strokeWidth="0.4"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1={280}
                  x2={920}
                  y1={140 + i * 42}
                  y2={140 + i * 42}
                  strokeOpacity="0.6"
                />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={280 + i * 42}
                  x2={280 + i * 42}
                  y1={140}
                  y2={720}
                  strokeOpacity="0.6"
                />
              ))}
            </g>
          )}

          {/* Queimadas — dots */}
          {activeLayers.some((l) => l.id === "l-queimadas") && (
            <g opacity={activeLayers.find((l) => l.id === "l-queimadas")?.opacity ?? 0.85}>
              {Array.from({ length: 90 }).map((_, i) => {
                const seed = (i * 9301 + 49297) % 233280;
                const r = seed / 233280;
                const s2 = (i * 13797 + 33) % 233280;
                const r2 = s2 / 233280;
                const cx = 320 + r * 560;
                const cy = 180 + r2 * 480;
                return <circle key={i} cx={cx} cy={cy} r={1.4 + r * 2} fill="#c2410c" />;
              })}
            </g>
          )}

          {/* PRODES */}
          {activeLayers.some((l) => l.id === "l-prodes") && (
            <g opacity={activeLayers.find((l) => l.id === "l-prodes")?.opacity ?? 0.75}>
              {[
                [520, 340, 30, 18],
                [560, 380, 22, 14],
                [610, 350, 20, 12],
                [480, 320, 18, 10],
                [640, 300, 16, 9],
              ].map(([x, y, w, h], i) => (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="#7f1d1d"
                  fillOpacity="0.55"
                  transform={`rotate(${(i * 17) % 40} ${x + w / 2} ${y + h / 2})`}
                />
              ))}
            </g>
          )}

          {/* Hidrografia */}
          {activeLayers.some((l) => l.id === "l-hidro") && (
            <g
              opacity={activeLayers.find((l) => l.id === "l-hidro")?.opacity ?? 0.7}
              fill="none"
              stroke="#0369a1"
              strokeLinecap="round"
            >
              <path d="M340 260 C 420 280, 500 340, 600 380 S 780 460, 900 500" strokeWidth="2.2" />
              <path d="M520 200 C 540 260, 560 320, 590 380" strokeWidth="1.4" />
              <path d="M660 220 C 640 300, 640 360, 620 440" strokeWidth="1.4" />
              <path d="M600 380 C 640 460, 700 520, 780 580" strokeWidth="1.6" />
              <path d="M420 400 C 470 440, 520 470, 580 480" strokeWidth="1.2" />
            </g>
          )}

          {/* Uso do Solo (raster tiles overlay) */}
          {activeLayers.some((l) => l.id === "l-uso-solo") && (
            <g opacity={activeLayers.find((l) => l.id === "l-uso-solo")?.opacity ?? 0.7}>
              {Array.from({ length: 40 }).map((_, i) => {
                const cx = 320 + (i % 8) * 70;
                const cy = 180 + Math.floor(i / 8) * 70;
                const colors = ["#3b8b3b", "#c4b25a", "#e2a34a", "#5aa869", "#8fb46d", "#c78a5d"];
                const c = colors[(i * 7) % colors.length];
                return (
                  <rect key={i} x={cx} y={cy} width={70} height={70} fill={c} fillOpacity="0.35" />
                );
              })}
            </g>
          )}

          {/* Feature highlight marker */}
          <g>
            <circle cx="700" cy="200" r="14" fill="#006633" fillOpacity="0.15" />
            <circle
              cx="700"
              cy="200"
              r="6"
              fill="#006633"
              stroke="#ffffff"
              strokeWidth="2"
              onClick={onFeatureClick}
              className="cursor-pointer"
            />
          </g>
        </g>
      </svg>

      {/* Legend */}
      {showLegend && activeLayers.length > 0 && !compact && (
        <div className="pointer-events-auto absolute bottom-4 left-4 z-10 max-w-[240px] rounded-lg border border-border bg-card/95 p-3 shadow-md backdrop-blur">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Legenda
          </div>
          <ul className="space-y-1.5">
            {activeLayers.map((l) => (
              <li key={l.id} className="flex items-center gap-2 text-xs text-foreground">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: l.color, opacity: l.opacity }}
                />
                <span className="truncate">{l.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeLayers.length === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="rounded-lg border border-dashed border-border bg-card/70 px-4 py-3 text-sm text-muted-foreground backdrop-blur">
            Ative camadas na barra lateral para visualizá-las
          </div>
        </div>
      )}
    </div>
  );
}
