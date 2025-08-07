import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

interface UserFormData {
  user_role: "admin" | "builder" | "supervisor" | "owner" | "viewer";
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface UserLoadingProps {
  option: {
    icon: any;
    color: string;
    title: string;
    description: string;
  };
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;
  handleAddUserSubmit: (e: React.FormEvent) => void;
  userFormData: UserFormData;
  handleUserInputChange: (field: keyof UserFormData, value: string) => void;
  addUserMutation: {
    isPending: boolean;
  };
}

export default function UserLoading({
  option,
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  handleAddUserSubmit,
  userFormData,
  handleUserInputChange,
  addUserMutation,
}: UserLoadingProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <option.icon className={`h-5 w-5 ${option.color}`} />
            <div>
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </div>
          </div>
          <Dialog
            open={isAddUserModalOpen}
            onOpenChange={setIsAddUserModalOpen}
          >
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
                        <SelectItem value="supervisor">
                          Supervisor
                        </SelectItem>
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
                      handleUserInputChange(
                        "phone_number",
                        e.target.value
                      )
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
