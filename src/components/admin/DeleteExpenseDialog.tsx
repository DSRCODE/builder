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
import { useTranslation } from "react-i18next";

interface DeleteExpenseDialogProps {
  expenseId: number;
  expenseDescription: string;
  children?: React.ReactNode;
}

const DeleteExpenseDialog = ({
  expenseId,
  expenseDescription,
  children,
}: DeleteExpenseDialogProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/expenses/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: ` ${t("expens.error.suc")}`,
        description: ` ${t("expens.delete_suc_dec")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: ` ${t("expens.error.er")}`,
        description:
          error.response?.data?.message || ` ${t("expens.delete_fail_dec")}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteExpenseMutation.mutate(expenseId);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("expens.delete_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("expens.delete_subtitle")}
            <br />
            <strong>"{expenseDescription}"</strong>
            <br />
            {t("expens.delete_action_not_done")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteExpenseMutation.isPending}>
            {t("expens.buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteExpenseMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteExpenseMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("expens.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("expens.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteExpenseDialog;
