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

export default function DeleteMaterialCategory({
  category,
  handleDeleteMaterialCategory,
}) {
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
            {t("admin.addmaterialcategory.deletematerial.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.addmaterialcategory.deletematerial.subtitle")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("admin.addmaterialcategory.deletematerial.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteMaterialCategory(category?.id)}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {t("admin.addmaterialcategory.deletematerial.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
