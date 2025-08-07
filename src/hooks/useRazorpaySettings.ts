import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { razorpaySettingsService, RazorpaySettings } from '@/services/razorpaySettingsService';

// Hook to fetch Razorpay settings
export const useRazorpaySettings = () => {
  return useQuery({
    queryKey: ['razorpay-settings'],
    queryFn: () => razorpaySettingsService.getRazorpaySettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to update Razorpay settings
export const useUpdateRazorpaySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: RazorpaySettings) => razorpaySettingsService.updateRazorpaySettings(settings),
    onSuccess: () => {
      // Invalidate and refetch Razorpay settings
      queryClient.invalidateQueries({ queryKey: ['razorpay-settings'] });
    },
  });
};
