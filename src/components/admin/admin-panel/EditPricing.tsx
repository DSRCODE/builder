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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditPricing = ({
  isEditPricingModalOpen,
  setIsEditPricingModalOpen,
  handleEditPricingSubmit,
  pricingFormData,
  handlePricingInputChange,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isEditPricingModalOpen}
      onOpenChange={setIsEditPricingModalOpen}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("admin.editpricing.title")}</DialogTitle>
          <DialogDescription>
            {t("admin.editpricing.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditPricingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_plan_name">
                {" "}
                {t("admin.editpricing.form.in1.t")}
              </Label>
              <Input
                id="edit_plan_name"
                value={pricingFormData.plan}
                onChange={(e) =>
                  handlePricingInputChange("plan", e.target.value)
                }
                placeholder={t("admin.editpricing.form.in1.p")}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_plan_status">
                {t("admin.editpricing.form.in2.t")}
              </Label>
              <Select
                value={pricingFormData.status}
                onValueChange={(value) =>
                  handlePricingInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("admin.editpricing.form.in2.p")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_monthly_price">
                {t("admin.editpricing.form.in3.t")}
              </Label>
              <Input
                id="edit_monthly_price"
                type="number"
                min="0"
                step="0.01"
                value={pricingFormData.monthlyPrice}
                onChange={(e) =>
                  handlePricingInputChange("monthlyPrice", e.target.value)
                }
                placeholder="49.99"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_yearly_price">
                {" "}
                {t("admin.editpricing.form.in4.t")}
              </Label>
              <Input
                id="edit_yearly_price"
                type="number"
                min="0"
                step="0.01"
                value={pricingFormData.yearlyPrice}
                onChange={(e) =>
                  handlePricingInputChange("yearlyPrice", e.target.value)
                }
                placeholder="499.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_max_users">
                {" "}
                {t("admin.editpricing.form.in5.t")}
              </Label>
              <Input
                id="edit_max_users"
                type="number"
                min="1"
                value={pricingFormData.users}
                onChange={(e) =>
                  handlePricingInputChange("users", e.target.value)
                }
                placeholder="5"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_max_sites">
                {" "}
                {t("admin.editpricing.form.in6.t")}
              </Label>
              <Input
                id="edit_max_sites"
                type="number"
                min="1"
                value={pricingFormData.sites}
                onChange={(e) =>
                  handlePricingInputChange("sites", e.target.value)
                }
                placeholder="3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPricingModalOpen(false)}
            >
              {t("admin.editpricing.form.btn")}
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Edit className="h-4 w-4 mr-2" />
              {t("admin.editpricing.form.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPricing;
