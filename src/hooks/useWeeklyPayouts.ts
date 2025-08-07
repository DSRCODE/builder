import { useQuery } from '@tanstack/react-query';
import { weeklyPayoutsService } from '@/services/weeklyPayoutsService';

// Query keys for consistent caching
export const WEEKLY_PAYOUTS_QUERY_KEYS = {
  all: ['weeklyPayouts'] as const,
  lists: () => [...WEEKLY_PAYOUTS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...WEEKLY_PAYOUTS_QUERY_KEYS.lists(), filters] as const,
};

// Hook to fetch weekly payouts report
export const useWeeklyPayouts = (params: {
  business_id: string;
  start_date: string;
  end_date: string;
  site_id?: string;
  supervisor_id?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: WEEKLY_PAYOUTS_QUERY_KEYS.list(params),
    queryFn: () => weeklyPayoutsService.getWeeklyPayouts(params),
    enabled: enabled && !!params.business_id && !!params.start_date && !!params.end_date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
