/**
 * Utility functions for site management
 */

/**
 * Get the currently selected site ID from session storage
 * @returns {string} The selected site ID or "all" if none is selected
 */
export const getSelectedSiteId = (): string => {
  return sessionStorage.getItem('selectedSiteId') || 'all';
};

/**
 * Set the selected site ID in session storage
 * @param {string} siteId - The site ID to store
 */
export const setSelectedSiteId = (siteId: string): void => {
  sessionStorage.setItem('selectedSiteId', siteId);
};

/**
 * Check if a specific site is selected
 * @param {string} siteId - The site ID to check
 * @returns {boolean} True if the site is selected
 */
export const isSiteSelected = (siteId: string): boolean => {
  const selectedId = getSelectedSiteId();
  return selectedId === siteId || selectedId === 'all';
};

/**
 * Get the selected site name for display purposes
 * @param {Array} sites - Array of site objects
 * @returns {string} The selected site name or "All Sites"
 */
export const getSelectedSiteName = (sites: any[]): string => {
  const selectedId = getSelectedSiteId();
  
  if (selectedId === 'all') {
    return 'All Sites';
  }
  
  const selectedSite = sites.find(site => site.id.toString() === selectedId);
  return selectedSite ? selectedSite.site_name : 'All Sites';
};
