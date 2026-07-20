import type { ApiThemeResponse } from '@/types/api';
import { api } from './api';

export async function fetchThemes(): Promise<ApiThemeResponse[]> {
  const { data } = await api.get<ApiThemeResponse[]>('/themes');
  return data;
}