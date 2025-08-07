import api from '@/lib/api';
import { ConstructionSitesResponse } from '@/types/laborEntry';

export const constructionSitesService = {
  // Fetch all construction sites
  getConstructionSites: async (): Promise<ConstructionSitesResponse> => {
    try {
      const response = await api.get('/construction-sites');
      
      // The API returns the exact structure we need
      const data = response.data;
      
      // Validate the response structure
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        return {
          success: data.success,
          message: data.message || 'Construction sites fetched successfully',
          data: data.data || []
        };
      }
      
      // Fallback for unexpected structure
      return {
        success: false,
        message: 'Unexpected API response format',
        data: []
      };
      
    } catch (error: any) {
      console.error('Construction Sites API Error:', error);
      
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch construction sites';
      
      throw new Error(errorMessage);
    }
  }
};
