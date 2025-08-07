import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

// Query keys for consistent caching
export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  data: () => [...DASHBOARD_QUERY_KEYS.all, 'data'] as const,
};

// Hook to fetch dashboard data
export const useDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.data(),
    queryFn: dashboardService.getDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes (dashboard data changes frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
