import type { GeometryType, SourceKey } from "./dataset";

export interface Layer {
  id: string;
  name: string;
  source: SourceKey;
  geometry: GeometryType;
  visible: boolean;
  opacity: number;
  color: string;
  datasetSlug?: string;
  wmsUrl?: string
}

export interface LayerGroup {
  id: string;
  name: string;
  icon: string;
  color?: string
  layers: Layer[];
}
