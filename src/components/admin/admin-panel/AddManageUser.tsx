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
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UserFormData {
  user_role: "admin" | "builder" | "supervisor" | "owner" | "viewer";
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface AddManageUserProps {
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;
  handleAddUserSubmit: (e: React.FormEvent) => void;
  userFormData: UserFormData;
  handleUserInputChange: (field: keyof UserFormData, value: string) => void;
  addUserMutation: {
    isPending: boolean;
  };
  check?: Number;
}

export default function AddManageUser({
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  handleAddUserSubmit,
  userFormData,
  handleUserInputChange,
  addUserMutation,
  check,
}: AddManageUserProps) {
  const { t } = useTranslation();
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const check1 = 0;
  const handleAddSiteClick = () => {
    if (check === 0) {
      setLimitDialogOpen(true);
    } else {
      setIsAddUserModalOpen(true);
    }
  };
  return (
    <>
      {/* Limit Reached Dialog */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.adduser.limit.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.adduser.limit.desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLimitDialogOpen(false)}>
              {" "}
              {t("admin.adduser.limit.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <Button
          onClick={handleAddSiteClick}
          className={`${
            check === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.adduser.btn")}
        </Button>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle> {t("admin.adduser.title")}</DialogTitle>
            <DialogDescription>{t("admin.adduser.subtitle")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_name">
                  {t("admin.adduser.form.n1.t")}
                </Label>
                <Input
                  id="user_name"
                  value={userFormData.name}
                  onChange={(e) =>
                    handleUserInputChange("name", e.target.value)
                  }
                  placeholder={t("admin.adduser.form.n1.p")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="user_role">
                  {t("admin.adduser.form.n2.t")}
                </Label>
                <Select
                  value={userFormData.user_role}
                  onValueChange={(value) =>
                    handleUserInputChange("user_role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.adduser.form.n2.p")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="builder">Builder</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="user_email">{t("admin.adduser.form.n3.t")}</Label>
              <Input
                id="user_email"
                type="email"
                value={userFormData.email}
                onChange={(e) => handleUserInputChange("email", e.target.value)}
                placeholder={t("admin.adduser.form.n3.p")}
                required
              />
            </div>

            <div>
              <Label htmlFor="user_phone">{t("admin.adduser.form.n4.t")}</Label>
              <Input
                id="user_phone"
                type="tel"
                value={userFormData.phone_number}
                onChange={(e) =>
                  handleUserInputChange("phone_number", e.target.value)
                }
                placeholder={t("admin.adduser.form.n4.p")}
                required
                minLength={10}
              />
            </div>

            <div>
              <Label htmlFor="user_password">
                {t("admin.adduser.form.n5.t")}
              </Label>
              <Input
                id="user_password"
                type="password"
                value={userFormData.password}
                onChange={(e) =>
                  handleUserInputChange("password", e.target.value)
                }
                placeholder={t("admin.adduser.form.n5.p")}
                required
                minLength={6}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserModalOpen(false)}
                disabled={addUserMutation.isPending}
              >
                {t("admin.adduser.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={addUserMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {addUserMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("admin.adduser.adding")}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.adduser.add")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
