import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { laborEntryService } from '@/services/laborEntryService';
import { LaborEntryFormData, LaborEntriesResponse, LaborEntry } from '@/types/laborEntry';
import { toast } from 'sonner';

// Query keys for consistent caching
export const LABOR_ENTRIES_QUERY_KEYS = {
  all: ['laborEntries'] as const,
  lists: () => [...LABOR_ENTRIES_QUERY_KEYS.all, 'list'] as const,
  details: () => [...LABOR_ENTRIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...LABOR_ENTRIES_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all labor entries
export const useLaborEntries = () => {
  return useQuery({
    queryKey: LABOR_ENTRIES_QUERY_KEYS.lists(),
    queryFn: laborEntryService.getLaborEntries,
    staleTime: 2 * 60 * 1000, // 2 minutes (labor entries change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch single labor entry
export const useLaborEntry = (id: number) => {
  return useQuery({
    queryKey: LABOR_ENTRIES_QUERY_KEYS.detail(id),
    queryFn: () => laborEntryService.getLaborEntryById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook to create labor entry
export const useCreateLaborEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: laborEntryService.createLaborEntry,
    onSuccess: (response) => {
      // Invalidate and refetch labor entries list
      queryClient.invalidateQueries({ queryKey: LABOR_ENTRIES_QUERY_KEYS.lists() });
      
      // API uses 'status' instead of 'success'
      if (response.status) {
        toast.success(response.message || 'Labor entry created successfully');
      } else {
        toast.error(response.message || 'Failed to create labor entry');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create labor entry');
    },
  });
};

// Hook to update labor entry
export const useUpdateLaborEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LaborEntryFormData }) =>
      laborEntryService.updateLaborEntry(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate the specific labor entry in cache
      queryClient.invalidateQueries({ queryKey: LABOR_ENTRIES_QUERY_KEYS.detail(id) });
      
      // Invalidate and refetch labor entries list
      queryClient.invalidateQueries({ queryKey: LABOR_ENTRIES_QUERY_KEYS.lists() });
      
      // API uses 'status' instead of 'success'
      if (response.status) {
        toast.success(response.message || 'Labor entry updated successfully');
      } else {
        toast.error(response.message || 'Failed to update labor entry');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update labor entry');
    },
  });
};

// Hook to delete labor entry
export const useDeleteLaborEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: laborEntryService.deleteLaborEntry,
    onSuccess: (_, deletedId) => {
      // Remove the labor entry from list cache
      queryClient.setQueryData<LaborEntriesResponse>(
        LABOR_ENTRIES_QUERY_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((entry) => entry.id !== deletedId),
          };
        }
      );

      // Remove the specific labor entry from cache
      queryClient.removeQueries({ queryKey: LABOR_ENTRIES_QUERY_KEYS.detail(deletedId) });

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: LABOR_ENTRIES_QUERY_KEYS.lists() });
      
      toast.success('Labor entry deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete labor entry');
    },
  });
};
