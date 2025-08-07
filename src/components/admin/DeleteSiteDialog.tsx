import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Building2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DeleteSiteDialogProps {
  siteId: number;
  siteName: string;
  children?: React.ReactNode;
}

const DeleteSiteDialog = ({ siteId, siteName, children }: DeleteSiteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/construction-sites/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Construction site deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["construction-sites"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete construction site",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteSiteMutation.mutate(siteId);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-red-600" />
            Delete Construction Site
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this construction site?
            <br />
            <strong>"{siteName}"</strong>
            <br />
            <br />
            This action cannot be undone and will permanently remove:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All site data and information</li>
              <li>Associated project records</li>
              <li>Site images and documents</li>
              <li>Progress tracking data</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSiteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSiteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSiteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Site
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSiteDialog;
