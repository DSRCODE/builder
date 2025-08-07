import { useMutation } from '@tanstack/react-query';
import { databaseExportService } from '@/services/databaseExportService';

// Hook for database export functionality
export const useDatabaseExport = () => {
  return useMutation({
    mutationFn: databaseExportService.exportFullDatabase,
    onSuccess: (blob: Blob) => {
      // Get file size for user feedback
      const fileSize = databaseExportService.getFileSizeString(blob.size);
      console.log(`Database export successful. File size: ${fileSize}`);
      
      // Automatically download the file when export is successful
      databaseExportService.downloadExportedFile(blob);
    },
    onError: (error: Error) => {
      console.error('Database export failed:', error);
    },
  });
};
