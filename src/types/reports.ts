// Weekly Payouts Report Types - Updated to match actual API response
export interface WeeklyPayoutFilters {
  business_id: string;
  site_id: string | null;
  start_date: string;
  end_date: string;
  supervisor_id: string | null;
}

export interface WeeklyPayoutSite {
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

export interface WeeklyPayoutSummary {
  total_labor_wages: number;
  total_advances_paid: number;
  net_payout: number;
}

export interface WeeklyBreakdown {
  week_start: string;
  week_end: string;
  total_wages: number;
  total_advances: number;
  net_payout: number;
}

export interface WeeklyPayoutData {
  filters: WeeklyPayoutFilters;
  businesses: any[]; // Empty in your response
  sites: WeeklyPayoutSite[];
  summary: WeeklyPayoutSummary;
  weekly_breakdown: WeeklyBreakdown[];
}

export interface WeeklyPayoutsResponse {
  message: string;
  data: WeeklyPayoutData;
}

// Supervisor Flow Report Types
export interface SupervisorFlowItem {
  id: number;
  supervisor_id: number;
  supervisor_name: string;
  date: string;
  activity: string;
  site_name: string;
  hours_worked?: number;
  notes?: string;
}

export interface SupervisorFlowResponse {
  status: boolean;
  message: string;
  data: SupervisorFlowItem[];
}

// Detailed Logs Report Types
export interface DetailedLogItem {
  id: number;
  date: string;
  type: string; // 'material', 'labor', 'expense', etc.
  description: string;
  amount: string;
  site_name: string;
  category?: string;
  user_name?: string;
}

export interface DetailedLogsResponse {
  status: boolean;
  message: string;
  data: DetailedLogItem[];
}

// Report Filter Parameters
export interface SupervisorFlowFilters {
  supervisor_id: number;
  start_date: string;
  end_date?: string;
}

export interface DetailedLogsFilters {
  business_id: number;
  site_id?: number;
  start_date: string;
  end_date: string;
}

// Combined Reports Response
export interface ReportsData {
  weeklyPayouts: WeeklyPayoutsResponse | null;
  supervisorFlow: SupervisorFlowResponse | null;
  detailedLogs: DetailedLogsResponse | null;
}

export interface ReportsApiError {
  message: string;
  status: number;
  error?: string;
}
