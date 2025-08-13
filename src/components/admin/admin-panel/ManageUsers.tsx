import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Mail, Phone, Shield, Trash2 } from "lucide-react";
import { getRoleName, getRoleColor, UserRole } from "@/utils/roleUtils";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";

interface Member {
  id: number;
  user_role_id: number;
  added_by: number | null;
  user_role: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  business_name: string | null;
  phone_number_prefix: string | null;
  phone_number_country_code: string | null;
  phone_number: string;
  address: string | null;
  gender: string | null;
  is_active: number;
  is_deleted: number;
  image: string;
  social_type: string | null;
  social_id: string | null;
  forgot_password_validate_string: string | null;
  verification_code: string | null;
  verification_code_sent_time: string | null;
  is_verified: number;
  verified_by_admin: number;
  language: string | null;
  push_notification: number;
  documents_front: string | null;
  documents_back: string | null;
  created_at: string;
  updated_at: string;
}

interface ManageUsersProps {
  data: Member[];
  openEditUserModal: (user: Member) => void;
}

export default function ManageUsers({
  data,
  openEditUserModal,
}: ManageUsersProps) {
  const { planCheck } = useAuth();
  const check = planCheck?.users_remaining;
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  return (
    <>
      {/* Limit Reached Dialog */}
      <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Users Limit Reached</DialogTitle>
            <DialogDescription>
              You have reached the maximum number of users allowed for your
              plan. Please upgrade your subscription to add more users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLimitDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getRoleColor(user.user_role as UserRole)}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleName(user.user_role as UserRole)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {user.phone_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.is_active ? "default" : "secondary"}
                    className={
                      user.is_active
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant={user.is_verified ? "default" : "secondary"}
                      className={
                        user.is_verified
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {user.is_verified ? "Verified" : "Pending"}
                    </Badge>
                    {user.verified_by_admin ? (
                      <div className="text-xs text-green-600">
                        Admin Verified
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditUserModal(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteUserDialog
                      userId={user.id}
                      userName={user.name}
                      userEmail={user.email}
                      setLimitDialogOpen={setLimitDialogOpen}
                      check={check}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {data.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  ID: {user.id}
                </div>
              </div>
            </div>

            {/* Role */}
            <Badge
              variant="outline"
              className={getRoleColor(user.user_role as UserRole)}
            >
              <Shield className="h-3 w-3 mr-1" />
              {getRoleName(user.user_role as UserRole)}
            </Badge>

            {/* Contact */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3" />
                {user.phone_number}
              </div>
            </div>

            {/* Status & Verification */}
            <div className="flex justify-between text-sm">
              <Badge
                variant={user.is_active ? "default" : "secondary"}
                className={
                  user.is_active
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }
              >
                {user.is_active ? "Active" : "Inactive"}
              </Badge>

              <Badge
                variant={user.is_verified ? "default" : "secondary"}
                className={
                  user.is_verified
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }
              >
                {user.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditUserModal(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DeleteUserDialog
                  userId={user.id}
                  userName={user.name}
                  userEmail={user.email}
                  setLimitDialogOpen={setLimitDialogOpen}
                  check={check}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
