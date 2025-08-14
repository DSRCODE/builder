import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddMaterialCategory = ({
  isAddMaterialCategoryModalOpen,
  setIsAddMaterialCategoryModalOpen,
  handleAddMaterialCategorySubmit,
  materialCategoryFormData,
  handleMaterialCategoryInputChange,
  addMaterialCategoryMutation,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isAddMaterialCategoryModalOpen}
      onOpenChange={setIsAddMaterialCategoryModalOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addmaterialcategory.btn")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.addmaterialcategory.btn")}</DialogTitle>
          <DialogDescription>
            {t("admin.addmaterialcategory.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMaterialCategorySubmit} className="space-y-4">
          <div>
            <Label htmlFor="category_name">
              {t("admin.addmaterialcategory.form.n1.t")}
            </Label>
            <Input
              id="category_name"
              value={materialCategoryFormData.name}
              onChange={(e) =>
                handleMaterialCategoryInputChange("name", e.target.value)
              }
              placeholder={t("admin.addmaterialcategory.form.n1.p")}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddMaterialCategoryModalOpen(false)}
              disabled={addMaterialCategoryMutation.isPending}
            >
              {t("admin.addmaterialcategory.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={addMaterialCategoryMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addMaterialCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("admin.addmaterialcategory.adding")}.
                </>
              ) : (
                `${t("admin.addmaterialcategory.add")}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialCategory;
