import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BudgetVsSpent } from "@/types/dashboard";
import { useTranslation } from "react-i18next";

interface BudgetVsSpentChartProps {
  budgetVsSpent: BudgetVsSpent[];
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Helper function to format currency in thousands
const formatCurrencyShort = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const budgetData = payload.find((p: any) => p.dataKey === "budget");
    const spentData = payload.find((p: any) => p.dataKey === "spent");
    const percentage =
      budgetData && budgetData.value > 0
        ? (((spentData?.value || 0) / budgetData.value) * 100).toFixed(1)
        : "0.0";

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
        <p className="font-medium truncate">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
        <p className="text-sm font-medium text-gray-600">
          Utilization: {percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export function BudgetVsSpentChart({ budgetVsSpent }: BudgetVsSpentChartProps) {
  const { t } = useTranslation();
  // Transform data for the chart
  const chartData = budgetVsSpent.map((site, index) => ({
    name:
      site.site_name.length > 20
        ? `${site.site_name.substring(0, 20)}...`
        : site.site_name,
    fullName: site.site_name,
    budget: parseFloat(site.budget),
    spent: parseFloat(site.spent),
    percentage: site.percentage,
    id: index,
  }));

  // Calculate totals
  const totalBudget = chartData.reduce((sum, site) => sum + site.budget, 0);
  const totalSpent = chartData.reduce((sum, site) => sum + site.spent, 0);
  const overallPercentage =
    totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t("Dashboard.budget_vs_spent_per_site")}
        </CardTitle>
        <CardDescription>
          {t`Dashboard.budget_utilization_across_sites`} {chartData.length}{" "}
          {t`Dashboard.sites`} • {t`Dashboard.overall`}: {overallPercentage}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={{ stroke: "#e5e7eb" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => formatCurrencyShort(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="budget"
                fill="#3b82f6"
                name={t("Dashboard.buget")}
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="spent"
                fill="#10b981"
                name={t("Dashboard.spent")}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary below chart */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">
                {" "}
                {t`Dashboard.total_budget`}
              </div>
              <div className="font-semibold text-blue-600">
                {formatCurrency(totalBudget)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {" "}
                {t`Dashboard.total_spent`}
              </div>
              <div className="font-semibold text-green-600">
                {formatCurrency(totalSpent)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("Dashboard.utilization")}
              </div>
              <div className="font-semibold text-gray-600">
                {overallPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Individual site breakdown */}
      </CardContent>
    </Card>
  );
}
