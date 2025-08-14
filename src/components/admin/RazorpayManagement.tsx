import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  CreditCard,
  Key,
  Shield,
  Settings,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  useRazorpaySettings,
  useUpdateRazorpaySettings,
} from "@/hooks/useRazorpaySettings";
import { RazorpaySettings } from "@/services/razorpaySettingsService";
import { useTranslation } from "react-i18next";

export const RazorpayManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<RazorpaySettings>({
    site_key: "",
    secret_key: "",
    mode: "",
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Hooks
  const {
    data: settingsResponse,
    isLoading,
    error,
    refetch,
  } = useRazorpaySettings();
  const updateSettingsMutation = useUpdateRazorpaySettings();

  const settings = settingsResponse?.data;

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        site_key: settings.site_key || "",
        secret_key: settings.secret_key || "",
        mode: settings.mode || "test",
      });
      setHasChanges(false);
    }
  }, [settings]);

  // Handle form input changes
  const handleInputChange = (field: keyof RazorpaySettings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.site_key.trim() || !formData.secret_key.trim()) {
      toast({
        title: `${t("admin.mangerazorpay.val_err")}`,
        description: `${t("admin.mangerazorpay.val_ds")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateSettingsMutation.mutateAsync(formData);

      toast({
        title: `${t("admin.mangerazorpay.suc")}`,
        description: `${t("admin.mangerazorpay.s_msg")}`,
      });

      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: `${t("admin.mangerazorpay.er")}`,
        description: error.message || `${t("admin.mangerazorpay.f_msg")}`,
        variant: "destructive",
      });
    }
  };

  // Handle reset form
  const handleReset = () => {
    if (settings) {
      setFormData({
        site_key: settings.site_key || "",
        secret_key: settings.secret_key || "",
        mode: settings.mode || "test",
      });
      setHasChanges(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {isLoading ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("admin.mangerazorpay.err")} {error.message}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {t("admin.mangerazorpay.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Key */}
          <div className="space-y-2">
            <Label htmlFor="site_key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              {t("admin.mangerazorpay.form.n1.t")}
            </Label>
            <Input
              id="site_key"
              type="text"
              value={formData.site_key}
              onChange={(e) => handleInputChange("site_key", e.target.value)}
              placeholder="rzp_test_xxxxxxxxxx or rzp_live_xxxxxxxxxx"
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("admin.mangerazorpay.form.n1.ds")}
            </p>
          </div>

          {/* Secret Key */}
          <div className="space-y-2">
            <Label htmlFor="secret_key" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("admin.mangerazorpay.form.n2.t")}
            </Label>
            <div className="relative">
              <Input
                id="secret_key"
                type={showSecretKey ? "text" : "password"}
                value={formData.secret_key}
                onChange={(e) =>
                  handleInputChange("secret_key", e.target.value)
                }
                placeholder={t("admin.mangerazorpay.form.n2.p")}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.mangerazorpay.form.n2.ds")}
            </p>
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <Label htmlFor="mode" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("admin.mangerazorpay.form.n3.t1")}
            </Label>
            <Select
              value={formData.mode}
              onValueChange={(value) => handleInputChange("mode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    {t("admin.mangerazorpay.form.n3.t2")}
                  </div>
                </SelectItem>
                <SelectItem value="live">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {t("admin.mangerazorpay.form.n3.t3")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.mode === "test"
                ? `${t("admin.mangerazorpay.form.n3.ds1")}`
                : `${t("admin.mangerazorpay.form.n3.ds2")}`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!hasChanges || updateSettingsMutation.isPending}
              className="flex-1"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("admin.mangerazorpay.updating")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("admin.mangerazorpay.saving")}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || updateSettingsMutation.isPending}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("admin.mangerazorpay.reset")}
            </Button>
          </div>

          {/* Status Indicator */}
          {hasChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("admin.mangerazorpay.status_indicator")}
              </AlertDescription>
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};
