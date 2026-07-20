// Converte resposta da API para o tipo Dataset usado nos componentes.
import type { ApiDataset, ApiVersion } from "@/types/api";
import type { Dataset, DatasetVersion, GeometryType, SourceKey, ThemeKey } from "@/types/dataset";

const GEOMETRY_MAP: Record<string, GeometryType> = {
  POINT: "point",
  MULTIPOINT: "point",
  LINESTRING: "line",
  MULTILINESTRING: "line",
  POLYGON: "polygon",
  MULTIPOLYGON: "polygon",
  RASTER: "raster",
};

const THEME_MAP: Record<string, ThemeKey> = {
  meio_ambiente: "biomas",
  queimadas: "florestas",
  desmatamento: "florestas",
  biodiversidade: "conservacao",
  hidrografia: "agua",
  clima: "clima",
  agricultura: "uso-solo",
  terras_indigenas: "indigena",
  quilombos: "indigena",
  uc: "conservacao",
  limites: "territorio",
  infraestrutura: "infraestrutura",
  gestao_riscos: "clima",
};

const THEME_LABEL_MAP: Record<string, string> = {
  meio_ambiente: "Meio Ambiente",
  queimadas: "Queimadas",
  desmatamento: "Desmatamento",
  biodiversidade: "Biodiversidade",
  hidrografia: "Hidrografia",
  clima: "Clima",
  agricultura: "Agricultura",
  terras_indigenas: "Terras Indígenas",
  quilombos: "Quilombos",
  uc: "Unidades de Conservação",
  limites: "Território",
  infraestrutura: "Infraestrutura",
  gestao_riscos: "Gestão de Riscos",
};

function adaptVersion(v: ApiVersion): DatasetVersion {
  return {
    version: v.tag,
    date: v.publishedAt?.split("T")[0] ?? v.tag,
    changes: v.changelog ?? "Atualização de dados.",
    author: "EcoView",
  };
}

export function adaptDataset(api: ApiDataset): Dataset {
  const primaryTheme = api.themes.find((t) => t.isPrimary) ?? api.themes[0];
  const themeCode = primaryTheme?.code ?? "limites";

  const gsUrl = import.meta.env.VITE_GEOSERVER_URL ?? "http://localhost:8080/geoserver";

  return {
    slug: api.slug,
    title: api.title,
    description: api.description ?? "",
    source: (api.source?.acronym ?? "IBGE") as SourceKey,
    theme: (THEME_MAP[themeCode] ?? "territorio") as ThemeKey,
    themeLabel: THEME_LABEL_MAP[themeCode] ?? primaryTheme?.name ?? "Território",
    geometry: (GEOMETRY_MAP[api.geometryType ?? ""] ?? "polygon") as GeometryType,
    srid: api.srid,
    version: api.currentVersion?.tag ?? "—",
    features: api.currentVersion?.featureCount ?? 0,
    updatedAt: api.currentVersion?.publishedAt
      ? api.currentVersion.publishedAt.split("T")[0]
      : api.updatedAt.split("T")[0],
    uf: api.ufScope.length > 0 ? api.ufScope : ["BR"],
    license: api.metadata?.license ?? "CC BY 4.0",
    resolution: api.metadata?.spatialResolution ?? "—",
    contact: api.metadata?.contact?.email ?? "",
    keywords: api.metadata?.keywords?.length ? api.metadata.keywords : api.tags,
    indeCompliant: api.metadata?.indeCompliant ?? false,
    history: api.versions.map(adaptVersion),
    wms: api.wms
      ? `${gsUrl}/ecoview/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=${api.wms.layer}&SRS=EPSG:4674`
      : "",
    wfs: api.wfs
      ? `${gsUrl}/ecoview/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${api.wfs.layer}&OUTPUTFORMAT=application/json`
      : "",
  };
}

export function adaptDatasets(apiList: ApiDataset[]): Dataset[] {
  return apiList.map(adaptDataset);
}
