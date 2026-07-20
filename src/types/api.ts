export interface ApiSource {
  id:      string;
  name:    string;
  acronym: string;
  website: string;
}

export interface ApiTheme {
  id:        number;
  code:      string;
  name:      string;
  icon:      string | null;
  isPrimary: boolean;
}

export interface ApiVersion {
  id:           string;
  tag:          string;
  num:          number;
  isCurrent?:    boolean;
  featureCount: number;
  periodStart:  string | null;
  periodEnd:    string | null;
  sourceUrl:    string | null;
  sourceFormat: string | null;
  changelog?:    string | null;
  publishedAt:  string | null;
}

export interface ApiMetadata {
  license:           string;
  updateFrequency:   string;
  spatialResolution: string | null;
  referenceDate:     string | null;
  indeCompliant:     boolean;
  keywords:          string[];
  contact: {
    name:  string | null;
    email: string | null;
  };
}

export interface ApiWms {
  enabled: boolean;
  url:     string;
  layer:   string;
}

export interface ApiDataset {
  id:             string;
  title:          string;
  slug:           string;
  description:    string | null;
  geometryType:   string | null;
  srid:           number;
  ufScope:        string[];
  tags:           string[];
  featured:       boolean;
  thumbnailUrl:   string | null;
  dataStartYear:  number | null;
  dataEndYear:    number | null;
  wms:            ApiWms | null;
  wfs:            ApiWms | null;
  source:         ApiSource | null;
  themes:         ApiTheme[];
  currentVersion: ApiVersion | null;
  versions:       ApiVersion[];
  metadata:       ApiMetadata | null;
  createdAt:      string;
  updatedAt:      string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    total:   number;
    limit:   number;
    offset:  number;
    hasMore: boolean;
  };
}

export interface ApiVersionsResponse {
  dataset: { id: string; title: string; slug: string };
  total:   number;
  versions: ApiVersion[];
}

export interface ApiThemeResponse {
  id:           number;
  code:         string;
  name:         string;
  icon:         string | null;
  datasetCount: number;
  children: {
    id:           number;
    code:         string;
    name:         string;
    icon:         string | null;
    datasetCount: number;
  }[];
}

export interface DatasetQueryParams {
  theme?:  string;
  search?: string;
  uf?:     string;
  limit?:  number;
  offset?: number;
}