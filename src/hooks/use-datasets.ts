import { adaptDataset, adaptDatasets } from '@/service/adapters';
import { fetchDatasetBySlug, fetchDatasets, fetchDatasetVersions } from '@/service/client';
import type { DatasetQueryParams } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export const datasetKeys = {
  all:      ()                      => ['datasets']                    as const,
  list:     (p: DatasetQueryParams) => ['datasets', 'list', p]        as const,
  detail:   (slug: string)          => ['datasets', 'detail', slug]   as const,
  versions: (slug: string)          => ['datasets', 'versions', slug] as const,
};

export function useDatasets(params: DatasetQueryParams = {}) {
  return useQuery({
    queryKey:        datasetKeys.list(params),
    queryFn:         async () => {
      const response = await fetchDatasets(params);
      return { data: adaptDatasets(response.data), meta: response.meta };
    },
    staleTime:       5 * 60 * 1000,
    gcTime:          10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useDataset(slug: string) {
  return useQuery({
    queryKey:  datasetKeys.detail(slug),
    queryFn:   async () => adaptDataset(await fetchDatasetBySlug(slug)),
    enabled:   !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDatasetVersions(slug: string) {
  return useQuery({
    queryKey:  datasetKeys.versions(slug),
    queryFn:   () => fetchDatasetVersions(slug),
    enabled:   !!slug,
    staleTime: 5 * 60 * 1000,
  });
}