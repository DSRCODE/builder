import { useQuery } from '@tanstack/react-query';
import { materialCostsService } from '@/services/materialCostsService';

// Query keys for consistent caching
export const MATERIAL_COSTS_QUERY_KEYS = {
  all: ['materialCosts'] as const,
  lists: () => [...MATERIAL_COSTS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...MATERIAL_COSTS_QUERY_KEYS.lists(), filters] as const,
};

// Hook to fetch material costs report
export const useMaterialCosts = (params: {
  business_id: string;
  start_date: string;
  end_date: string;
  site_id?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: MATERIAL_COSTS_QUERY_KEYS.list(params),
    queryFn: () => materialCostsService.getMaterialCosts(params),
    enabled: enabled && !!params.business_id && !!params.start_date && !!params.end_date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
