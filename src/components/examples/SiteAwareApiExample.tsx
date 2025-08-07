import { useState, useEffect } from 'react';
import { useSelectedSite } from '@/hooks/useSelectedSite';
import { getCurrentApiSiteId, logCurrentSiteSelection } from '@/utils/apiDebug';
import api from '@/lib/api';

/**
 * Example component showing how API calls automatically include site_id header
 * This component demonstrates the site-aware API functionality
 */
export const SiteAwareApiExample = () => {
  const selectedSiteId = useSelectedSite();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Example API call that will automatically include site_id header
  const fetchData = async () => {
    setLoading(true);
    try {
      // Log current site selection for debugging
      logCurrentSiteSelection();
      
      // This API call will automatically include:
      // - Authorization: Bearer {token}
      // - site_id: {selectedSiteId === 'all' ? '0' : selectedSiteId}
      const response = await api.get('/some-endpoint');
      setData(response.data);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch data when site selection changes
  useEffect(() => {
    fetchData();
  }, [selectedSiteId]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Site-Aware API Example</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Selected Site ID:</strong> {selectedSiteId}</p>
        <p><strong>API site_id Header:</strong> {getCurrentApiSiteId()}</p>
        <p><strong>Status:</strong> {loading ? 'Loading...' : 'Ready'}</p>
      </div>

      <button 
        onClick={fetchData}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>

      {data && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-medium">API Response:</h4>
          <pre className="text-sm mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>How it works:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>All API calls through the `api` instance automatically include site_id header</li>
          <li>When "All Sites" is selected, site_id = "0"</li>
          <li>When a specific site is selected, site_id = the actual site ID</li>
          <li>The header is added by the request interceptor in api.ts</li>
          <li>Check browser console for debugging logs in development mode</li>
        </ul>
      </div>
    </div>
  );
};

export default SiteAwareApiExample;
