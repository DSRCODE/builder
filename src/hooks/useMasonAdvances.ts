import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masonAdvanceService } from '@/services/masonAdvanceService';
import { MasonAdvanceFormData, MasonAdvancesResponse, MasonAdvance } from '@/types/masonAdvance';
import { toast } from 'sonner';

// Query keys for consistent caching
export const MASON_ADVANCES_QUERY_KEYS = {
  all: ['masonAdvances'] as const,
  lists: () => [...MASON_ADVANCES_QUERY_KEYS.all, 'list'] as const,
  details: () => [...MASON_ADVANCES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...MASON_ADVANCES_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all mason advances
export const useMasonAdvances = () => {
  return useQuery({
    queryKey: MASON_ADVANCES_QUERY_KEYS.lists(),
    queryFn: masonAdvanceService.getMasonAdvances,
    staleTime: 2 * 60 * 1000, // 2 minutes (advances change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch single mason advance
export const useMasonAdvance = (id: number) => {
  return useQuery({
    queryKey: MASON_ADVANCES_QUERY_KEYS.detail(id),
    queryFn: () => masonAdvanceService.getMasonAdvanceById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook to create mason advance
export const useCreateMasonAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: masonAdvanceService.createMasonAdvance,
    onSuccess: (response) => {
      // Invalidate and refetch mason advances list
      queryClient.invalidateQueries({ queryKey: MASON_ADVANCES_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Mason advance created successfully');
      } else {
        toast.error(response.message || 'Failed to create mason advance');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create mason advance');
    },
  });
};

// Hook to update mason advance
export const useUpdateMasonAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MasonAdvanceFormData }) =>
      masonAdvanceService.updateMasonAdvance(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate the specific mason advance in cache
      queryClient.invalidateQueries({ queryKey: MASON_ADVANCES_QUERY_KEYS.detail(id) });
      
      // Invalidate and refetch mason advances list
      queryClient.invalidateQueries({ queryKey: MASON_ADVANCES_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Mason advance updated successfully');
      } else {
        toast.error(response.message || 'Failed to update mason advance');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update mason advance');
    },
  });
};

// Hook to delete mason advance
export const useDeleteMasonAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: masonAdvanceService.deleteMasonAdvance,
    onSuccess: (_, deletedId) => {
      // Remove the mason advance from list cache
      queryClient.setQueryData<MasonAdvancesResponse>(
        MASON_ADVANCES_QUERY_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((advance) => advance.id !== deletedId),
          };
        }
      );

      // Remove the specific mason advance from cache
      queryClient.removeQueries({ queryKey: MASON_ADVANCES_QUERY_KEYS.detail(deletedId) });

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: MASON_ADVANCES_QUERY_KEYS.lists() });
      
      toast.success('Mason advance deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete mason advance');
    },
  });
};
