export interface FeatureAttribute {
  label: string;
  value: string | number;
}

export interface SelectedFeature {
  id: string;
  layerId: string;
  layerName: string;
  source: string;
  name: string;
  datasetSlug: string;
  attributes: FeatureAttribute[];
}
