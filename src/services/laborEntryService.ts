import api from '@/lib/api';
import { LaborEntryFormData, LaborEntryResponse, LaborEntriesResponse, LaborEntry } from '@/types/laborEntry';

export const laborEntryService = {
  // Fetch all labor entries
  getLaborEntries: async (): Promise<LaborEntriesResponse> => {
    try {
      const response = await api.get('/labor-entries');
      
      // Handle the response structure
      const data = response.data;
      
      // Validate the response structure - API uses 'status' instead of 'success'
      if (data && typeof data === 'object' && 'status' in data && 'data' in data) {
        return {
          status: data.status,
          message: data.message || 'Labor entries fetched successfully',
          data: data.data || []
        };
      }
      
      // Fallback for unexpected structure
      return {
        status: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Labor Entries API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch labor entries';
      
      throw new Error(errorMessage);
    }
  },

  // Fetch single labor entry by ID
  getLaborEntryById: async (id: number): Promise<LaborEntry> => {
    try {
      const response = await api.get(`/labor-entries/${id}`);
      const data = response.data;
      
      // Handle the response structure
      if (data && data.status && data.data) {
        return data.data;
      }
      
      throw new Error('Invalid labor entry data received');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch labor entry';
      throw new Error(errorMessage);
    }
  },

  // Create new labor entry
  createLaborEntry: async (laborEntry: LaborEntryFormData): Promise<LaborEntryResponse> => {
    try {
      const response = await api.post('/labor-entries', laborEntry);
      
      // Handle the response structure
      const data = response.data;
      
      // Return the response data - API uses 'status' instead of 'success'
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Labor entry created successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Labor Entry API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create labor entry';
      
      throw new Error(errorMessage);
    }
  },

  // Update labor entry - Using POST method as PUT is not supported
  // Some APIs require _method parameter for Laravel-style method spoofing
  updateLaborEntry: async (id: number, laborEntry: LaborEntryFormData): Promise<LaborEntryResponse> => {
    try {
      // Try POST with _method parameter first (Laravel style)
      const updateData = {
        ...laborEntry,
        _method: 'PUT'
      };
      
      const response = await api.post(`/labor-entries/${id}`, updateData);
      
      // Handle the response structure
      const data = response.data;
      
      // Return the response data - API uses 'status' instead of 'success'
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Labor entry updated successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Update Labor Entry API Error:', error);
      
      // If the _method approach fails, try without it
      if (error.response?.status === 422 || error.response?.status === 405) {
        try {
          const response = await api.post(`/labor-entries/${id}`, laborEntry);
          const data = response.data;
          
          return {
            status: data.status !== undefined ? data.status : true,
            message: data.message || 'Labor entry updated successfully',
            data: data.data || data
          };
        } catch (fallbackError: any) {
          console.error('Fallback Update Error:', fallbackError);
        }
      }
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update labor entry';
      
      throw new Error(errorMessage);
    }
  },

  // Delete labor entry - Using POST method with /delete/{id} endpoint
  deleteLaborEntry: async (id: number): Promise<void> => {
    try {
      await api.post(`/labor-entries/delete/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete labor entry';
      throw new Error(errorMessage);
    }
  }
};
