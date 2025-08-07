import { getSelectedSiteId } from './siteUtils';

/**
 * Utility functions for debugging API calls with site_id
 */

/**
 * Get the current site_id that will be sent in API headers
 * @returns {string} The site_id value that will be sent ("0" for all sites, or the actual site ID)
 */
export const getCurrentApiSiteId = (): string => {
  const selectedSiteId = getSelectedSiteId();
  return selectedSiteId === 'all' ? '0' : selectedSiteId;
};

/**
 * Log the current site selection for debugging
 */
export const logCurrentSiteSelection = (): void => {
  const selectedSiteId = getSelectedSiteId();
  const apiSiteId = getCurrentApiSiteId();
  
  console.log('🏗️ Site Selection Debug:', {
    selectedSiteId,
    apiSiteId,
    isAllSites: selectedSiteId === 'all'
  });
};

/**
 * Get a human-readable description of the current site selection
 * @returns {string} Description of current selection
 */
export const getCurrentSiteDescription = (): string => {
  const selectedSiteId = getSelectedSiteId();
  const apiSiteId = getCurrentApiSiteId();
  
  if (selectedSiteId === 'all') {
    return `All Sites (API sends site_id: ${apiSiteId})`;
  } else {
    return `Site ID: ${selectedSiteId} (API sends site_id: ${apiSiteId})`;
  }
};
