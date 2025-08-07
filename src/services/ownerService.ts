import api from '@/lib/api';
import { Owner, OwnersResponse, OwnerFormData, OwnerApiResponse } from '@/types/owner';

export const ownerService = {
  // Fetch all owners
  getOwners: async (): Promise<OwnersResponse> => {
    try {
      const response = await api.get('/owners');
      
      // Handle the response structure
      const data = response.data;
      
      // If the API returns data directly as an array
      if (Array.isArray(data)) {
        return {
          status: true,
          message: 'Owners fetched successfully',
          data: data
        };
      }
      
      // If the API returns a structured response
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          message: data.message || 'Owners fetched successfully',
          data: data.data || data.owners || data.items || []
        };
      }
      
      // Fallback
      return {
        status: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Owners API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch owners';
      
      throw new Error(errorMessage);
    }
  },

  // Fetch single owner by ID
  getOwnerById: async (id: number): Promise<Owner> => {
    try {
      const response = await api.get(`/owners/${id}`);
      const data = response.data;
      
      // Handle the response structure
      if (data && data.status && data.data) {
        return data.data;
      }
      
      // Handle direct owner object response
      if (data && typeof data === 'object' && 'id' in data) {
        return data;
      }
      
      throw new Error('Invalid owner data received');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch owner';
      throw new Error(errorMessage);
    }
  },

  // Create new owner
  createOwner: async (owner: OwnerFormData): Promise<OwnerApiResponse> => {
    try {
      const response = await api.post('/owners', owner);
      
      // Handle the response structure
      const data = response.data;
      
      // Return the response data
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Owner created successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Create Owner API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create owner';
      
      throw new Error(errorMessage);
    }
  },

  // Update owner - Using POST method as required by API pattern
  updateOwner: async (id: number, owner: OwnerFormData): Promise<OwnerApiResponse> => {
    try {
      // Try POST with _method parameter first (Laravel style)
      const updateData = {
        ...owner,
        _method: 'PUT'
      };
      
      const response = await api.post(`/owners/${id}`, updateData);
      
      // Handle the response structure
      const data = response.data;
      
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Owner updated successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Update Owner API Error:', error);
      
      // If the _method approach fails, try without it
      if (error.response?.status === 422 || error.response?.status === 405) {
        try {
          const response = await api.post(`/owners/${id}`, owner);
          const data = response.data;
          
          return {
            status: data.status !== undefined ? data.status : true,
            message: data.message || 'Owner updated successfully',
            data: data.data || data
          };
        } catch (fallbackError: any) {
          console.error('Fallback Update Error:', fallbackError);
        }
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update owner';
      
      throw new Error(errorMessage);
    }
  },

  // Delete owner - Using POST method with /delete/{id} endpoint
  deleteOwner: async (id: number): Promise<void> => {
    try {
      await api.post(`/owners/delete/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete owner';
      throw new Error(errorMessage);
    }
  }
};
