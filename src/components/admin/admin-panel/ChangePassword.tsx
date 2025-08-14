import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ChangePassword = ({
  handleChangePasswordSubmit,
  passwordFormData,
  handlePasswordInputChange,
  changePasswordMutation,
}) => {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={handleChangePasswordSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div>
        <Label htmlFor="old_password">{t("admin.changepass.form.in1.t")}</Label>
        <Input
          id="old_password"
          type="password"
          placeholder={t("admin.changepass.form.in1.p")}
          value={passwordFormData.old_password}
          onChange={(e) =>
            handlePasswordInputChange("old_password", e.target.value)
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="new_password">
          {" "}
          {t("admin.changepass.form.in2.t")}
        </Label>
        <Input
          id="new_password"
          type="password"
          placeholder={t("admin.changepass.form.in2.p")}
          value={passwordFormData.new_password}
          onChange={(e) =>
            handlePasswordInputChange("new_password", e.target.value)
          }
          minLength={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="new_password_confirmation">
          {t("admin.changepass.form.in3.t")}
        </Label>
        <Input
          id="new_password_confirmation"
          type="password"
          placeholder={t("admin.changepass.form.in3.p")}
          value={passwordFormData.new_password_confirmation}
          onChange={(e) =>
            handlePasswordInputChange(
              "new_password_confirmation",
              e.target.value
            )
          }
          required
        />
      </div>

      {/* Password strength indicator */}
      {passwordFormData.new_password && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            {" "}
            {t("admin.changepass.form.in4.t")}
          </div>
          <div className="space-y-1 text-xs">
            <div
              className={`flex items-center gap-2 ${
                passwordFormData.new_password.length >= 6
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  passwordFormData.new_password.length >= 6
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              />
              {t("admin.changepass.form.in4.p1")}
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordFormData.new_password !==
                  passwordFormData.old_password && passwordFormData.new_password
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  passwordFormData.new_password !==
                    passwordFormData.old_password &&
                  passwordFormData.new_password
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              />
              {t("admin.changepass.form.in4.p2")}
            </div>
            <div
              className={`flex items-center gap-2 ${
                passwordFormData.new_password ===
                  passwordFormData.new_password_confirmation &&
                passwordFormData.new_password_confirmation
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  passwordFormData.new_password ===
                    passwordFormData.new_password_confirmation &&
                  passwordFormData.new_password_confirmation
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              />
              {t("admin.changepass.form.in4.p3")}
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full col-span-1 md:col-span-2 "
        disabled={changePasswordMutation.isPending}
      >
        {changePasswordMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("admin.changepass.chng_pass")}
          </>
        ) : (
          <>
            <Key className="h-4 w-4 mr-2" />
            {t("admin.changepass.update")}
          </>
        )}
      </Button>
    </form>
  );
};

export default ChangePassword;
