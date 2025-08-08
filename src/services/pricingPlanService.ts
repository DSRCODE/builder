import api from "@/lib/api";
import {
  PricingPlan,
  PricingPlansResponse,
  PricingPlanFormData,
  PricingPlanApiResponse,
} from "@/types/pricingPlan";

export const pricingPlanService = {
  // Fetch all pricing plans
  getPricingPlans: async (): Promise<PricingPlansResponse> => {
    try {
      const response = await api.get("/package");
      const data = response.data;

      if (
        data &&
        typeof data === "object" &&
        "status" in data &&
        "data" in data
      ) {
        return {
          status: data.status,
          message: data.message || "Pricing plans fetched successfully",
          data: data.data || [],
        };
      }

      return {
        status: false,
        message: "Unexpected API response format",
        data: [],
      };
    } catch (error: any) {
      console.error("Pricing Plans API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch pricing plans";
      throw new Error(errorMessage);
    }
  },

  // Fetch single pricing plan by ID
  getPricingPlanById: async (id: number): Promise<PricingPlan> => {
    try {
      const response = await api.get(`/package/${id}`);
      const data = response.data;

      if (data && data.status && data.data) {
        return data.data;
      }

      throw new Error("Invalid pricing plan data received");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch pricing plan";
      throw new Error(errorMessage);
    }
  },

  // Create new pricing plan
  createPricingPlan: async (
    pricingPlan: PricingPlanFormData
  ): Promise<PricingPlanApiResponse> => {
    try {
      const response = await api.post("/package", pricingPlan);
      const data = response.data;

      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || "Pricing plan created successfully",
        data: data.data || data,
      };
    } catch (error: any) {
      console.error("Create Pricing Plan API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create pricing plan";
      throw new Error(errorMessage);
    }
  },

  // Update pricing plan (POST method for update as per API)
  updatePricingPlan: async (
    id: number,
    pricingPlan: PricingPlanFormData
  ): Promise<PricingPlanApiResponse> => {
    try {
      const response = await api.post(`/package/${id}`, pricingPlan);
      const data = response.data;

      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || "Pricing plan updated successfully",
        data: data.data || data,
      };
    } catch (error: any) {
      console.error("Update Pricing Plan API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update pricing plan";
      throw new Error(errorMessage);
    }
  },

  // Delete pricing plan
  deletePricingPlan: async (id: number): Promise<void> => {
    try {
      await api.delete(`/package/${id}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete pricing plan";
      throw new Error(errorMessage);
    }
  },
};
