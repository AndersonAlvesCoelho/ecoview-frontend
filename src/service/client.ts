import type {
  ApiDataset,
  ApiPaginatedResponse,
  ApiVersionsResponse,
  DatasetQueryParams,
} from '@/types/api';
import { api } from './api';

export async function fetchDatasets(
  params: DatasetQueryParams = {},
): Promise<ApiPaginatedResponse<ApiDataset>> {
  const { data } = await api.get<ApiPaginatedResponse<ApiDataset>>(
    '/datasets',
    { params },
  );
  return data;
}

export async function fetchDatasetBySlug(slug: string): Promise<ApiDataset> {
  const { data } = await api.get<ApiDataset>(`/datasets/${slug}`);
  return data;
}

export async function fetchDatasetVersions(
  slug: string,
): Promise<ApiVersionsResponse> {
  const { data } = await api.get<ApiVersionsResponse>(
    `/datasets/${slug}/versions`,
  );
  return data;
}