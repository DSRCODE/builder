import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle, Calendar, MapPin, User, Tag } from "lucide-react";
import { useDetailedLogs } from "@/hooks/useReports";
import { DetailedLogsFilters } from "@/types/reports";

interface DetailedLogsChartProps {
  filters: DetailedLogsFilters;
}

// Helper function to format currency
const formatCurrency = (amount: string) => {
  const numAmount = parseFloat(amount);
  return `₹${numAmount.toLocaleString('en-IN')}`;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get type color
const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'material': 'bg-blue-100 text-blue-800',
    'labor': 'bg-green-100 text-green-800',
    'expense': 'bg-red-100 text-red-800',
    'payment': 'bg-purple-100 text-purple-800',
    'advance': 'bg-orange-100 text-orange-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  
  return colors[type.toLowerCase()] || colors.default;
};

export function DetailedLogsChart({ filters }: DetailedLogsChartProps) {
  const { data: logsResponse, isLoading, error } = useDetailedLogs(filters);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Logs
          </CardTitle>
          <CardDescription>Loading detailed log data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Logs
          </CardTitle>
          <CardDescription>Failed to load log data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const logs = logsResponse?.data || [];
  
  // Ensure logs is an array before using reduce
  const logsArray = Array.isArray(logs) ? logs : [];
  const totalAmount = logsArray.reduce((sum, log) => sum + parseFloat(log.amount), 0);

  // Group logs by type for summary
  const logsByType = logsArray.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + parseFloat(log.amount);
    return acc;
  }, {} as { [key: string]: number });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detailed Logs
        </CardTitle>
        <CardDescription>
          {logsArray.length} entries • Total: {formatCurrency(totalAmount.toString())}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logsArray.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No logs found</h3>
            <p className="text-sm text-muted-foreground">
              No detailed log data available for the selected period.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary by type */}
            {Object.keys(logsByType).length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/50 rounded">
                {Object.entries(logsByType).map(([type, amount]) => (
                  <div key={type} className="text-center">
                    <Badge className={getTypeColor(type)} variant="secondary">
                      {type}
                    </Badge>
                    <div className="text-sm font-medium mt-1">
                      {formatCurrency(amount.toString())}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed logs list */}
            <div className="space-y-3">
              {logsArray.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded hover:bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(log.date)}
                      </div>
                      <Badge className={getTypeColor(log.type)}>
                        {log.type}
                      </Badge>
                    </div>
                    
                    <div className="font-medium mb-1">
                      {log.description}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.site_name}
                      </div>
                      
                      {log.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {log.category}
                        </div>
                      )}
                      
                      {log.user_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user_name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatCurrency(log.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
