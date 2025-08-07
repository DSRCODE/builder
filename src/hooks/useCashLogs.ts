import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cashLogsService, CashLogRequest } from '@/services/cashLogsService';
import { toast } from 'sonner';

// Hook to create a cash log entry
export const useCashLogs = () => {
  const queryClient = useQueryClient();

  const createCashLogMutation = useMutation({
    mutationFn: (cashLogData: CashLogRequest) => cashLogsService.createCashLog(cashLogData),
    onSuccess: (data) => {
      toast.success(data.message || 'Cash log created successfully');
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['cashLogs'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create cash log: ${error.message}`);
    },
  });

  return {
    createCashLog: createCashLogMutation.mutate,
    isCreating: createCashLogMutation.isPending,
    error: createCashLogMutation.error,
    isSuccess: createCashLogMutation.isSuccess,
    reset: createCashLogMutation.reset,
  };
};
