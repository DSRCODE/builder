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

const AddManageBusiness = ({
  isAddBusinessModalOpen,
  setIsAddBusinessModalOpen,
  handleAddBusinessSubmit,
  businessFormData,
  handleBusinessInputChange,
  addBusinessMutation,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isAddBusinessModalOpen}
      onOpenChange={setIsAddBusinessModalOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addbussiness.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle> {t("admin.addbussiness.title")}</DialogTitle>
          <DialogDescription>
            {" "}
            {t("admin.addbussiness.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddBusinessSubmit} className="space-y-4">
          <div>
            <Label htmlFor="business_name">
              {" "}
              {t("admin.addbussiness.form.n1.t")}
            </Label>
            <Input
              id="business_name"
              value={businessFormData.name}
              onChange={(e) =>
                handleBusinessInputChange("name", e.target.value)
              }
              placeholder={t("admin.addbussiness.form.n1.p")}
              required
              minLength={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("admin.addbussiness.form.n1.wr")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddBusinessModalOpen(false)}
              disabled={addBusinessMutation.isPending}
            >
              {t("admin.addbussiness.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={addBusinessMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addBusinessMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("admin.addbussiness.adding")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.addbussiness.add")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManageBusiness;
