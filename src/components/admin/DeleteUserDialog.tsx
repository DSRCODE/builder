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
import { Trash2, Loader2, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface DeleteUserDialogProps {
  userId: number;
  userName: string;
  userEmail: string;
  children?: React.ReactNode;
  setLimitDialogOpen?: (open: boolean) => void;
  check?: Number;
}

const DeleteUserDialog = ({
  setLimitDialogOpen,
  check,
  userId,
  userName,
  userEmail,
  children,
}: DeleteUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/member/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: `${t("admin.deletedialog.deletuser.suc")}`,
        description: `${t("admin.deletedialog.deletuser.suc2")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: `${t("admin.deletedialog.deletuser.er")}`,
        description:
          error.response?.data?.message ||
          `${t("admin.deletedialog.deletuser.er2")}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteUserMutation.mutate(userId);
  };
  const check1 = 0;
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (check === 0) {
      // e.preventDefault();
      setLimitDialogOpen(true);
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
            <Users className="h-5 w-5 text-red-600" />
            {t("admin.deletedialog.deletuser.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.deletedialog.deletuser.subtitle")}
            <br />
            <strong>"{userName}"</strong>
            <br />
            <span className="text-sm text-muted-foreground">({userEmail})</span>
            <br />
            <br />
            {t("admin.deletedialog.deletuser.head")}
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li> {t("admin.deletedialog.deletuser.l1")}</li>
              <li> {t("admin.deletedialog.deletuser.l2")}</li>
              <li> {t("admin.deletedialog.deletuser.l3")}</li>
              <li> {t("admin.deletedialog.deletuser.l4")}</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>
            {t("admin.deletedialog.deletuser.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("admin.deletedialog.deletuser.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("admin.deletedialog.deletuser.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
