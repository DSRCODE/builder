import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingPlanService } from "@/services/pricingPlanService";
import {
  PricingPlanFormData,
  PricingPlansResponse,
  PricingPlan,
} from "@/types/pricingPlan";
import { toast } from "sonner";

// Query keys
export const PRICING_PLAN_QUERY_KEYS = {
  all: ["pricingPlans"] as const,
  lists: () => [...PRICING_PLAN_QUERY_KEYS.all, "list"] as const,
  details: () => [...PRICING_PLAN_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PRICING_PLAN_QUERY_KEYS.details(), id] as const,
};

// Fetch all pricing plans
export const usePricingPlans = () => {
  return useQuery({
    queryKey: PRICING_PLAN_QUERY_KEYS.lists(),
    queryFn: pricingPlanService.getPricingPlans,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

// Fetch single pricing plan
export const usePricingPlan = (id: number) => {
  return useQuery({
    queryKey: PRICING_PLAN_QUERY_KEYS.detail(id),
    queryFn: () => pricingPlanService.getPricingPlanById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Create pricing plan
export const useCreatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pricingPlanService.createPricingPlan,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: PRICING_PLAN_QUERY_KEYS.lists(),
      });
      response.status
        ? toast.success(response.message || "Pricing plan created successfully")
        : toast.error(response.message || "Failed to create pricing plan");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create pricing plan");
    },
  });
};

// Update pricing plan
export const useUpdatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PricingPlanFormData }) =>
      pricingPlanService.updatePricingPlan(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({
        queryKey: PRICING_PLAN_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: PRICING_PLAN_QUERY_KEYS.lists(),
      });
      response.status
        ? toast.success(response.message || "Pricing plan updated successfully")
        : toast.error(response.message || "Failed to update pricing plan");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update pricing plan");
    },
  });
};

// Delete pricing plan
export const useDeletePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pricingPlanService.deletePricingPlan,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<PricingPlansResponse>(
        PRICING_PLAN_QUERY_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((plan:any) => plan.id !== deletedId),
          };
        }
      );
      queryClient.removeQueries({
        queryKey: PRICING_PLAN_QUERY_KEYS.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: PRICING_PLAN_QUERY_KEYS.lists(),
      });
      toast.success("Pricing plan deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete pricing plan");
    },
  });
};
