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
import {
  useMasonAdvance,
  useUpdateMasonAdvance,
} from "@/hooks/useMasonAdvances";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { MasonAdvanceFormData } from "@/types/masonAdvance";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface EditMasonAdvanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masonAdvanceId: number | null;
}

export function EditMasonAdvanceModal({
  open,
  onOpenChange,
  masonAdvanceId,
}: EditMasonAdvanceModalProps) {
  const updateMasonAdvance = useUpdateMasonAdvance();
  const { t } = useTranslation();
  const {
    data: sitesResponse,
    isLoading: sitesLoading,
    error: sitesError,
  } = useConstructionSites();
  const {
    data: masonAdvance,
    isLoading: advanceLoading,
    error: advanceError,
  } = useMasonAdvance(masonAdvanceId || 0);

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<MasonAdvanceFormData>({
    site_id: "",
    date: "",
    mason_name: "",
    amount: "",
  });

  // Populate form when mason advance data loads
  useEffect(() => {
    if (masonAdvance) {
      const advanceDate = new Date(masonAdvance.date);
      setDate(advanceDate);

      setFormData({
        site_id: masonAdvance.site_id.toString(),
        date: format(advanceDate, "yyyy-MM-dd"),
        mason_name: masonAdvance.mason_name,
        amount: masonAdvance.amount,
      });
    }
  }, [masonAdvance]);

  const handleInputChange = (
    field: keyof MasonAdvanceFormData,
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

    if (!masonAdvanceId) {
      toast.error("No mason advance selected for editing");
      return;
    }

    // Validation
    if (
      !formData.site_id ||
      !formData.date ||
      !formData.mason_name ||
      !formData.amount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await updateMasonAdvance.mutateAsync({
        id: masonAdvanceId,
        data: formData,
      });

      // Close modal on success
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update mason advance:", error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      site_id: "",
      date: "",
      mason_name: "",
      amount: "",
    });
    setDate(undefined);
    onOpenChange(false);
  };

  const sites = sitesResponse?.data || [];

  // Loading state
  if (advanceLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Mason Advance</DialogTitle>
            <DialogDescription>
              Loading mason advance details...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
  if (advanceError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Mason Advance</DialogTitle>
            <DialogDescription>
              Failed to load mason advance details.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{advanceError.message}</AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("advances.form.edit_title")}</DialogTitle>
          <DialogDescription>
            {t("advances.form.edit_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site_id">
              {t("advances.form.fields.site_label")}{" "}
            </Label>
            {sitesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : sitesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load sites: {sitesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.site_id}
                onValueChange={(value) => handleInputChange("site_id", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("advances.form.fields.site_placeholder")}
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

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>{t("advances.form.fields.date_label")}</Label>
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
                    : `${t("advances.form.fields.date_placeholder")}`}
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

          {/* Mason Name */}
          <div className="space-y-2">
            <Label htmlFor="mason_name">
              {t("advances.form.fields.mason_name_label")}
            </Label>
            <Input
              id="mason_name"
              value={formData.mason_name}
              onChange={(e) => handleInputChange("mason_name", e.target.value)}
              placeholder={t("advances.form.fields.mason_name_placeholder")}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {t("advances.form.fields.amount_label")}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="pl-8"
                placeholder="1000.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("advances.form.fields.amount_hint")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMasonAdvance.isPending}
            >
              {t("advances.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={
                updateMasonAdvance.isPending || sitesLoading || advanceLoading
              }
            >
              {updateMasonAdvance.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateMasonAdvance.isPending
                ? `${t("advances.buttons.updating")}`
                : `${t("advances.buttons.update")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
