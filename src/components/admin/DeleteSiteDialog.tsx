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
import { useTranslation } from "react-i18next";

interface DeleteSiteDialogProps {
  siteId: number;
  siteName: string;
  children?: React.ReactNode;
  setLimitDialogOpen?: (open: boolean) => void;
  check?: Number;
}

const DeleteSiteDialog = ({
  setLimitDialogOpen,
  check,
  siteId,
  siteName,
  children,
}: DeleteSiteDialogProps) => {
  const { t } = useTranslation();
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
        title: `${t("admin.deletedialog.deletsites.suc")}`,
        description: `${t("admin.deletedialog.deletsites.suc1")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["construction-sites"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: `${t("admin.deletedialog.deletsites.er")}`,
        description:
          error.response?.data?.message ||
          `${t("admin.deletedialog.deletsites.er1")}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteSiteMutation.mutate(siteId);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (check === 0) {
      e.preventDefault();
      setLimitDialogOpen?.(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={handleTriggerClick}>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-red-600" />
            {t("admin.deletedialog.deletsites.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.deletedialog.deletsites.subtitle")}
            <br />
            <strong>"{siteName}"</strong>
            <br />
            <br />
            {t("admin.deletedialog.deletsites.head")}
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li> {t("admin.deletedialog.deletsites.l1")}</li>
              <li> {t("admin.deletedialog.deletsites.l2")}</li>
              <li> {t("admin.deletedialog.deletsites.l3")}</li>
              <li> {t("admin.deletedialog.deletsites.l4")}</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSiteMutation.isPending}>
            {t("admin.deletedialog.deletsites.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSiteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSiteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("admin.deletedialog.deletsites.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("admin.deletedialog.deletsites.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSiteDialog;
