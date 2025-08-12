// Role constants
export const USER_ROLES = {
  SUPERADMIN: "super_admin",
  ADMIN: "admin",
  BUILDER: "builder",
  SUPERVISOR: "supervisor",
  OWNER: "owner",
  VIEWER: "viewer",
} as const;

// Type for role values
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Role names mapping
export const ROLE_NAMES: Record<UserRole, string> = {
  [USER_ROLES.SUPERADMIN]: "Super Admin",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.BUILDER]: "Builder",
  [USER_ROLES.SUPERVISOR]: "Supervisor",
  [USER_ROLES.OWNER]: "Owner",
  [USER_ROLES.VIEWER]: "Viewer",
};

// Role hierarchy (index 0 = highest permission)
const ROLE_HIERARCHY: UserRole[] = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.BUILDER,
  USER_ROLES.SUPERVISOR,
  USER_ROLES.OWNER,
  USER_ROLES.VIEWER,
];

// ✅ Check if user has required role or higher
export const hasRole = (
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;
  return (
    ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole)
  );
};

// ✅ Specific role checks
export const isAdmin = (userRole: UserRole | undefined): boolean =>
  hasRole(userRole, USER_ROLES.ADMIN);

export const isBuilderOrHigher = (userRole: UserRole | undefined): boolean =>
  hasRole(userRole, USER_ROLES.BUILDER);

export const isSupervisorOrHigher = (userRole: UserRole | undefined): boolean =>
  hasRole(userRole, USER_ROLES.SUPERVISOR);

export const isOwnerOrHigher = (userRole: UserRole | undefined): boolean =>
  hasRole(userRole, USER_ROLES.OWNER);

export const isViewer = (userRole: UserRole | undefined): boolean =>
  userRole === USER_ROLES.VIEWER;

// ✅ Get role name
export const getRoleName = (role: UserRole | undefined): string => {
  if (!role) return "Unknown";
  return ROLE_NAMES[role];
};

// ✅ Role color badges
export const getRoleColor = (role: UserRole | undefined): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case USER_ROLES.BUILDER:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case USER_ROLES.SUPERVISOR:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case USER_ROLES.OWNER:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case USER_ROLES.VIEWER:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case USER_ROLES.SUPERADMIN:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
