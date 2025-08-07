import api from '@/lib/api';

export interface OwnerPaymentLog {
  id: number;
  owner_id: number;
  payment_date: string;
  amount: string; // Changed to string to match API
  notes: string; // Changed from description to notes
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OwnerPaymentLogsResponse {
  status: boolean;
  data: OwnerPaymentLog[];
}

export const ownerPaymentLogsService = {
  // Fetch owner payment logs by owner ID
  getOwnerPaymentLogs: async (ownerId: number): Promise<OwnerPaymentLogsResponse> => {
    try {
      console.log(`Fetching payment logs for owner ${ownerId}`);
      
      const response = await api.get(`/owners/${ownerId}/payments`);
      
      console.log('Owner Payment Logs Response:', response.data);
      
      // Handle the response structure
      const data = response.data;
      
      // If the API returns a structured response
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          data: data.data || data.payments || []
        };
      }
      
      // Fallback
      return {
        status: false,
        data: []
      };
      
    } catch (error: any) {
      console.error('Owner Payment Logs API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch owner payment logs';
      
      throw new Error(errorMessage);
    }
  },

  // Add a new owner payment log
  addOwnerPaymentLog: async (ownerId: number, paymentData: {
    payment_date: string;
    amount: string;
    notes: string;
  }): Promise<OwnerPaymentLog> => {
    try {
      console.log(`Adding payment log for owner ${ownerId}:`, paymentData);
      
      const response = await api.post(`/owners/${ownerId}/payments`, paymentData);
      
      console.log('Add Owner Payment Log Response:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.status && response.data.payment) {
        return response.data.payment;
      } else if (response.data.id) {
        return response.data;
      }
      
      // Fallback - return the response data as is
      return response.data;
      
    } catch (error: any) {
      console.error('Add Owner Payment Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to add owner payment log';
      
      throw new Error(errorMessage);
    }
  },

  // Update an owner payment log
  updateOwnerPaymentLog: async (ownerId: number, paymentId: number, paymentData: {
    payment_date: string;
    amount: string;
    notes: string;
  }): Promise<OwnerPaymentLog> => {
    try {
      console.log(`Updating payment log ${paymentId}:`, paymentData);
      
      // Use the specific endpoint structure for editing: /owners/payments/{paymentId}
      const response = await api.post(`/owners/payments/${paymentId}`, paymentData);
      
      console.log('Update Owner Payment Log Response:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.status && response.data.payment) {
        return response.data.payment;
      } else if (response.data.id) {
        return response.data;
      }
      
      // Fallback - return the response data as is
      return response.data;
      
    } catch (error: any) {
      console.error('Update Owner Payment Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update owner payment log';
      
      throw new Error(errorMessage);
    }
  },

  // Delete an owner payment log
  deleteOwnerPaymentLog: async (ownerId: number, paymentId: number): Promise<void> => {
    try {
      console.log(`Deleting payment log ${paymentId}`);
      
      // Use the specific endpoint structure for deleting: /owners/payments-delete/{paymentId}
      const response = await api.post(`/owners/payments-delete/${paymentId}`);
      
      console.log('Delete Owner Payment Log Response:', response.data);
      
    } catch (error: any) {
      console.error('Delete Owner Payment Log API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete owner payment log';
      
      throw new Error(errorMessage);
    }
  }
};
