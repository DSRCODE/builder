import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '@/services/materialService';
import { Material, MaterialsResponse, MaterialFormData } from '@/types/material';
import { toast } from 'sonner';

// Query keys for consistent caching
export const MATERIALS_QUERY_KEYS = {
  all: ['materials'] as const,
  lists: () => [...MATERIALS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...MATERIALS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...MATERIALS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...MATERIALS_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all materials
export const useMaterials = () => {
  return useQuery({
    queryKey: MATERIALS_QUERY_KEYS.lists(),
    queryFn: materialService.getMaterials,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch single material
export const useMaterial = (id: number) => {
  return useQuery({
    queryKey: MATERIALS_QUERY_KEYS.detail(id),
    queryFn: () => materialService.getMaterialById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialService.createMaterial,
    onSuccess: (response) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Material created successfully');
      } else {
        toast.error(response.message || 'Failed to create material');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create material');
    },
  });
};

// Hook to update material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MaterialFormData }) =>
      materialService.updateMaterial(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate the specific material in cache
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.detail(id) });
      
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEYS.lists() });
      
      // Show success/error message based on API response
      if (response.status) {
        toast.success(response.message || 'Material updated successfully');
      } else {
        toast.error(response.message || 'Failed to update material');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update material');
    },
  });
};

// Hook to delete material
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialService.deleteMaterial,
    onSuccess: (_, deletedId) => {
      // Remove the material from list cache
      queryClient.setQueryData<MaterialsResponse>(
        MATERIALS_QUERY_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((material) => material.id !== deletedId),
          };
        }
      );

      // Remove the specific material from cache
      queryClient.removeQueries({ queryKey: MATERIALS_QUERY_KEYS.detail(deletedId) });
      
      toast.success('Material deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete material');
    },
  });
};
