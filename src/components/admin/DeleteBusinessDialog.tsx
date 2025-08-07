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
import { Trash2, Loader2, Building } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DeleteBusinessDialogProps {
  businessId: number;
  businessName: string;
  children?: React.ReactNode;
}

const DeleteBusinessDialog = ({ businessId, businessName, children }: DeleteBusinessDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/businesses-delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteBusinessMutation.mutate(businessId);
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
            <Building className="h-5 w-5 text-red-600" />
            Delete Business
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this business?
            <br />
            <strong>"{businessName}"</strong>
            <br />
            <br />
            This action cannot be undone and will permanently remove:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All business information</li>
              <li>Associated construction sites</li>
              <li>Related project data</li>
              <li>Business configuration settings</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBusinessMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBusinessMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteBusinessMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Business
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBusinessDialog;
