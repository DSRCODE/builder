export interface PricingPlan {
  name: string;
  monthly_price: number;
  yearly_price: number;
  users_limit: number;
  sites_limit: number;
  description: string;
}
export interface PricingPlanFormData {
  name: string; 
  monthly_price: number; 
  yearly_price: number;
  users_limit: number; 
  sites_limit: number; 
  description: string; 
}
export interface PricingPlan extends PricingPlanFormData {
  id: string; // Unique plan ID
  created_at?: string; // ISO timestamp when created
  updated_at?: string; // ISO timestamp when last updated
}

// Represents the API response for a list of pricing plans
export interface PricingPlansResponse {
  data: PricingPlan[];
  total?: number;
  status?: boolean;
  message?: string;
}

export interface PricingPlanApiResponse {
  success?: boolean;
  message?: string;
  status?: string;
  data?: PricingPlan;
  errors?: Record<string, string[]>;
}
