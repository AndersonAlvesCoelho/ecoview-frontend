export type GeometryType = "point" | "line" | "polygon" | "raster";

export type ThemeKey =
  | "biomas"
  | "territorio"
  | "indigena"
  | "conservacao"
  | "clima"
  | "florestas"
  | "infraestrutura"
  | "agua"
  | "uso-solo";

export type SourceKey =
  | "IBGE"
  | "INPE"
  | "ICMBio"
  | "FUNAI"
  | "ANA"
  | "MapBiomas"
  | "INCRA";

export interface DatasetVersion {
  version: string;
  date: string;
  changes: string;
  author: string;
}

export interface Dataset {
  slug: string;
  title: string;
  description: string;
  source: SourceKey;
  theme: ThemeKey;
  themeLabel: string;
  geometry: GeometryType;
  srid: number;
  version: string;
  features: number;
  updatedAt: string;
  uf: string[];
  license: string;
  resolution: string;
  contact: string;
  keywords: string[];
  indeCompliant: boolean;
  history: DatasetVersion[];
  wms: string;
  wfs: string;
}
