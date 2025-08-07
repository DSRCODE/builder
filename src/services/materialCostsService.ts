import api from '@/lib/api';

export interface MaterialCostsFilters {
  business_id: string;
  site_id?: string | null;
  start_date: string;
  end_date: string;
  supervisor_id?: string | null;
}

export interface Business {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Site {
  id: number;
  business_id: number;
  user_id: number | null;
  site_name: string;
  address: string;
  currency: string;
  estimated_budget: string;
  location: string;
  progress: number;
  total_spent: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialItem {
  id: number;
  site_id: number;
  material_name: string;
  category_id: number;
  quantity: string;
  unit: string;
  amount_spent: string;
  date_added: string;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface MaterialCostsByCategory {
  category_name: string;
  total_spent: number;
  items: MaterialItem[];
}

export interface MaterialCostsResponse {
  message: string;
  data: {
    filters: MaterialCostsFilters;
    businesses: Business[];
    sites: Site[];
    categories: MaterialCostsByCategory[];
    total_spent: number;
  };
}

export const materialCostsService = {
  // Fetch material costs report
  getMaterialCosts: async (params: {
    business_id: string;
    start_date: string;
    end_date: string;
    site_id?: string;
  }): Promise<MaterialCostsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        business_id: params.business_id,
        start_date: params.start_date,
        end_date: params.end_date,
      });

      if (params.site_id && params.site_id !== 'all') {
        queryParams.append('site_id', params.site_id);
      }

      const response = await api.get(`/reports/material-costs?${queryParams.toString()}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Material Costs API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch material costs report';
      
      throw new Error(errorMessage);
    }
  }
};
