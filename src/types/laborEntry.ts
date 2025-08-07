export interface LaborEntryFormData {
  site_id: string;
  date: string;
  masons: string;
  helpers: string;
  lady_helpers: string;
  manual_total_wage: string;
  override_comment: string;
}

export interface LaborEntryResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface Business {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: number;
  user_role_id: number;
  added_by: number | null;
  user_role: any;
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

export interface ConstructionSite {
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
  business: Business;
  user: User | null;
}

export interface ConstructionSitesResponse {
  success: boolean;
  message: string;
  data: ConstructionSite[];
}

// Labor Entry from API (for display in table) - Updated to match actual API response
export interface LaborEntry {
  id: number;
  site_id: number;
  date: string;
  masons: number;
  helpers: number;
  lady_helpers: number;
  calculated_total_wage: string;
  manual_total_wage: string | null;
  override_comment: string | null;
  created_at: string;
  updated_at: string;
  site: ConstructionSite | null;
}

export interface LaborEntriesResponse {
  status: boolean;
  message: string;
  data: LaborEntry[];
}

export interface LaborEntryApiError {
  message: string;
  status: number;
  error?: string;
}
