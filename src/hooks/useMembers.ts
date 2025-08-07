import { useQuery } from '@tanstack/react-query';
import { membersService } from '@/services/membersService';

// Query keys for consistent caching
export const MEMBERS_QUERY_KEYS = {
  all: ['members'] as const,
  lists: () => [...MEMBERS_QUERY_KEYS.all, 'list'] as const,
};

// Hook to fetch members
export const useMembers = () => {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEYS.lists(),
    queryFn: () => membersService.getMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
