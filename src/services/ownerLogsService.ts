import api from '@/lib/api';

export interface OwnerLog {
  id: number;
  owner_id: number;
  log_date: string;
  type: string;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OwnerLogsResponse {
  status: boolean;
  data: OwnerLog[];
}

export const ownerLogsService = {
  // Fetch owner logs by owner ID
  getOwnerLogs: async (ownerId: number): Promise<OwnerLogsResponse> => {
    try {
      const response = await api.get(`/owners/${ownerId}/logs`);
      
      // Handle the response structure
      const data = response.data;
      
      // If the API returns a structured response
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          data: data.data || []
        };
      }
      
      // Fallback
      return {
        status: false,
        data: []
      };
      
    } catch (error: any) {
      console.error('Owner Logs API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch owner logs';
      
      throw new Error(errorMessage);
    }
  },

  // Add a new owner log
  addOwnerLog: async (ownerId: number, logData: {
    log_date: string;
    type: string;
    notes: string;
  }): Promise<OwnerLog> => {
    try {
      console.log(`Adding owner log for owner ${ownerId}:`, logData);
      
      const response = await api.post(`/owners/${ownerId}/logs`, logData);
      
      console.log('Add Owner Log Response:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.status && response.data.log) {
        return response.data.log;
      } else if (response.data.id) {
        return response.data;
      }
      
      // Fallback - return the response data as is
      return response.data;
      
    } catch (error: any) {
      console.error('Add Owner Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to add owner log';
      
      throw new Error(errorMessage);
    }
  },

  // Update an owner log
  updateOwnerLog: async (ownerId: number, logId: number, logData: {
    log_date: string;
    type: string;
    notes: string;
  }): Promise<OwnerLog> => {
    try {
      console.log(`Updating owner log ${logId}:`, logData);
      
      // Use the specific endpoint structure for editing: /owners/logs/{logId}
      const response = await api.post(`/owners/logs/${logId}`, logData);
      
      console.log('Update Owner Log Response:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.status && response.data.log) {
        return response.data.log;
      } else if (response.data.id) {
        return response.data;
      }
      
      // Fallback - return the response data as is
      return response.data;
      
    } catch (error: any) {
      console.error('Update Owner Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update owner log';
      
      throw new Error(errorMessage);
    }
  },

  // Delete an owner log
  deleteOwnerLog: async (ownerId: number, logId: number): Promise<void> => {
    try {
      console.log(`Deleting owner log ${logId}`);
      
      // Use the specific endpoint structure for deleting: /owners/logs-delete/{logId}
      const response = await api.post(`/owners/logs-delete/${logId}`);
      
      console.log('Delete Owner Log Response:', response.data);
      
    } catch (error: any) {
      console.error('Delete Owner Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete owner log';
      
      throw new Error(errorMessage);
    }
  }
};
