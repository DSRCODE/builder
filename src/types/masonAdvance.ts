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

export interface MasonAdvance {
  id: number;
  site_id: number;
  date: string;
  mason_name: string;
  amount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  site: Site | null;
}

export interface MasonAdvancesResponse {
  status: boolean;
  message: string;
  data: MasonAdvance[];
}

// Form data for adding/editing mason advance
export interface MasonAdvanceFormData {
  site_id: string;
  date: string;
  mason_name: string;
  amount: string;
}

export interface MasonAdvanceApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface MasonAdvanceApiError {
  message: string;
  status: number;
  error?: string;
}
