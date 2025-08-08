import api from "@/lib/api";
import {
  MasonAdvance,
  MasonAdvancesResponse,
  MasonAdvanceFormData,
  MasonAdvanceApiResponse,
} from "@/types/masonAdvance";

export const masonAdvanceService = {
  // Fetch all mason advances
  getMasonAdvances: async (): Promise<MasonAdvancesResponse> => {
    try {
      const response = await api.get("/mason-advances");

      // Handle the response structure
      const data = response.data;

      // Validate the response structure - API uses 'status' field
      if (
        data &&
        typeof data === "object" &&
        "status" in data &&
        "data" in data
      ) {
        return {
          status: data.status,
          message: data.message || "Mason advances fetched successfully",
          data: data.data || [],
        };
      }

      // Fallback for unexpected structure
      return {
        status: false,
        message: "Unexpected API response format",
        data: [],
      };
    } catch (error: any) {
      console.error("Mason Advances API Error:", error);

      // Provide more detailed error information
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch mason advances";

      throw new Error(errorMessage);
    }
  },

  // Fetch single mason advance by ID
  getMasonAdvanceById: async (id: number): Promise<MasonAdvance> => {
    try {
      const response = await api.get(`/mason-advances/${id}`);
      const data = response.data;

      // Handle the response structure
      if (data && data.status && data.data) {
        return data.data;
      }

      throw new Error("Invalid mason advance data received");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch mason advance";
      throw new Error(errorMessage);
    }
  },

  // Create new mason advance
  createMasonAdvance: async (
    masonAdvance: MasonAdvanceFormData
  ): Promise<MasonAdvanceApiResponse> => {
    try {
      const response = await api.post("/mason-advances", masonAdvance);

      // Handle the response structure
      const data = response.data;

      // Return the response data
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || "Mason advance created successfully",
        data: data.data || data,
      };
    } catch (error: any) {
      console.error("Create Mason Advance API Error:", error);

      // Provide more detailed error information
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create mason advance";

      throw new Error(errorMessage);
    }
  },

  // Update mason advance - Using POST method as required by API pattern
  updateMasonAdvance: async (
    id: number,
    masonAdvance: MasonAdvanceFormData
  ): Promise<MasonAdvanceApiResponse> => {
    try {
      // Try POST with _method parameter first (Laravel style)
      const updateData = {
        ...masonAdvance,
        _method: "PUT",
      };

      const response = await api.post(`/mason-advances/${id}`, updateData);

      // Handle the response structure
      const data = response.data;

      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || "Mason advance updated successfully",
        data: data.data || data,
      };
    } catch (error: any) {
      console.error("Update Mason Advance API Error:", error);

      // If the _method approach fails, try without it
      if (error.response?.status === 422 || error.response?.status === 405) {
        try {
          const response = await api.post(
            `/mason-advances/${id}`,
            masonAdvance
          );
          const data = response.data;

          return {
            status: data.status !== undefined ? data.status : true,
            message: data.message || "Mason advance updated successfully",
            data: data.data || data,
          };
        } catch (fallbackError: any) {
          console.error("Fallback Update Error:", fallbackError);
        }
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update mason advance";

      throw new Error(errorMessage);
    }
  },

  // Delete mason advance - Using POST method with /delete/{id} endpoint
  deleteMasonAdvance: async (id: number): Promise<void> => {
    try {
      await api.post(`/mason-advances/delete/${id}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete mason advance";
      throw new Error(errorMessage);
    }
  },

  // Toggle
  toggleStatus: async (id: number) => {
    const { data } = await api.post(`/mason-advances/status/${id}`);
    return data;
  },
};
