import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { RefreshCw, MapPin } from "lucide-react";

export function ConstructionSitesTest() {
  const { data, isLoading, error, refetch, isRefetching } = useConstructionSites();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Construction Sites API Test</h1>
          <p className="text-sm text-muted-foreground">
            Testing API connection to https://dbuildz.com/api/construction-sites
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
            <MapPin className="mr-2 h-5 w-5" />
            API Response
          </CardTitle>
          <CardDescription>
            Raw response from the construction sites API endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-4">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
              <p>Loading construction sites from API...</p>
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
                  <p>Success: {data.success ? 'true' : 'false'}</p>
                  <p>Message: {data.message}</p>
                  <p>Total sites: {data.data.length}</p>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-2">Raw Data Preview:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              {data.data && data.data.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Sample Construction Site:</h4>
                  <div className="text-sm space-y-1 mb-3">
                    <p><strong>Site Name:</strong> {data.data[0].site_name}</p>
                    <p><strong>Address:</strong> {data.data[0].address}</p>
                    <p><strong>Business:</strong> {data.data[0].business.name}</p>
                    <p><strong>Currency:</strong> {data.data[0].currency}</p>
                    <p><strong>Budget:</strong> {data.data[0].currency} {parseFloat(data.data[0].estimated_budget).toLocaleString()}</p>
                    <p><strong>Progress:</strong> {data.data[0].progress}</p>
                    <p><strong>Location:</strong> {data.data[0].location}</p>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
                      View Full Site Object
                    </summary>
                    <pre className="text-xs bg-white p-3 rounded border overflow-auto mt-2">
                      {JSON.stringify(data.data[0], null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {data.data && data.data.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Sites Summary:</h4>
                  <div className="grid gap-2">
                    {data.data.map((site) => (
                      <div key={site.id} className="bg-white p-2 rounded border text-sm">
                        <div className="font-medium">{site.site_name}</div>
                        <div className="text-muted-foreground text-xs">
                          ID: {site.id} • {site.address} • {site.business.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
