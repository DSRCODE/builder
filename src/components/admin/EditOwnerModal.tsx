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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useOwner, useUpdateOwner } from "@/hooks/useOwners";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { OwnerFormData } from "@/types/owner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface EditOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: number | null;
}

export function EditOwnerModal({
  open,
  onOpenChange,
  ownerId,
}: EditOwnerModalProps) {
  const updateOwner = useUpdateOwner();
  const { t } = useTranslation();
  const {
    data: sitesResponse,
    isLoading: sitesLoading,
    error: sitesError,
  } = useConstructionSites();
  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useOwner(ownerId || 0);

  const [formData, setFormData] = useState<OwnerFormData>({
    site_id: "",
    name: "",
    phone_number: "",
  });

  // Populate form when owner data loads
  useEffect(() => {
    if (owner) {
      setFormData({
        site_id: owner.site_id.toString(),
        name: owner.name,
        phone_number: owner.phone_number,
      });
    }
  }, [owner]);

  const handleInputChange = (field: keyof OwnerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      toast.error(
        `${t("owner.edit_owner_modal.validation.no_owner_selected")}`
      );
      return;
    }

    // Validation
    if (!formData.site_id || !formData.name || !formData.phone_number) {
      toast.error(`${t("owner.edit_owner_modal.validation.required_fields")}`);
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ""))) {
      toast.error(
        `${t("owner.edit_owner_modal.validation.invalid_phone_number")}`
      );
      return;
    }

    try {
      await updateOwner.mutateAsync({ id: ownerId, data: formData });

      // Close modal on success
      onOpenChange(false);
    } catch (error) {
      console.error(
        `${t("owner.edit_owner_modal.error_generic_update_fail")}`,
        error
      );
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      site_id: "",
      name: "",
      phone_number: "",
    });
    onOpenChange(false);
  };

  const sites = sitesResponse?.data || [];

  // Loading state
  if (ownerLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("owner.edit_owner_modal.title")}</DialogTitle>
            <DialogDescription>
              {t("owner.edit_owner_modal.loading_owner_details")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
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
  if (ownerError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("owner.edit_owner_modal.title")}</DialogTitle>
            <DialogDescription>
              {t("owner.edit_owner_modal.error_failed_load_owner")}
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{ownerError.message}</AlertDescription>
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
          <DialogTitle>{t("owner.edit_owner_modal.title")}</DialogTitle>
          <DialogDescription>
            {t("owner.edit_owner_modal.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site_id">
              {t("owner.edit_owner_modal.form_labels.site")}
            </Label>
            {sitesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : sitesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t("owner.edit_owner_modal.error_failed_load_sites")}
                  {sitesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.site_id}
                onValueChange={(value) => handleInputChange("site_id", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "owner.edit_owner_modal.placeholders.select_site"
                    )}
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

          {/* Owner Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("owner.edit_owner_modal.form_labels.owner_name")}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={t("owner.edit_owner_modal.placeholders.owner_name")}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">
              {t("owner.edit_owner_modal.form_labels.phone_number")}
            </Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                handleInputChange("phone_number", e.target.value)
              }
              placeholder="919876113200"
            />
            <p className="text-xs text-muted-foreground">
              {t("owner.edit_owner_modal.phone_number_note")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateOwner.isPending}
            >
              {t("owner.edit_owner_modal.buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={updateOwner.isPending || sitesLoading || ownerLoading}
            >
              {updateOwner.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {updateOwner.isPending
                ? `${t("owner.edit_owner_modal.buttons.updating")}`
                : `${t("owner.edit_owner_modal.buttons.update_owner")}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
