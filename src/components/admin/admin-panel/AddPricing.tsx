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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddPricing = ({
  isAddPricingModalOpen,
  setIsAddPricingModalOpen,
  pricingPlans,
  handleAddPricingSubmit,
  pricingFormData,
  handlePricingInputChange,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isAddPricingModalOpen}
      onOpenChange={setIsAddPricingModalOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          // disabled={pricingPlans.length >= 3}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addnewplan.btn")} {pricingPlans.length >= 3 && "(Max 3)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("admin.addnewplan.title")}</DialogTitle>
          <DialogDescription>
            {t("admin.addnewplan.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPricingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan_name">
                {" "}
                {t("admin.addnewplan.form.n1.t")}
              </Label>
              <Input
                id="plan_name"
                value={pricingFormData.plan}
                onChange={(e) =>
                  handlePricingInputChange("plan", e.target.value)
                }
                placeholder={t("admin.addnewplan.form.n1.p")}
                required
              />
            </div>
            <div>
              <Label htmlFor="plan_status">
                {" "}
                {t("admin.addnewplan.form.n2.t")}
              </Label>
              <Select
                value={pricingFormData.status}
                onValueChange={(value) =>
                  handlePricingInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.addnewplan.form.n2.p")} />
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
              <Label htmlFor="monthly_price">
                {" "}
                {t("admin.addnewplan.form.n3.t")}
              </Label>
              <Input
                id="monthly_price"
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
              <Label htmlFor="yearly_price">
                {" "}
                {t("admin.addnewplan.form.n4.t")}
              </Label>
              <Input
                id="yearly_price"
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
              <Label htmlFor="max_users">
                {" "}
                {t("admin.addnewplan.form.n5.t")}
              </Label>
              <Input
                id="max_users"
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
              <Label htmlFor="max_sites">
                {" "}
                {t("admin.addnewplan.form.n6.t")}
              </Label>
              <Input
                id="max_sites"
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
              onClick={() => setIsAddPricingModalOpen(false)}
            >
              {t("admin.addnewplan.cancel")}
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.addnewplan.addplan")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricing;
