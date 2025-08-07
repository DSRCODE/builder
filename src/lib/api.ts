import axios from 'axios';
import { getSelectedSiteId } from '@/utils/siteUtils';
const baseUrl = import.meta.env.VITE_BASE_URL;
export const BASE_URL = baseUrl;

const api = axios.create({
    baseURL: 'https://dbuildz.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include token and site_id from storage
api.interceptors.request.use(
    (config) => {
        // Add Authorization token
        const token = localStorage.getItem('token');
        if (token) {
            if (config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        // Add site_id header based on selected site
        const selectedSiteId = getSelectedSiteId();
        if (config.headers) {
            // If "all" is selected, send site_id as 0, otherwise send the actual site ID
            config.headers['site_id'] = selectedSiteId === 'all' ? '0' : selectedSiteId;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Add response interceptor for debugging (can be removed in production)
api.interceptors.response.use(
    (response) => {
        // Log the site_id that was sent with the request for debugging
        if (process.env.NODE_ENV === 'development') {
            const siteId = response.config.headers?.['site_id'];
            console.log(`🏗️ API Call: ${response.config.method?.toUpperCase()} ${response.config.url} | site_id: ${siteId}`);
        }
        return response;
    },
    (error) => {
        // Log error with site_id for debugging
        if (process.env.NODE_ENV === 'development' && error.config) {
            const siteId = error.config.headers?.['site_id'];
            console.error(`🏗️ API Error: ${error.config.method?.toUpperCase()} ${error.config.url} | site_id: ${siteId}`, error);
        }
        return Promise.reject(error);
    }
);

export default api;
