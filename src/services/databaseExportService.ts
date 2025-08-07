import api from '@/lib/api';

export interface DatabaseExportResponse {
  message: string;
  data?: {
    filename?: string;
    size?: number;
    timestamp?: string;
  };
}

export const databaseExportService = {
  // Export full database using the specific API endpoint
  exportFullDatabase: async (): Promise<Blob> => {
    try {
      // Use the specific API endpoint: https://dbuildz.com/api/export-full-db
      const response = await api.get('/export-full-db', {
        responseType: 'blob', // Important for file downloads
        headers: {
          'Accept': 'application/octet-stream, application/json, application/sql',
        },
      });
      
      return response.data;
      
    } catch (error: any) {
      console.error('Database Export API Error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 404) {
        throw new Error('Database export endpoint not found. Please check the API configuration.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to export the database.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred during database export. Please try again later.');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to export database';
      
      throw new Error(errorMessage);
    }
  },

  // Helper function to download the exported file
  downloadExportedFile: (blob: Blob, filename?: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const defaultFilename = `database-export-${timestamp}.sql`;
    
    link.download = filename || defaultFilename;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  },

  // Helper function to get file size in human readable format
  getFileSizeString: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
};
