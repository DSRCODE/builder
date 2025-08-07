// Role constants
export const USER_ROLES = {
  ADMIN: 1,
  BUILDER: 2,
  SUPERVISOR: 3,
  OWNER: 4,
  VIEWER: 5,
} as const;

// Role names mapping
export const ROLE_NAMES = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.BUILDER]: 'Builder',
  [USER_ROLES.SUPERVISOR]: 'Supervisor',
  [USER_ROLES.OWNER]: 'Owner',
  [USER_ROLES.VIEWER]: 'Viewer',
} as const;

// Check if user has required role or higher
export const hasRole = (userRoleId: number | undefined, requiredRole: number): boolean => {
  if (!userRoleId) return false;
  return userRoleId <= requiredRole; // Lower numbers = higher permissions
};

// Check if user is admin
export const isAdmin = (userRoleId: number | undefined): boolean => {
  return hasRole(userRoleId, USER_ROLES.ADMIN);
};

// Check if user is builder or higher
export const isBuilderOrHigher = (userRoleId: number | undefined): boolean => {
  return hasRole(userRoleId, USER_ROLES.BUILDER);
};

// Check if user is supervisor or higher
export const isSupervisorOrHigher = (userRoleId: number | undefined): boolean => {
  return hasRole(userRoleId, USER_ROLES.SUPERVISOR);
};

// Check if user is owner or higher
export const isOwnerOrHigher = (userRoleId: number | undefined): boolean => {
  return hasRole(userRoleId, USER_ROLES.OWNER);
};

// Check if user is viewer (lowest permission level)
export const isViewer = (userRoleId: number | undefined): boolean => {
  return userRoleId === USER_ROLES.VIEWER;
};

// Get role name from role ID
export const getRoleName = (roleId: number | undefined): string => {
  if (!roleId || !(roleId in ROLE_NAMES)) return 'Unknown';
  return ROLE_NAMES[roleId as keyof typeof ROLE_NAMES];
};

// Get role color for badges
export const getRoleColor = (roleId: number | undefined): string => {
  switch (roleId) {
    case USER_ROLES.ADMIN:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case USER_ROLES.BUILDER:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case USER_ROLES.SUPERVISOR:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case USER_ROLES.OWNER:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case USER_ROLES.VIEWER:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};
