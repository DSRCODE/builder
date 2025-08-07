import api from '@/lib/api';
import { Material, MaterialsResponse, MaterialFormData, MaterialApiResponse } from '@/types/material';

export const materialService = {
  // Fetch all materials
  getMaterials: async (): Promise<MaterialsResponse> => {
    try {
      const response = await api.get('/materials');
      
      // Handle different possible API response structures
      const data = response.data;
      
      // If the API returns data directly as an array
      if (Array.isArray(data)) {
        return {
          status: true,
          message: 'Materials fetched successfully',
          data: data
        };
      }
      
      // If the API returns a structured response
      if (data && typeof data === 'object') {
        return {
          status: data.status !== undefined ? data.status : true,
          message: data.message || 'Materials fetched successfully',
          data: data.data || data.materials || data.items || []
        };
      }
      
      // Fallback
      return {
        status: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Materials API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch materials';
      
      throw new Error(errorMessage);
    }
  },

  // Create new material
  createMaterial: async (material: MaterialFormData): Promise<MaterialApiResponse> => {
    try {
      const response = await api.post('/materials', material);
      
      // Handle the response structure
      const data = response.data;
      
      // Return the response data
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Material created successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Create Material API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create material';
      
      throw new Error(errorMessage);
    }
  },

  // Fetch material by ID
  getMaterialById: async (id: number): Promise<Material> => {
    try {
      const response = await api.get(`/materials/${id}`);
      const data = response.data;
      
      // Handle different response structures
      if (data && typeof data === 'object') {
        return data.data || data.material || data;
      }
      
      throw new Error('Invalid material data received');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch material';
      throw new Error(errorMessage);
    }
  },

  // Update material - Using POST method as required by API
  updateMaterial: async (id: number, material: MaterialFormData): Promise<MaterialApiResponse> => {
    try {
      // Try POST with _method parameter first (Laravel style)
      const updateData = {
        ...material,
        _method: 'PUT'
      };
      
      const response = await api.post(`/materials/${id}`, updateData);
      
      // Handle the response structure
      const data = response.data;
      
      return {
        status: data.status !== undefined ? data.status : true,
        message: data.message || 'Material updated successfully',
        data: data.data || data
      };
      
    } catch (error: any) {
      console.error('Update Material API Error:', error);
      
      // If the _method approach fails, try without it
      if (error.response?.status === 422 || error.response?.status === 405) {
        try {
          const response = await api.post(`/materials/${id}`, material);
          const data = response.data;
          
          return {
            status: data.status !== undefined ? data.status : true,
            message: data.message || 'Material updated successfully',
            data: data.data || data
          };
        } catch (fallbackError: any) {
          console.error('Fallback Update Error:', fallbackError);
        }
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update material';
      throw new Error(errorMessage);
    }
  },

  // Delete material - Using POST method with /delete/{id} endpoint
  deleteMaterial: async (id: number): Promise<void> => {
    try {
      await api.post(`/materials/delete/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete material';
      throw new Error(errorMessage);
    }
  }
};
