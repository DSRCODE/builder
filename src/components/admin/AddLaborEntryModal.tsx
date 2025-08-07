import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateLaborEntry } from "@/hooks/useLaborEntry";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { LaborEntryFormData } from "@/types/laborEntry";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AddLaborEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLaborEntryModal({
  open,
  onOpenChange,
}: AddLaborEntryModalProps) {
  const createLaborEntry = useCreateLaborEntry();
  const { t } = useTranslation();
  const {
    data: sitesResponse,
    isLoading: sitesLoading,
    error: sitesError,
  } = useConstructionSites();
  const [date, setDate] = useState<Date>();

  const [formData, setFormData] = useState<LaborEntryFormData>({
    site_id: "",
    date: "",
    masons: "",
    helpers: "",
    lady_helpers: "",
    manual_total_wage: "",
    override_comment: "",
  });

  const handleInputChange = (
    field: keyof LaborEntryFormData,
    value: string
  ) => {
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
      handleInputChange("date", formattedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.site_id || !formData.date) {
      toast.error(`${t("materials.form_error_required_fields")}`);
      return;
    }

    try {
      await createLaborEntry.mutateAsync(formData);

      // Reset form and close modal on success
      setFormData({
        site_id: "",
        date: "",
        masons: "",
        helpers: "",
        lady_helpers: "",
        manual_total_wage: "",
        override_comment: "",
      });
      setDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error(`${t("labor.form_error_create_failed")}`, error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      site_id: "",
      date: "",
      masons: "",
      helpers: "",
      lady_helpers: "",
      manual_total_wage: "",
      override_comment: "",
    });
    setDate(undefined);
    onOpenChange(false);
  };

  const sites = sitesResponse?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("labor.add_entry_title")}</DialogTitle>
          <DialogDescription>
            {t("labor.add_entry_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site_id">{t("labor.form.site_label")}</Label>
            {sitesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : sitesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("labor.form.site_placeholder")} {sitesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.site_id}
                onValueChange={(value) => handleInputChange("site_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("labor.form.site_placeholder")} />
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

          {/* Date Selection */}
          <div className="space-y-2">
            <Label> {t("labor.form.date_label")}</Label>
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
                    : `${t("labor.form.date_placeholder")}`}
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

          {/* Worker Counts */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="masons"> {t("labor.form.masons_label")}</Label>
              <Input
                id="masons"
                type="number"
                min="0"
                value={formData.masons}
                onChange={(e) => handleInputChange("masons", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helpers">{t("labor.form.helpers_label")}</Label>
              <Input
                id="helpers"
                type="number"
                min="0"
                value={formData.helpers}
                onChange={(e) => handleInputChange("helpers", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lady_helpers">
                {t("labor.form.lady_helpers_label")}
              </Label>
              <Input
                id="lady_helpers"
                type="number"
                min="0"
                value={formData.lady_helpers}
                onChange={(e) =>
                  handleInputChange("lady_helpers", e.target.value)
                }
                placeholder="0"
              />
            </div>
          </div>

          {/* Manual Total Wage */}
          <div className="space-y-2">
            <Label htmlFor="manual_total_wage">
              {" "}
              {t("labor.form.manual_wage_label")}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="manual_total_wage"
                type="number"
                step="0.01"
                min="0"
                value={formData.manual_total_wage}
                onChange={(e) =>
                  handleInputChange("manual_total_wage", e.target.value)
                }
                className="pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("labor.form.manual_wage_hint")}
            </p>
          </div>

          {/* Override Comment */}
          <div className="space-y-2">
            <Label htmlFor="override_comment">
              {" "}
              {t("labor.form.comments_label")}
            </Label>
            <Textarea
              id="override_comment"
              value={formData.override_comment}
              onChange={(e) =>
                handleInputChange("override_comment", e.target.value)
              }
              placeholder={t("labor.form.comments_placeholder")}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createLaborEntry.isPending}
            >
              {t("labor.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={createLaborEntry.isPending || sitesLoading}
            >
              {createLaborEntry.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createLaborEntry.isPending
                ? `${t("labor.buttons.update_entry")}`
                : `${t("labor.buttons.create_entry")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
