import type { SelectedFeature } from "@/types/feature";

export const sampleFeature: SelectedFeature = {
  id: "feat-uc-parna-tumucumaque",
  layerId: "l-uc",
  layerName: "Unidades de Conservação",
  source: "ICMBio",
  name: "Parque Nacional Montanhas do Tumucumaque",
  datasetSlug: "unidades-conservacao",
  attributes: [
    { label: "Categoria", value: "Parque Nacional" },
    { label: "Grupo", value: "Proteção Integral" },
    { label: "Esfera", value: "Federal" },
    { label: "Bioma", value: "Amazônia" },
    { label: "UF", value: "AP" },
    { label: "Área (km²)", value: "38.867,23" },
    { label: "Ato de criação", value: "Decreto s/n° de 22/08/2002" },
    { label: "Plano de manejo", value: "Sim (2009)" },
  ],
};
