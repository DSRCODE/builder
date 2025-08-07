import api from '@/lib/api';

export interface SupervisorFlowFilters {
  business_id?: string | null;
  site_id?: string | null;
  start_date: string;
  end_date: string;
  supervisor_id: string;
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

export interface Supervisor {
  id: number;
  user_role_id: number;
  added_by: number | null;
  user_role: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  business_name: string | null;
  phone_number_prefix: string | null;
  phone_number_country_code: string | null;
  phone_number: string;
  address: string | null;
  gender: string | null;
  is_active: number;
  is_deleted: number;
  image: string;
  social_type: string | null;
  social_id: string | null;
  forgot_password_validate_string: string | null;
  verification_code: string | null;
  verification_code_sent_time: string | null;
  is_verified: number;
  verified_by_admin: number;
  language: string | null;
  push_notification: number;
  documents_front: string | null;
  documents_back: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  date: string;
  site: string;
  amount: string;
  description: string;
}

export interface SupervisorDetail {
  supervisor_name: string;
  supervisor_email: string;
  total_cash_in: number;
  total_expenses: number;
  net_balance: number;
  transactions: Transaction[];
}

export interface SupervisorFlowSummary {
  total_cash_in: number;
  total_expenses: number;
  net_balance: number;
}

export interface SupervisorFlowResponse {
  message: string;
  data: {
    filters: SupervisorFlowFilters;
    businesses: Business[];
    sites: Site[];
    supervisors: Supervisor[];
    summary: SupervisorFlowSummary;
    supervisor_details: SupervisorDetail[];
  };
}

export const supervisorFlowService = {
  // Fetch supervisor flow report
  getSupervisorFlow: async (params: {
    supervisor_id: string;
    start_date: string;
    end_date?: string;
    business_id?: string;
    site_id?: string;
  }): Promise<SupervisorFlowResponse> => {
    try {
      const queryParams = new URLSearchParams({
        supervisor_id: params.supervisor_id,
        start_date: params.start_date,
      });

      if (params.end_date) {
        queryParams.append('end_date', params.end_date);
      }

      if (params.business_id && params.business_id !== 'all') {
        queryParams.append('business_id', params.business_id);
      }

      if (params.site_id && params.site_id !== 'all') {
        queryParams.append('site_id', params.site_id);
      }

      const response = await api.get(`/reports/supervisor-flow?${queryParams.toString()}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Supervisor Flow API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch supervisor flow report';
      
      throw new Error(errorMessage);
    }
  }
};
