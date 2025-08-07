import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMaterial, useUpdateMaterial } from "@/hooks/useMaterials";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { MaterialFormData } from "@/types/material";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface EditMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialId: number | null;
}

// Material categories - same as AddMaterialModal
const materialCategories = [
  { id: 1, name: "Building Materials" },
  { id: 2, name: "Structural" },
  { id: 3, name: "Electrical" },
  { id: 4, name: "Plumbing" },
  { id: 5, name: "Finishing" },
  { id: 6, name: "Hardware" },
  { id: 7, name: "Tools" },
];

// Common units for materials
const commonUnits = [
  "bags",
  "pieces",
  "kg",
  "tons",
  "meters",
  "feet",
  "liters",
  "gallons",
  "boxes",
  "rolls",
  "sheets",
  "units",
];

export function EditMaterialModal({
  open,
  onOpenChange,
  materialId,
}: EditMaterialModalProps) {
  const updateMaterial = useUpdateMaterial();
  const { t } = useTranslation();
  const {
    data: sitesResponse,
    isLoading: sitesLoading,
    error: sitesError,
  } = useConstructionSites();
  const {
    data: material,
    isLoading: materialLoading,
    error: materialError,
  } = useMaterial(materialId || 0);

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<MaterialFormData>({
    site_id: "",
    material_name: "",
    category_id: "",
    quantity: "",
    unit: "",
    amount_spent: "",
    date_added: "",
  });

  // Populate form when material data loads
  useEffect(() => {
    if (material) {
      const materialDate = new Date(material.date_added);
      setDate(materialDate);

      setFormData({
        site_id: material.site_id.toString(),
        material_name: material.material_name,
        category_id: material.category_id.toString(),
        quantity: material.quantity,
        unit: material.unit,
        amount_spent: material.amount_spent,
        date_added: format(materialDate, "yyyy-MM-dd"),
      });
    }
  }, [material]);

  const handleInputChange = (field: keyof MaterialFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Format date as YYYY-MM-DD for API
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      handleInputChange("date_added", formattedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!materialId) {
      toast.error(`${t("materials.no_material_selected")}`);
      return;
    }

    // Validation
    if (
      !formData.site_id ||
      !formData.material_name ||
      !formData.category_id ||
      !formData.quantity ||
      !formData.unit ||
      !formData.amount_spent ||
      !formData.date_added
    ) {
      toast.error(`${t("materials.form_error_required_fields")}`);
      return;
    }

    try {
      await updateMaterial.mutateAsync({ id: materialId, data: formData });

      // Close modal on success
      onOpenChange(false);
    } catch (error) {
      console.error(`${t("materials.form_error_update_failed")}`, error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      site_id: "",
      material_name: "",
      category_id: "",
      quantity: "",
      unit: "",
      amount_spent: "",
      date_added: "",
    });
    setDate(undefined);
    onOpenChange(false);
  };

  const sites = sitesResponse?.data || [];

  // Loading state
  if (materialLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("materials.edit_material_title")}</DialogTitle>
            <DialogDescription>
              {t("materials.load_material")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (materialError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle> {t("materials.edit_material_title")}</DialogTitle>
            <DialogDescription>
              {t("materials.failed_to_load_materials")}
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{materialError.message}</AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {t("sites.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("materials.edit_material_title")}</DialogTitle>
          <DialogDescription>
            {t("materials.update_material_entry")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site_id">{t("Dashboard.sites")} *</Label>
            {sitesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : sitesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("materials.form_error_load_sites")} {sitesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.site_id}
                onValueChange={(value) => handleInputChange("site_id", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${t("materials.label_select_site")}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      <div>
                        <div className="font-medium">{site.site_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {site.address}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {site.business.name} • {site.currency}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Material Name */}
          <div className="space-y-2">
            <Label htmlFor="material_name">{`${t(
              "materials.label_material_name"
            )}`}</Label>
            <Input
              id="material_name"
              value={formData.material_name}
              onChange={(e) =>
                handleInputChange("material_name", e.target.value)
              }
              placeholder={`${t("materials.placeholder_material_name")}`}
            />
          </div>

          {/* Category and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">{`${t(
                "materials.label_category"
              )}`}</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  handleInputChange("category_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${t("materials.placeholder_category")}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {materialCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{`${t("materials.label_date_added")}`}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "PPP")
                      : `${t("materials.placeholder_date")}`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quantity and Unit Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{`${t(
                "materials.label_quantity"
              )}`}</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder={`${t("materials.placeholder_quantity")}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">{`${t("materials.label_unit")}`}</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${t("materials.placeholder_unit")}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Spent */}
          <div className="space-y-2">
            <Label htmlFor="amount_spent">{`${t(
              "materials.label_amount_spent"
            )}`}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount_spent"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount_spent}
                onChange={(e) =>
                  handleInputChange("amount_spent", e.target.value)
                }
                className="pl-8"
                placeholder={`${t("materials.placeholder_amount_spent")}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMaterial.isPending}
            >
              {`${t("materials.button_cancel")}`}
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={
                updateMaterial.isPending || sitesLoading || materialLoading
              }
            >
              {updateMaterial.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateMaterial.isPending
                ? `${t("materials.updating")}`
                : `${t("materials.update")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
