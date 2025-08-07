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
import { Loader2 } from "lucide-react";

interface UserFormData {
  user_role: "admin" | "builder" | "supervisor" | "owner" | "viewer";
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface EditUserProps {
  isEditUserModalOpen: boolean;
  setIsEditUserModalOpen: (open: boolean) => void;
  handleEditUserSubmit: (e: React.FormEvent) => void;
  userFormData: UserFormData;
  handleUserInputChange: (field: keyof UserFormData, value: string) => void;
  updateUserMutation: {
    isPending: boolean;
  };
}

export default function EditUser({
  isEditUserModalOpen,
  setIsEditUserModalOpen,
  handleEditUserSubmit,
  userFormData,
  handleUserInputChange,
  updateUserMutation,
}: EditUserProps) {
  return (
    <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user account details and permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditUserSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_user_name">Full Name *</Label>
              <Input
                id="edit_user_name"
                value={userFormData.name}
                onChange={(e) =>
                  handleUserInputChange("name", e.target.value)
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_user_role">User Role *</Label>
              <Select
                value={userFormData.user_role}
                onValueChange={(value) =>
                  handleUserInputChange("user_role", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
            <Label htmlFor="edit_user_email">Email Address *</Label>
            <Input
              id="edit_user_email"
              type="email"
              value={userFormData.email}
              onChange={(e) =>
                handleUserInputChange("email", e.target.value)
              }
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit_user_phone">Phone Number *</Label>
            <Input
              id="edit_user_phone"
              type="tel"
              value={userFormData.phone_number}
              onChange={(e) =>
                handleUserInputChange("phone_number", e.target.value)
              }
              placeholder="Enter phone number (min 10 digits)"
              required
              minLength={10}
            />
          </div>

          <div>
            <Label htmlFor="edit_user_password">Password</Label>
            <Input
              id="edit_user_password"
              type="password"
              value={userFormData.password}
              onChange={(e) =>
                handleUserInputChange("password", e.target.value)
              }
              placeholder="Leave empty to keep current password"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to keep current password. Minimum 6 characters if changing.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditUserModalOpen(false)}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
