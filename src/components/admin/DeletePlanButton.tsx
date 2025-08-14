import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DeletePlanButton({ plan, handleDeletePricing }) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("admin.deletedialog.deleteplan.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.deletedialog.deleteplan.subtitle")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("admin.deletedialog.deleteplan.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeletePricing(plan?.id)}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {t("admin.deletedialog.deleteplan.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
