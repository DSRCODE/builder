import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlySpending } from "@/types/dashboard";
import { useTranslation } from "react-i18next";

interface MonthlySpendingChartProps {
  monthlySpending: MonthlySpending;
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Helper function to get month name
const getMonthName = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
        <p className="text-sm font-medium text-gray-600">
          Total:{" "}
          {formatCurrency(
            payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
          )}
        </p>
      </div>
    );
  }
  return null;
};

export function MonthlySpendingChart({
  monthlySpending,
}: MonthlySpendingChartProps) {
  const { t } = useTranslation();
  // Transform data for the chart
  const chartData = Object.entries(monthlySpending)
    .map(([month, spending]) => ({
      month: getMonthName(month),
      monthKey: month,
      expenses: spending.expenses,
      labor: spending.labor,
      total: spending.total,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  // Calculate max value for better scaling
  const maxValue = Math.max(...chartData.map((d) => d.total));
  const hasData = maxValue > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t("Dashboard.monthly_spending_trend")}
        </CardTitle>
        <CardDescription>
          {t("Dashboard.expenses_and_labor_costs")}
          {hasData && ` • ${t("Dashboard.peak")}: ${formatCurrency(maxValue)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t("Dashboard.no_spending_data")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("Dashboard.no_spending_record")}
            </p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
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
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: "#e5e7eb" }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f97316"
                  strokeWidth={3}
                  name={t("Dashboard.expenses")}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="labor"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name={t("Dashboard.labor")}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  name={t("Dashboard.total")}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary below chart */}
        {hasData && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">
                  {t("Dashboard.total_expenses")}
                </div>
                <div className="font-semibold text-orange-600">
                  {formatCurrency(
                    chartData.reduce((sum, d) => sum + d.expenses, 0)
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {" "}
                  {t("Dashboard.total_labor")}
                </div>
                <div className="font-semibold text-blue-600">
                  {formatCurrency(
                    chartData.reduce((sum, d) => sum + d.labor, 0)
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {" "}
                  {t("Dashboard.grand_total")}
                </div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(
                    chartData.reduce((sum, d) => sum + d.total, 0)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
