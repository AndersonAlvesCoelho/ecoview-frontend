import { fetchThemes } from '@/service/themes';
import { useQuery } from '@tanstack/react-query';

export const themeKeys = {
  all: () => ['themes'] as const,
};

export function useThemes() {
  return useQuery({
    queryKey:  themeKeys.all(),
    queryFn:   fetchThemes,
    staleTime: 30 * 60 * 1000,
    gcTime:    60 * 60 * 1000,
  });
}