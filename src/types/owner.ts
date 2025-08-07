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

export interface CommunicationLog {
  id: number;
  owner_id: number;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: number;
  site_id: number;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  site: Site | null;
  communication_logs: CommunicationLog[];
}

export interface OwnersResponse {
  status: boolean;
  message: string;
  data: Owner[];
}

// Form data for adding/editing owner - matching API structure
export interface OwnerFormData {
  site_id: string;
  name: string;
  phone_number: string;
}

export interface OwnerApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface OwnerApiError {
  message: string;
  status: number;
  error?: string;
}
