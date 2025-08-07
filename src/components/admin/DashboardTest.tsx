import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { RefreshCw, BarChart3 } from "lucide-react";

export function DashboardTest() {
  const { data, isLoading, error, refetch, isRefetching } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard API Test</h1>
          <p className="text-sm text-muted-foreground">
            Testing API connection to https://dbuildz.com/api/dashboard
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Test API
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            API Response
          </CardTitle>
          <CardDescription>
            Raw response from the dashboard API endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-4">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
              <p>Loading dashboard data from API...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-medium text-destructive mb-2">API Error</h3>
              <p className="text-sm text-destructive/80">{error.message}</p>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">✅ API Connection Successful</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Message: {data.message}</p>
                  <p>Location: {data.data.location}</p>
                  <p>Total Budget: ₹{data.data.total_budget.toLocaleString()}</p>
                  <p>Active Projects: {data.data.active_projects}</p>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-2">Raw Data Preview:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Dashboard Summary:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Location:</strong> {data.data.location}</p>
                    <p><strong>Total Budget:</strong> ₹{data.data.total_budget.toLocaleString()}</p>
                    <p><strong>Total Spent:</strong> ₹{data.data.total_spent.toLocaleString()}</p>
                    <p><strong>Budget Utilization:</strong> {data.data.budget_utilization_percentage}%</p>
                  </div>
                  <div>
                    <p><strong>Active Projects:</strong> {data.data.active_projects}</p>
                    <p><strong>Completed Projects:</strong> {data.data.completed_projects}</p>
                    <p><strong>Material Items:</strong> {data.data.material_summary.total_items}</p>
                    <p><strong>Labor Entries:</strong> {data.data.labor_summary.total_entries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-2">Financial Summary:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <p className="font-medium">Materials</p>
                    <p>Items: {data.data.material_summary.total_items}</p>
                    <p>Cost: ₹{data.data.material_summary.total_cost.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="font-medium">Labor</p>
                    <p>Entries: {data.data.labor_summary.total_entries}</p>
                    <p>Wages: ₹{data.data.labor_summary.total_wages.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="font-medium">Owners</p>
                    <p>Count: {data.data.owner_payment_summary.total_owners_involved}</p>
                    <p>Received: ₹{data.data.owner_payment_summary.total_amount_received.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Monthly Spending:</h4>
                <div className="grid gap-2">
                  {Object.entries(data.data.monthly_spending).map(([month, spending]) => (
                    <div key={month} className="bg-white p-2 rounded border text-sm flex justify-between">
                      <span className="font-medium">{month}</span>
                      <div className="text-right">
                        <div>Total: ₹{spending.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Expenses: ₹{spending.expenses.toLocaleString()} | Labor: ₹{spending.labor.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-800 mb-2">Site Progress:</h4>
                <div className="grid gap-2">
                  {data.data.site_progress.map((site, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm flex justify-between">
                      <span className="font-medium truncate">{site.name}</span>
                      <span className="text-indigo-600">{site.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
