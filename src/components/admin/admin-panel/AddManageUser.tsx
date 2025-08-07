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
}

export default function AddManageUser({
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  handleAddUserSubmit,
  userFormData,
  handleUserInputChange,
  addUserMutation,
}: AddManageUserProps) {
  return (
    <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with role and permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUserSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user_name">Full Name *</Label>
              <Input
                id="user_name"
                value={userFormData.name}
                onChange={(e) =>
                  handleUserInputChange("name", e.target.value)
                }
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="user_role">User Role *</Label>
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
            <Label htmlFor="user_email">Email Address *</Label>
            <Input
              id="user_email"
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
            <Label htmlFor="user_phone">Phone Number *</Label>
            <Input
              id="user_phone"
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
            <Label htmlFor="user_password">Password *</Label>
            <Input
              id="user_password"
              type="password"
              value={userFormData.password}
              onChange={(e) =>
                handleUserInputChange("password", e.target.value)
              }
              placeholder="Enter password (min 6 characters)"
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addUserMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
