import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerService } from '@/services/ownerService';
import { OwnerFormData, OwnersResponse, Owner } from '@/types/owner';
import { toast } from 'sonner';

// Query keys for consistent caching
export const OWNERS_QUERY_KEYS = {
  all: ['owners'] as const,
  lists: () => [...OWNERS_QUERY_KEYS.all, 'list'] as const,
  details: () => [...OWNERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...OWNERS_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all owners
export const useOwners = () => {
  return useQuery({
    queryKey: OWNERS_QUERY_KEYS.lists(),
    queryFn: ownerService.getOwners,
    staleTime: 5 * 60 * 1000, // 5 minutes (owner data doesn't change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch single owner
export const useOwner = (id: number) => {
  return useQuery({
    queryKey: OWNERS_QUERY_KEYS.detail(id),
    queryFn: () => ownerService.getOwnerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create owner
export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerService.createOwner,
    onSuccess: (response) => {
      // Invalidate and refetch owners list
      queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Owner created successfully');
      } else {
        toast.error(response.message || 'Failed to create owner');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create owner');
    },
  });
};

// Hook to update owner
export const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OwnerFormData }) =>
      ownerService.updateOwner(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate the specific owner in cache
      queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEYS.detail(id) });
      
      // Invalidate and refetch owners list
      queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Owner updated successfully');
      } else {
        toast.error(response.message || 'Failed to update owner');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update owner');
    },
  });
};

// Hook to delete owner
export const useDeleteOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerService.deleteOwner,
    onSuccess: (_, deletedId) => {
      // Remove the owner from list cache
      queryClient.setQueryData<OwnersResponse>(
        OWNERS_QUERY_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((owner) => owner.id !== deletedId),
          };
        }
      );

      // Remove the specific owner from cache
      queryClient.removeQueries({ queryKey: OWNERS_QUERY_KEYS.detail(deletedId) });

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEYS.lists() });
      
      toast.success('Owner deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete owner');
    },
  });
};
