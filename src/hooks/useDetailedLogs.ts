import { useQuery } from '@tanstack/react-query';
import { detailedLogsService } from '@/services/detailedLogsService';

// Query keys for consistent caching
export const DETAILED_LOGS_QUERY_KEYS = {
  all: ['detailedLogs'] as const,
  lists: () => [...DETAILED_LOGS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...DETAILED_LOGS_QUERY_KEYS.lists(), filters] as const,
};

// Hook to fetch detailed logs report
export const useDetailedLogs = (params: {
  business_id: string;
  site_id: string;
  start_date: string;
  end_date: string;
  supervisor_id?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: DETAILED_LOGS_QUERY_KEYS.list(params),
    queryFn: () => detailedLogsService.getDetailedLogs(params),
    enabled: enabled && !!params.business_id && !!params.site_id && !!params.start_date && !!params.end_date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
