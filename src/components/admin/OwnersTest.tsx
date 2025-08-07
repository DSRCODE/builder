import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOwners } from "@/hooks/useOwners";
import { RefreshCw, User } from "lucide-react";

export function OwnersTest() {
  const { data, isLoading, error, refetch, isRefetching } = useOwners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Owners API Test</h1>
          <p className="text-sm text-muted-foreground">
            Testing API connection to https://dbuildz.com/api/owners
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
            <User className="mr-2 h-5 w-5" />
            API Response
          </CardTitle>
          <CardDescription>
            Raw response from the owners API endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-4">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
              <p>Loading owners from API...</p>
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
                  <p>Status: {data.status ? 'true' : 'false'}</p>
                  <p>Message: {data.message}</p>
                  <p>Total owners: {data.data.length}</p>
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
                  <h4 className="font-medium text-blue-800 mb-2">Sample Owner:</h4>
                  <div className="text-sm space-y-1 mb-3">
                    <p><strong>ID:</strong> {data.data[0].id}</p>
                    <p><strong>Site ID:</strong> {data.data[0].site_id}</p>
                    <p><strong>Name:</strong> {data.data[0].name}</p>
                    <p><strong>Phone Number:</strong> {data.data[0].phone_number}</p>
                    <p><strong>Site Object:</strong> {data.data[0].site ? 'Available' : 'null'}</p>
                    <p><strong>Communication Logs:</strong> {data.data[0].communication_logs.length} entries</p>
                    <p><strong>Created:</strong> {new Date(data.data[0].created_at).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(data.data[0].updated_at).toLocaleString()}</p>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
                      View Full Owner Object
                    </summary>
                    <pre className="text-xs bg-white p-3 rounded border overflow-auto mt-2">
                      {JSON.stringify(data.data[0], null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {data.data && data.data.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Owners Summary:</h4>
                  <div className="grid gap-2">
                    {data.data.map((owner) => (
                      <div key={owner.id} className="bg-white p-2 rounded border text-sm">
                        <div className="font-medium">{owner.name}</div>
                        <div className="text-muted-foreground text-xs">
                          ID: {owner.id} • Site ID: {owner.site_id} • Phone: {owner.phone_number} • Logs: {owner.communication_logs.length}
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
