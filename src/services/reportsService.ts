import api from '@/lib/api';
import { 
  WeeklyPayoutsResponse, 
  SupervisorFlowResponse, 
  DetailedLogsResponse,
  WeeklyPayoutFilters,
  SupervisorFlowFilters,
  DetailedLogsFilters
} from '@/types/reports';

export const reportsService = {
  // Fetch weekly payouts report
  getWeeklyPayouts: async (filters: WeeklyPayoutFilters): Promise<WeeklyPayoutsResponse> => {
    try {
      const params = new URLSearchParams({
        business_id: filters.business_id,
        start_date: filters.start_date,
        end_date: filters.end_date,
      });

      if (filters.site_id) {
        params.append('site_id', filters.site_id);
      }

      if (filters.supervisor_id) {
        params.append('supervisor_id', filters.supervisor_id);
      }

      const response = await api.get(`/reports/weekly-payouts?${params.toString()}`);
      const data = response.data;
      
      // Handle the structured response
      if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
        return {
          message: data.message || 'Weekly payouts fetched successfully',
          data: data.data
        };
      }
      
      throw new Error('Unexpected API response format');
      
    } catch (error: any) {
      console.error('Weekly Payouts API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch weekly payouts';
      
      throw new Error(errorMessage);
    }
  },

  // Fetch supervisor flow report
  getSupervisorFlow: async (filters: SupervisorFlowFilters): Promise<SupervisorFlowResponse> => {
    try {
      const params = new URLSearchParams({
        supervisor_id: filters.supervisor_id.toString(),
        start_date: filters.start_date,
      });

      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }

      const response = await api.get(`/reports/supervisor-flow?${params.toString()}`);
      const data = response.data;
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return {
          status: true,
          message: 'Supervisor flow fetched successfully',
          data: data
        };
      }
      
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          message: data.message || 'Supervisor flow fetched successfully',
          data: data.data || data.flow || data.activities || []
        };
      }
      
      return {
        status: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Supervisor Flow API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch supervisor flow';
      
      throw new Error(errorMessage);
    }
  },

  // Fetch detailed logs report
  getDetailedLogs: async (filters: DetailedLogsFilters): Promise<DetailedLogsResponse> => {
    try {
      const params = new URLSearchParams({
        business_id: filters.business_id.toString(),
        start_date: filters.start_date,
        end_date: filters.end_date,
      });

      if (filters.site_id) {
        params.append('site_id', filters.site_id.toString());
      }

      const response = await api.get(`/reports/detailed-logs?${params.toString()}`);
      const data = response.data;
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return {
          status: true,
          message: 'Detailed logs fetched successfully',
          data: data
        };
      }
      
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          message: data.message || 'Detailed logs fetched successfully',
          data: data.data || data.logs || data.entries || []
        };
      }
      
      return {
        status: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Detailed Logs API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch detailed logs';
      
      throw new Error(errorMessage);
    }
  }
};
