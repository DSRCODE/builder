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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditSite = ({
  isEditSiteModalOpen,
  setIsEditSiteModalOpen,
  handleEditSiteSubmit,
  siteFormData,
  handleSiteInputChange,
  editSiteMutation,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isEditSiteModalOpen} onOpenChange={setIsEditSiteModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle> {t("admin.editsite.title")}</DialogTitle>
          <DialogDescription>{t("admin.editsite.subtitle")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSiteSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_site_name">
                {" "}
                {t("admin.editsite.form.in1.t")}
              </Label>
              <Input
                id="edit_site_name"
                value={siteFormData.site_name}
                onChange={(e) =>
                  handleSiteInputChange("site_name", e.target.value)
                }
                placeholder={t("admin.editsite.form.in1.p")}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_location">
                {" "}
                {t("admin.editsite.form.in2.t")}
              </Label>
              <Input
                id="edit_location"
                value={siteFormData.location}
                onChange={(e) =>
                  handleSiteInputChange("location", e.target.value)
                }
                placeholder={t("admin.editsite.form.in2.p")}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit_address">
              {" "}
              {t("admin.editsite.form.in3.t")}
            </Label>
            <Textarea
              id="edit_address"
              value={siteFormData.address}
              onChange={(e) => handleSiteInputChange("address", e.target.value)}
              placeholder={t("admin.editsite.form.in3.p")}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit_currency">
                {" "}
                {t("admin.editsite.form.in4.t")}
              </Label>
              <Select
                value={siteFormData.currency}
                onValueChange={(value) =>
                  handleSiteInputChange("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.editsite.form.in4.p")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₹">₹ (INR)</SelectItem>
                  {/* <SelectItem value="$">$ (USD)</SelectItem>
                  <SelectItem value="€">€ (EUR)</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_estimated_budget">
                {" "}
                {t("admin.editsite.form.in5.t")}
              </Label>
              <Input
                id="edit_estimated_budget"
                type="number"
                min="0"
                step="0.01"
                value={siteFormData.estimated_budget}
                onChange={(e) =>
                  handleSiteInputChange("estimated_budget", e.target.value)
                }
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_progress">
                {" "}
                {t("admin.editsite.form.in6.t")}
              </Label>
              <Input
                id="edit_progress"
                type="number"
                min="0"
                max="100"
                value={siteFormData.progress}
                onChange={(e) =>
                  handleSiteInputChange("progress", e.target.value)
                }
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit_total_spent">
              {" "}
              {t("admin.editsite.form.in7.t")}
            </Label>
            <Input
              id="edit_total_spent"
              type="number"
              min="0"
              step="0.01"
              value={siteFormData.total_spent}
              onChange={(e) =>
                handleSiteInputChange("total_spent", e.target.value)
              }
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditSiteModalOpen(false)}
              disabled={editSiteMutation.isPending}
            >
              {t("admin.editsite.form.btn")}
            </Button>
            <Button
              type="submit"
              disabled={editSiteMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {editSiteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("admin.editsite.form.updating")}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("admin.editsite.form.update")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSite;
