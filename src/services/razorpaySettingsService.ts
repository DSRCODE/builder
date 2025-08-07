import api from '@/lib/api';

export interface RazorpaySettings {
  site_key: string;
  secret_key: string;
  mode: string;
}

export interface RazorpaySettingsResponse {
  status: boolean;
  data: RazorpaySettings;
}

export const razorpaySettingsService = {
  // Get Razorpay settings
  getRazorpaySettings: async (): Promise<RazorpaySettingsResponse> => {
    try {
      console.log('Fetching Razorpay settings');
      
      const response = await api.get('/settings');
      
      console.log('Razorpay Settings Response:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Get Razorpay Settings API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch Razorpay settings';
      
      throw new Error(errorMessage);
    }
  },

  // Update Razorpay settings
  updateRazorpaySettings: async (settings: RazorpaySettings): Promise<RazorpaySettingsResponse> => {
    try {
      console.log('Updating Razorpay settings:', settings);
      
      const response = await api.post('/settings', settings);
      
      console.log('Update Razorpay Settings Response:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Update Razorpay Settings API Error:', error);
      console.error('Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update Razorpay settings';
      
      throw new Error(errorMessage);
    }
  }
};
