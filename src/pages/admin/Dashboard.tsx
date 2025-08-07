import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  MapPin,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Hammer,
  Receipt,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { MonthlySpendingChart } from "@/components/admin/MonthlySpendingChart";
import { BudgetVsSpentChart } from "@/components/admin/BudgetVsSpentChart";
import { SiteProgressChart } from "@/components/admin/SiteProgressChart";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { USER_ROLES } from "@/utils/roleUtils";
import { useTranslation } from "react-i18next";

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Helper function to format percentage
const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`;
};

// Helper function to get month name
const getMonthName = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

export function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const { t } = useTranslation();
  const {
    data: dashboardResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useDashboard();

  const handleRefresh = () => {
    refetch();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("Dashboard.Dashboard.dashboard")}
            </h1>
            <p className="text-muted-foreground">
              {t("Dashboard.construction_project_ovrview")}
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("retry")}
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("failed_to_load")}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const dashboardData = dashboardResponse?.data;

  if (!dashboardData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("Dashboard.no_data_avaliable")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("Dashboard.dashboard")}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{dashboardData.location}</span>
            {isRefetching && (
              <span className="ml-2 text-primary">
                {t("Dashboard.refreshhing")}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefetching}
          size="sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          {t("Dashboard.refresh")}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Dashboard.total_budget")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.total_budget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Dashboard.spent")}:{" "}
              {formatCurrency(dashboardData.total_spent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Dashboard.budget_utilization")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(dashboardData.budget_utilization_percentage)}
            </div>
            <Progress
              value={dashboardData.budget_utilization_percentage}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Dashboard.active_projects")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.active_projects}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Dashboard.completed")}: {dashboardData.completed_projects}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Dashboard.total_owners")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.owner_payment_summary.total_owners_involved}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Dashboard.received")}:{" "}
              {formatCurrency(
                dashboardData.owner_payment_summary.total_amount_received
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <SiteProgressChart siteProgress={dashboardData.site_progress} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Dashboard.material_summary")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.material_summary.total_items}
            </div>
            <p className="text-xs text-muted-foreground">
              {" "}
              {t("Dashboard.total_items")}
            </p>
            <div className="text-lg font-semibold text-green-600 mt-2">
              {formatCurrency(dashboardData.material_summary.total_cost)}
            </div>
            <p className="text-xs text-muted-foreground">
              {" "}
              {t("Dashboard.total_cost")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {" "}
              {t("Dashboard.labor_summary")}
            </CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.labor_summary.total_entries}
            </div>
            <p className="text-xs text-muted-foreground">
              {" "}
              {t("Dashboard.total_entries")}
            </p>
            <div className="text-lg font-semibold text-blue-600 mt-2">
              {formatCurrency(dashboardData.labor_summary.total_wages)}
            </div>
            <p className="text-xs text-muted-foreground">
              {" "}
              {t("Dashboard.total_wage")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Spending Line Chart */}
        <MonthlySpendingChart
          monthlySpending={dashboardData.monthly_spending}
        />

        {/* Budget vs Spent Bar Chart */}
        <BudgetVsSpentChart budgetVsSpent={dashboardData.budget_vs_spent} />

        {/* Site Progress Overview */}
      </div>
    </div>
  );
}
