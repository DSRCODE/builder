import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditBusiness = ({
  isEditBusinessModalOpen,
  setIsEditBusinessModalOpen,
  handleEditBusinessSubmit,
  businessFormData,
  handleBusinessInputChange,
  updateBusinessMutation,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isEditBusinessModalOpen}
      onOpenChange={setIsEditBusinessModalOpen}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("admin.editbusiness.title")}</DialogTitle>
          <DialogDescription>
            {t("admin.editbusiness.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditBusinessSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit_business_name">
              {" "}
              {t("admin.editbusiness.form.in1.t")}
            </Label>
            <Input
              id="edit_business_name"
              value={businessFormData.name}
              onChange={(e) =>
                handleBusinessInputChange("name", e.target.value)
              }
              placeholder={t("admin.editbusiness.form.in1.p")}
              required
              minLength={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("admin.editbusiness.form.in1.wr")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditBusinessModalOpen(false)}
              disabled={updateBusinessMutation.isPending}
            >
              {t("admin.editbusiness.btn")}
            </Button>
            <Button
              type="submit"
              disabled={updateBusinessMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updateBusinessMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("admin.editbusiness.updating")}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("admin.editbusiness.update")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusiness;
