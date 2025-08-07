import { useAuth } from "@/contexts/authContext";
import { PermissionDenied } from "./PermissionDenied";
import { Loader2 } from "lucide-react";
import { hasRole, USER_ROLES, getRoleName } from "@/utils/roleUtils";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: number; // 1 = Admin, 2 = Builder, 3 = Supervisor, 4 = Owner, 5 = Viewer
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function AdminRoute({ 
  children, 
  requiredRole = USER_ROLES.ADMIN, // Default to admin only
  fallbackTitle = "Access Restricted",
  fallbackMessage
}: AdminRouteProps) {
  const { user, userLoading } = useAuth();

  // Show loading while checking user permissions
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

  // Check if user exists and has required role
  const userHasPermission = hasRole(user?.user_role_id, requiredRole);

  if (!userHasPermission) {
    const requiredRoleName = getRoleName(requiredRole);
    const userRoleName = getRoleName(user?.user_role_id);
    
    const defaultMessage = fallbackMessage || 
      `You don't have permission to access this page. This page requires ${requiredRoleName} access or higher. Your current role: ${userRoleName}.`;

    return (
      <PermissionDenied 
        title={fallbackTitle}
        message={defaultMessage}
      />
    );
  }

  return <>{children}</>;
}
