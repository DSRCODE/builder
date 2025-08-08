// User role types for construction site management
export type UserRoleId = 1 | 2 | 3 | 4 | 5;

export type UserRoleName = 'Admin' | 'Builder' | 'Supervisor' | 'Owner' | 'Viewer';

export interface UserRole {
  id: UserRoleId;
  name: UserRoleName;
  description: string;
  permissions: string[];
}

// User type definition
export interface User {
  id: number;
  user_role_id: UserRoleId;
  user_role: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  phone_number_prefix: string | null;
  phone_number_country_code: string | null;
  phone_number: string | null;
  address: string | null;
  gender: string | null;
  is_active: number;
  is_deleted: number;
  image: string | null;
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
  business_name:string;
}

// Role hierarchy and permissions
export const ROLE_HIERARCHY: Record<UserRoleId, UserRole> = {
  1: {
    id: 1,
    name: 'Admin',
    description: 'Full system access and management capabilities',
    permissions: [
      'manage_users',
      'manage_projects',
      'view_all_reports',
      'manage_materials',
      'manage_labor',
      'system_settings',
      'financial_management'
    ]
  },
  2: {
    id: 2,
    name: 'Builder',
    description: 'Handles construction tasks and updates',
    permissions: [
      'update_progress',
      'manage_materials',
      'submit_reports',
      'view_assigned_tasks',
      'update_labor_entries'
    ]
  },
  3: {
    id: 3,
    name: 'Supervisor',
    description: 'Oversees work and manages teams',
    permissions: [
      'manage_team',
      'approve_reports',
      'view_project_progress',
      'manage_schedules',
      'quality_control'
    ]
  },
  4: {
    id: 4,
    name: 'Owner',
    description: 'Project owner with high-level access and oversight',
    permissions: [
      'view_all_projects',
      'financial_overview',
      'approve_major_changes',
      'view_reports',
      'project_decisions'
    ]
  },
  5: {
    id: 5,
    name: 'Viewer',
    description: 'Read-only access to view project information',
    permissions: [
      'view_project_info',
      'view_basic_reports',
      'view_progress'
    ]
  }
};
