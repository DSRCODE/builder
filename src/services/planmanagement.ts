import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1️⃣ Fetch user plan data
export const useUserPlanData = () => {
  return useQuery({
    queryKey: ["userPlanData"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

// 3️⃣ Update plan settings (POST with form data)
export const useUpdatePlanSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: {
      no_of_days: number;
      no_of_sites: number;
      no_of_users: number;
    }) => {
      const res = await api.post("/plan-settings", formData);
      return res.data;
    },
    onSuccess: () => {
      // Refresh the plan settings after update
      queryClient.invalidateQueries({ queryKey: ["userPlanData"] });
    },
  });
};

/// 4 Update Key & Mode settings
export const useUpdateKeysAndMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: {
      site_key: string;
      secret_key: string;
      mode: string;
    }) => api.post("/settings", formData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPlanData"] });
    },
  });
};

// 1️⃣ Fetch user subscription plan data
export const useUserSubscriptionFreePlanData = () => {
  return useQuery({
    queryKey: ["userSubPlanData"],
    queryFn: async () => {
      const res = await api.get("/user-subscriptions");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
