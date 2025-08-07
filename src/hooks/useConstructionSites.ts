import { useQuery } from '@tanstack/react-query';
import { constructionSitesService } from '@/services/constructionSitesService';

// Query keys for consistent caching
export const CONSTRUCTION_SITES_QUERY_KEYS = {
  all: ['constructionSites'] as const,
  lists: () => [...CONSTRUCTION_SITES_QUERY_KEYS.all, 'list'] as const,
};

// Hook to fetch all construction sites
export const useConstructionSites = () => {
  return useQuery({
    queryKey: CONSTRUCTION_SITES_QUERY_KEYS.lists(),
    queryFn: constructionSitesService.getConstructionSites,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
