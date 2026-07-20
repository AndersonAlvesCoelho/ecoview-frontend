import { cn } from "@/lib/utils";
import type { GeometryType } from "@/types/dataset";

interface GeometryIconProps {
  type: GeometryType;
  className?: string;
}

export function GeometryIcon({ type, className }: GeometryIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("h-4 w-4", className)}
      aria-label={`Geometria: ${type}`}
    >
      {type === "point" && (
        <>
          <circle cx="8" cy="8" r="3.2" fill="currentColor" />
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        </>
      )}
      {type === "line" && (
        <path
          d="M2 12 L6 6 L10 10 L14 4"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {type === "polygon" && (
        <path
          d="M3 5 L9 3 L13 7 L11 13 L4 12 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.15"
          strokeLinejoin="round"
        />
      )}
      {type === "raster" && (
        <g stroke="currentColor" strokeOpacity="0.7">
          <rect x="2.5" y="2.5" width="4" height="4" fill="currentColor" fillOpacity="0.35" />
          <rect x="6.5" y="2.5" width="4" height="4" fill="currentColor" fillOpacity="0.15" />
          <rect x="10.5" y="2.5" width="3" height="4" fill="currentColor" fillOpacity="0.55" />
          <rect x="2.5" y="6.5" width="4" height="4" fill="currentColor" fillOpacity="0.2" />
          <rect x="6.5" y="6.5" width="4" height="4" fill="currentColor" fillOpacity="0.45" />
          <rect x="10.5" y="6.5" width="3" height="4" fill="currentColor" fillOpacity="0.1" />
          <rect x="2.5" y="10.5" width="4" height="3" fill="currentColor" fillOpacity="0.5" />
          <rect x="6.5" y="10.5" width="4" height="3" fill="currentColor" fillOpacity="0.2" />
          <rect x="10.5" y="10.5" width="3" height="3" fill="currentColor" fillOpacity="0.4" />
        </g>
      )}
    </svg>
  );
}

export const GEOMETRY_LABEL: Record<GeometryType, string> = {
  point: "Ponto",
  line: "Linha",
  polygon: "Polígono",
  raster: "Raster",
};
