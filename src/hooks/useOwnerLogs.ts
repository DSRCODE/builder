import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerLogsService, OwnerLog } from '@/services/ownerLogsService';

// Hook to fetch owner logs
export const useOwnerLogs = (ownerId: number) => {
  return useQuery({
    queryKey: ['owner-logs', ownerId],
    queryFn: () => ownerLogsService.getOwnerLogs(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to add owner log
export const useAddOwnerLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, logData }: {
      ownerId: number;
      logData: {
        log_date: string;
        type: string;
        notes: string;
      };
    }) => ownerLogsService.addOwnerLog(ownerId, logData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner logs
      queryClient.invalidateQueries({ queryKey: ['owner-logs', variables.ownerId] });
    },
  });
};

// Hook to update owner log
export const useUpdateOwnerLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, logId, logData }: {
      ownerId: number;
      logId: number;
      logData: {
        log_date: string;
        type: string;
        notes: string;
      };
    }) => ownerLogsService.updateOwnerLog(ownerId, logId, logData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner logs
      queryClient.invalidateQueries({ queryKey: ['owner-logs', variables.ownerId] });
    },
  });
};

// Hook to delete owner log
export const useDeleteOwnerLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, logId }: {
      ownerId: number;
      logId: number;
    }) => ownerLogsService.deleteOwnerLog(ownerId, logId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner logs
      queryClient.invalidateQueries({ queryKey: ['owner-logs', variables.ownerId] });
    },
  });
};
