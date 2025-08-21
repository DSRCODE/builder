import { useAuth } from "@/contexts/authContext";
import { PermissionDenied } from "./PermissionDenied";
import { Loader2 } from "lucide-react";
import { hasRole, USER_ROLES, getRoleName, UserRole } from "@/utils/roleUtils";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[]; // <-- Allow single role or array of roles
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function AdminRoute({
  children,
  requiredRole = USER_ROLES.ADMIN,
  fallbackTitle = "Access Restricted",
  fallbackMessage,
}: AdminRouteProps) {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  const currentUserRole: UserRole | undefined =
    typeof user?.user_role === "string" &&
    (Object.values(USER_ROLES) as string[]).includes(user.user_role)
      ? (user.user_role as UserRole)
      : undefined;

  // New logic: if requiredRole is array, check if currentUserRole is included
  const hasPermission = Array.isArray(requiredRole)
    ? currentUserRole
      ? requiredRole.includes(currentUserRole)
      : false
    : currentUserRole === requiredRole;

  if (!hasPermission) {
    const requiredRoleName = Array.isArray(requiredRole)
      ? requiredRole.map((r) => getRoleName(r)).join(", ")
      : getRoleName(requiredRole);
    const userRoleName = currentUserRole
      ? getRoleName(currentUserRole)
      : "Unknown";

    const defaultMessage =
      fallbackMessage ||
      `You don't have permission to access this page. This page requires role(s): ${requiredRoleName}. Your current role: ${userRoleName}.`;

    return <PermissionDenied title={fallbackTitle} message={defaultMessage} />;
  }

  return <>{children}</>;
}
