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
import { useTranslation } from "react-i18next";

interface DeleteBusinessDialogProps {
  businessId: number;
  businessName: string;
  children?: React.ReactNode;
}

const DeleteBusinessDialog = ({
  businessId,
  businessName,
  children,
}: DeleteBusinessDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/businesses-delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: `${t("admin.deletedialog.deletbusiness.suc")}`,
        description: `${t("admin.deletedialog.deletbusiness.suc2")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: `${t("admin.deletedialog.deletbusiness.er")}`,
        description:
          error.response?.data?.message ||
          `${t("admin.deletedialog.deletbusiness.er2")}`,
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
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-red-600" />
            {t("admin.deletedialog.deletbusiness.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.deletedialog.deletbusiness.subtitle")}
            <br />
            <strong>"{businessName}"</strong>
            <br />
            <br />
            {t("admin.deletedialog.deletbusiness.head")}
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("admin.deletedialog.deletbusiness.l1")}</li>
              <li>{t("admin.deletedialog.deletbusiness.l2")}</li>
              <li>{t("admin.deletedialog.deletbusiness.l3")}</li>
              <li>{t("admin.deletedialog.deletbusiness.l4")}</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBusinessMutation.isPending}>
            {t("admin.deletedialog.deletbusiness.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBusinessMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteBusinessMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("admin.deletedialog.deletbusiness.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("admin.deletedialog.deletbusiness.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBusinessDialog;
