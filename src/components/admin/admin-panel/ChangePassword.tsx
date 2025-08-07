import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2 } from "lucide-react";

const ChangePassword = ({
  handleChangePasswordSubmit,
  passwordFormData,
  handlePasswordInputChange,
  changePasswordMutation,
}) => {
  return (
    <form
      onSubmit={handleChangePasswordSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div>
        <Label htmlFor="old_password">Current Password *</Label>
        <Input
          id="old_password"
          type="password"
          placeholder="Enter current password"
          value={passwordFormData.old_password}
          onChange={(e) =>
            handlePasswordInputChange("old_password", e.target.value)
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="new_password">New Password *</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="Enter new password (min 6 characters)"
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
          Confirm New Password *
        </Label>
        <Input
          id="new_password_confirmation"
          type="password"
          placeholder="Confirm new password"
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
          <div className="text-sm font-medium">Password Requirements:</div>
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
              At least 6 characters
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
              Different from current password
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
              Passwords match
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
            Changing Password...
          </>
        ) : (
          <>
            <Key className="h-4 w-4 mr-2" />
            Update Password
          </>
        )}
      </Button>
    </form>
  );
};

export default ChangePassword;
