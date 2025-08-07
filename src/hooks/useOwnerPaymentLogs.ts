import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerPaymentLogsService, OwnerPaymentLog } from '@/services/ownerPaymentLogsService';

// Hook to fetch owner payment logs
export const useOwnerPaymentLogs = (ownerId: number) => {
  return useQuery({
    queryKey: ['owner-payment-logs', ownerId],
    queryFn: () => ownerPaymentLogsService.getOwnerPaymentLogs(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to add owner payment log
export const useAddOwnerPaymentLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, paymentData }: {
      ownerId: number;
      paymentData: {
        payment_date: string;
        amount: string;
        notes: string;
      };
    }) => ownerPaymentLogsService.addOwnerPaymentLog(ownerId, paymentData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner payment logs
      queryClient.invalidateQueries({ queryKey: ['owner-payment-logs', variables.ownerId] });
    },
  });
};

// Hook to update owner payment log
export const useUpdateOwnerPaymentLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, paymentId, paymentData }: {
      ownerId: number;
      paymentId: number;
      paymentData: {
        payment_date: string;
        amount: string;
        notes: string;
      };
    }) => ownerPaymentLogsService.updateOwnerPaymentLog(ownerId, paymentId, paymentData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner payment logs
      queryClient.invalidateQueries({ queryKey: ['owner-payment-logs', variables.ownerId] });
    },
  });
};

// Hook to delete owner payment log
export const useDeleteOwnerPaymentLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, paymentId }: {
      ownerId: number;
      paymentId: number;
    }) => ownerPaymentLogsService.deleteOwnerPaymentLog(ownerId, paymentId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch owner payment logs
      queryClient.invalidateQueries({ queryKey: ['owner-payment-logs', variables.ownerId] });
    },
  });
};
