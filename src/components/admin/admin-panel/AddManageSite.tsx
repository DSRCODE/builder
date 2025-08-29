import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddManageSite = ({
  isAddSiteModalOpen,
  setIsAddSiteModalOpen,
  handleAddSiteSubmit,
  siteFormData,
  handleSiteInputChange,
  addSiteMutation,
  check,
  businessesData,
}) => {
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const { t } = useTranslation();
  const handleAddSiteClick = () => {
    if (check === 0) {
      setLimitDialogOpen(true);
    } else {
      setIsAddSiteModalOpen(true);
    }
  };

  const businesses_sites = businessesData?.data;
  console.log(businesses_sites);

  return (
    <>
      {/* Limit Reached Dialog */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.sitemanage.limit.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.sitemanage.limit.desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLimitDialogOpen(false)}>
              {" "}
              {t("admin.sitemanage.limit.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Site Dialog */}
      <Dialog open={isAddSiteModalOpen} onOpenChange={setIsAddSiteModalOpen}>
        <Button
          onClick={handleAddSiteClick}
          className={`${
            check === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addsite.btn")}
        </Button>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("admin.addsite.title")}</DialogTitle>
            <DialogDescription>{t("admin.addsite.subtitle")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSiteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="business_id">
                {t("admin.addsite.form.n0.t")}
              </Label>
              <Select
                // id="business_id"
                value={siteFormData.business_id}
                onValueChange={(value) =>
                  handleSiteInputChange("business_id", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.addsite.form.n0.p")} />
                </SelectTrigger>
                <SelectContent>
                  {businesses_sites?.map((site: any) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name">
                  {t("admin.addsite.form.n1.t")}
                </Label>
                <Input
                  id="site_name"
                  value={siteFormData.site_name}
                  onChange={(e) =>
                    handleSiteInputChange("site_name", e.target.value)
                  }
                  placeholder={t("admin.addsite.form.n1.p")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">{t("admin.addsite.form.n2.t")}</Label>
                <Input
                  id="location"
                  value={siteFormData.location}
                  onChange={(e) =>
                    handleSiteInputChange("location", e.target.value)
                  }
                  placeholder={t("admin.addsite.form.n2.p")}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">{t("admin.addsite.form.n3.t")}</Label>
              <Textarea
                id="address"
                value={siteFormData.address}
                onChange={(e) =>
                  handleSiteInputChange("address", e.target.value)
                }
                placeholder={t("admin.addsite.form.n3.p")}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">{t("admin.addsite.form.n4.t")}</Label>
                <Select
                  value={siteFormData.currency}
                  onValueChange={(value) =>
                    handleSiteInputChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.addsite.form.n4.p")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹">₹ (INR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimated_budget">
                  {t("admin.addsite.form.n5.t")}
                </Label>
                <Input
                  id="estimated_budget"
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
                <Label htmlFor="progress">{t("admin.addsite.form.n6.t")}</Label>
                <Input
                  id="progress"
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
              <Label htmlFor="total_spent">
                {t("admin.addsite.form.n7.t")}
              </Label>
              <Input
                id="total_spent"
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
                onClick={() => setIsAddSiteModalOpen(false)}
                disabled={addSiteMutation.isPending}
              >
                {t("admin.addmaterialcategory.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={addSiteMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {addSiteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("admin.addsite.form.adding")}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.addsite.form.add")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddManageSite;
