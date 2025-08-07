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

export interface Material {
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
  site: Site;
}

export interface MaterialsResponse {
  status: boolean;
  message: string;
  data: Material[];
}

// Form data for adding new material
export interface MaterialFormData {
  site_id: string;
  material_name: string;
  category_id: string;
  quantity: string;
  unit: string;
  amount_spent: string;
  date_added: string;
}

export interface MaterialApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

// Category interface for dropdown
export interface MaterialCategory {
  id: number;
  name: string;
}

export interface MaterialsApiError {
  message: string;
  status: number;
  error?: string;
}
