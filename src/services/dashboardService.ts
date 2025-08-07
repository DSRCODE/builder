import api from '@/lib/api';
import { DashboardResponse } from '@/types/dashboard';

export const dashboardService = {
  // Fetch dashboard data
  getDashboardData: async (): Promise<DashboardResponse> => {
    try {
      const response = await api.get('/dashboard');
      
      // Handle the response structure
      const data = response.data;
      
      // Validate the response structure
      if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
        return {
          message: data.message || 'Dashboard data retrieved successfully',
          data: data.data
        };
      }
      
      // Fallback for unexpected structure
      throw new Error('Unexpected API response format');
      
    } catch (error: any) {
      console.error('Dashboard API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch dashboard data';
      
      throw new Error(errorMessage);
    }
  }
};
