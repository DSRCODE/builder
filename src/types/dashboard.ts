export interface MaterialSummary {
  total_items: number;
  total_cost: number;
}

export interface LaborSummary {
  total_entries: number;
  total_wages: number;
}

export interface OwnerPaymentSummary {
  total_owners_involved: number;
  total_amount_received: number;
}

export interface MonthlySpendingData {
  expenses: number;
  labor: number;
  total: number;
}

export interface MonthlySpending {
  [key: string]: MonthlySpendingData; // e.g., "2025-03": { expenses: 0, labor: 0, total: 0 }
}

export interface BudgetVsSpent {
  site_name: string;
  budget: string;
  spent: string;
  percentage: number;
}

export interface SiteProgress {
  name: string;
  progress: number;
}

export interface DashboardData {
  location: string;
  total_budget: number;
  total_spent: number;
  budget_utilization_percentage: number;
  active_projects: number;
  completed_projects: number;
  material_summary: MaterialSummary;
  labor_summary: LaborSummary;
  owner_payment_summary: OwnerPaymentSummary;
  monthly_spending: MonthlySpending;
  budget_vs_spent: BudgetVsSpent[];
  site_progress: SiteProgress[];
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
}

export interface DashboardApiError {
  message: string;
  status: number;
  error?: string;
}
