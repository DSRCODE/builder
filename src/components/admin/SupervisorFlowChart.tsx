import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, AlertCircle, Calendar, MapPin, Clock } from "lucide-react";
import { useSupervisorFlow } from "@/hooks/useReports";
import { SupervisorFlowFilters } from "@/types/reports";

interface SupervisorFlowChartProps {
  filters: SupervisorFlowFilters;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

// Helper function to get activity color
const getActivityColor = (activity: string) => {
  const colors: { [key: string]: string } = {
    'inspection': 'bg-blue-100 text-blue-800',
    'supervision': 'bg-green-100 text-green-800',
    'meeting': 'bg-purple-100 text-purple-800',
    'planning': 'bg-orange-100 text-orange-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  
  return colors[activity.toLowerCase()] || colors.default;
};

export function SupervisorFlowChart({ filters }: SupervisorFlowChartProps) {
  const { data: flowResponse, isLoading, error } = useSupervisorFlow(filters);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Supervisor Flow
          </CardTitle>
          <CardDescription>Loading supervisor activity data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-16" />
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
            <UserCheck className="h-5 w-5" />
            Supervisor Flow
          </CardTitle>
          <CardDescription>Failed to load supervisor data</CardDescription>
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

  const activities = flowResponse?.data || [];
  
  // Ensure activities is an array before using reduce
  const activitiesArray = Array.isArray(activities) ? activities : [];
  const totalHours = activitiesArray.reduce((sum, activity) => sum + (activity.hours_worked || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Supervisor Flow
        </CardTitle>
        <CardDescription>
          {activitiesArray.length} activities • Total hours: {totalHours}h
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activitiesArray.length === 0 ? (
          <div className="text-center py-8">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No activities found</h3>
            <p className="text-sm text-muted-foreground">
              No supervisor activity data available for the selected period.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activitiesArray.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(activity.date)}
                    </div>
                    <Badge className={getActivityColor(activity.activity)}>
                      {activity.activity}
                    </Badge>
                  </div>
                  
                  <div className="font-medium mb-1">
                    {activity.supervisor_name}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    {activity.site_name}
                  </div>
                  
                  {activity.notes && (
                    <div className="text-xs text-muted-foreground">
                      {activity.notes}
                    </div>
                  )}
                </div>
                
                {activity.hours_worked && (
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Clock className="h-3 w-3" />
                    {activity.hours_worked}h
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
