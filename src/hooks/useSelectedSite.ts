import { useState, useEffect } from 'react';
import { getSelectedSiteId } from '@/utils/siteUtils';

/**
 * Custom hook to get the currently selected site ID
 * This hook will automatically update when the site selection changes
 */
export const useSelectedSite = () => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(getSelectedSiteId());

  useEffect(() => {
    // Listen for storage changes to update when site selection changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedSiteId') {
        setSelectedSiteId(e.newValue || 'all');
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleSiteChange = (e: CustomEvent) => {
      setSelectedSiteId(e.detail.siteId);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('siteChanged', handleSiteChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('siteChanged', handleSiteChange as EventListener);
    };
  }, []);

  return selectedSiteId;
};

/**
 * Example usage in a component:
 * 
 * import { useSelectedSite } from '@/hooks/useSelectedSite';
 * 
 * function MyComponent() {
 *   const selectedSiteId = useSelectedSite();
 *   
 *   // Use selectedSiteId to filter data or make API calls
 *   useEffect(() => {
 *     if (selectedSiteId !== 'all') {
 *       // Fetch data for specific site
 *       fetchDataForSite(selectedSiteId);
 *     } else {
 *       // Fetch data for all sites
 *       fetchAllData();
 *     }
 *   }, [selectedSiteId]);
 *   
 *   return <div>Current site: {selectedSiteId}</div>;
 * }
 */
