import api from '@/lib/api';

export interface WeeklyPayoutsFilters {
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

export interface PayoutSummary {
  total_labor_wages: number;
  total_advances_paid: string;
  net_payout: number;
}

export interface WeeklyBreakdown {
  week_start: string;
  week_end: string;
  total_wages: number;
  total_advances: number | string;
  net_payout: number;
}

export interface WeeklyPayoutsResponse {
  message: string;
  data: {
    filters: WeeklyPayoutsFilters;
    businesses: Business[];
    sites: Site[];
    summary: PayoutSummary;
    weekly_breakdown: WeeklyBreakdown[];
  };
}

export const weeklyPayoutsService = {
  // Fetch weekly payouts report
  getWeeklyPayouts: async (params: {
    business_id: string;
    start_date: string;
    end_date: string;
    site_id?: string;
    supervisor_id?: string;
  }): Promise<WeeklyPayoutsResponse> => {
    try {
      const queryParams = new URLSearchParams({
        business_id: params.business_id,
        start_date: params.start_date,
        end_date: params.end_date,
      });

      if (params.site_id && params.site_id !== 'all') {
        queryParams.append('site_id', params.site_id);
      }

      if (params.supervisor_id && params.supervisor_id !== 'all') {
        queryParams.append('supervisor_id', params.supervisor_id);
      }

      const response = await api.get(`/reports/weekly-payouts?${queryParams.toString()}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Weekly Payouts API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch weekly payouts report';
      
      throw new Error(errorMessage);
    }
  }
};
