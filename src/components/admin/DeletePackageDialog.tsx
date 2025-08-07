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
import { Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface DeletePackageDialogProps {
  packageId: number;
  packageName: string;
  children?: React.ReactNode;
}

const DeletePackageDialog = ({ packageId, packageName, children }: DeletePackageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/package/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete package",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deletePackageMutation.mutate(packageId);
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
          <AlertDialogTitle>Delete Package</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the package?
            <br />
            <strong>"{packageName}"</strong>
            <br />
            This action cannot be undone and will affect all users subscribed to this package.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePackageMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePackageMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePackageMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Package
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePackageDialog;
