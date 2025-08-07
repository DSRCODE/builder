import { useQuery } from '@tanstack/react-query';
import { supervisorFlowService } from '@/services/supervisorFlowService';

// Query keys for consistent caching
export const SUPERVISOR_FLOW_QUERY_KEYS = {
  all: ['supervisorFlow'] as const,
  lists: () => [...SUPERVISOR_FLOW_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...SUPERVISOR_FLOW_QUERY_KEYS.lists(), filters] as const,
};

// Hook to fetch supervisor flow report
export const useSupervisorFlow = (params: {
  supervisor_id: string;
  start_date: string;
  end_date?: string;
  business_id?: string;
  site_id?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: SUPERVISOR_FLOW_QUERY_KEYS.list(params),
    queryFn: () => supervisorFlowService.getSupervisorFlow(params),
    enabled: enabled && !!params.supervisor_id && !!params.start_date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
