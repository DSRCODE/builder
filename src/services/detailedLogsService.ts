import api from '@/lib/api';

export interface DetailedLogsFilters {
  business_id: string;
  site_id: string;
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

export interface LogEntry {
  type: 'material' | 'labor' | 'advance';
  date: string;
  site: string;
  name: string;
  category?: string;
  quantity?: string;
  unit?: string;
  amount_spent: string;
}

export interface DetailedLogsSummary {
  labor_entries: number;
  material_entries: number;
  advance_entries: number;
  total_labor: number;
  total_materials: number;
  total_advances: number;
}

export interface DetailedLogsResponse {
  message: string;
  data: {
    filters: DetailedLogsFilters;
    businesses: Business[];
    sites: Site[];
    logs: LogEntry[];
    summary: DetailedLogsSummary;
  };
}

export const detailedLogsService = {
  // Fetch detailed logs report
  getDetailedLogs: async (params: {
    business_id: string;
    site_id: string;
    start_date: string;
    end_date: string;
    supervisor_id?: string;
  }): Promise<DetailedLogsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        business_id: params.business_id,
        site_id: params.site_id,
        start_date: params.start_date,
        end_date: params.end_date,
      });

      if (params.supervisor_id && params.supervisor_id !== 'all') {
        queryParams.append('supervisor_id', params.supervisor_id);
      }

      const response = await api.get(`/reports/detailed-logs?${queryParams.toString()}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Detailed Logs API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch detailed logs report';
      
      throw new Error(errorMessage);
    }
  }
};
