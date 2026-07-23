import { GEOMETRY_MAP } from "@/lib/geo-utils";
import type { ApiDataset, ApiThemeResponse } from "@/types/api";
import type { GeometryType, SourceKey } from "@/types/dataset";
import type { Layer, LayerGroup } from "@/types/layer";

const DEFAULT_COLOR = "#339966";

function datasetToLayer(dataset: ApiDataset, themeColor: string): Layer {
  const gsUrl = import.meta.env.VITE_GEOSERVER_URL ?? "http://localhost:8080/geoserver";

  return {
    id: dataset.id,
    name: dataset.title,
    source: (dataset.source?.acronym ?? "IBGE") as SourceKey,
    geometry: (GEOMETRY_MAP[dataset.geometryType ?? ""] ?? "polygon") as GeometryType,
    visible: false,
    opacity: 0.8,
    color: dataset.color ?? themeColor,
    datasetSlug: dataset.slug,
    wmsUrl: dataset.wms
      ? `${gsUrl}/ecoview/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=${dataset.wms.layer}&SRS=EPSG:4674`
      : undefined,
  };
}

export function adaptThemesToLayerGroups(
  themes: ApiThemeResponse[],
  datasets: ApiDataset[],
): LayerGroup[] {
  const groups: LayerGroup[] = [];

  for (const theme of themes) {
    const themeColor = theme.color ?? DEFAULT_COLOR;

    // Datasets diretamente no tema raiz
    const rootDatasets = datasets.filter((d) =>
      d.themes.some((t) => t.code === theme.code && t.isPrimary),
    );

    // Datasets nos subtemas
    const childDatasets = theme.children.flatMap((child) =>
      datasets.filter((d) => d.themes.some((t) => t.code === child.code)),
    );

    const allDatasets = [...rootDatasets, ...childDatasets];

    // Só mostra grupos com ao menos 1 dataset
    if (allDatasets.length === 0) continue;

    // Agrupa por subtema quando possível
    const layers: Layer[] = [];

    // Primeiro datasets do tema raiz
    for (const dataset of rootDatasets) {
      layers.push(datasetToLayer(dataset, themeColor));
    }

    // Depois datasets dos subtemas (mantendo ordem de sort_order)
    for (const child of theme.children) {
      const childColor = child.color ?? themeColor;
      const childDs = datasets.filter((d) => d.themes.some((t) => t.code === child.code));
      for (const dataset of childDs) {
        layers.push(datasetToLayer(dataset, childColor));
      }
    }

    groups.push({
      id: `grp-${theme.code}`,
      name: theme.name,
      icon: theme.icon ?? "map",
      color: themeColor,
      layers,
    });
  }

  return groups;
}
