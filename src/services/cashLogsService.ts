import api from '@/lib/api';

export interface CashLogRequest {
  user_id: string;
  site_id: string;
  date: string;
  amount: string;
}

export interface CashLogResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const cashLogsService = {
  // Create a new cash log entry
  createCashLog: async (cashLogData: CashLogRequest): Promise<CashLogResponse> => {
    try {
      const response = await api.post('/cash-logs', cashLogData);
      
      return {
        success: true,
        message: response.data.message || 'Cash log created successfully',
        data: response.data.data
      };
      
    } catch (error: any) {
      console.error('Cash Logs API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create cash log';
      
      throw new Error(errorMessage);
    }
  }
};
