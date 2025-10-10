/**
 * RBAC Permission Matrix
 * Defines what each role can do
 */

export type Role = 'Admin' | 'Owner' | 'Analyst' | 'Viewer';
export type Action = 'view' | 'create' | 'update' | 'delete' | 'export' | 'apply' | 'manage';
export type Resource =
  | 'Dashboard'
  | 'TrendExplorer'
  | 'ActionCenter'
  | 'DataLab'
  | 'ContentStudio'
  | 'Reports'
  | 'Notifications'
  | 'Integrations'
  | 'Settings'
  | 'Users'
  | 'Billing'
  | 'AuditLog';

export interface Permission {
  resource: Resource;
  action: Action;
  roles: Role[];
}

/**
 * Permission matrix based on the spec
 */
export const PERMISSIONS: Permission[] = [
  // Dashboard
  { resource: 'Dashboard', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Dashboard', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Dashboard', action: 'update', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Dashboard', action: 'delete', roles: ['Admin', 'Owner'] },
  { resource: 'Dashboard', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Trend Explorer
  { resource: 'TrendExplorer', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'TrendExplorer', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Action Center
  { resource: 'ActionCenter', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ActionCenter', action: 'apply', roles: ['Admin', 'Owner'] },

  // Data Lab
  { resource: 'DataLab', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'DataLab', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'DataLab', action: 'delete', roles: ['Admin', 'Owner', 'Analyst'] },

  // Content Studio
  { resource: 'ContentStudio', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'update', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'ContentStudio', action: 'delete', roles: ['Admin', 'Owner', 'Analyst'] },

  // Reports
  { resource: 'Reports', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Reports', action: 'create', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Reports', action: 'export', roles: ['Admin', 'Owner', 'Analyst'] },

  // Notifications
  { resource: 'Notifications', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Notifications', action: 'manage', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },

  // Integrations
  { resource: 'Integrations', action: 'view', roles: ['Admin', 'Owner', 'Analyst'] },
  { resource: 'Integrations', action: 'create', roles: ['Admin', 'Owner'] },
  { resource: 'Integrations', action: 'update', roles: ['Admin', 'Owner'] },
  { resource: 'Integrations', action: 'delete', roles: ['Admin', 'Owner'] },

  // Settings
  { resource: 'Settings', action: 'view', roles: ['Admin', 'Owner', 'Analyst', 'Viewer'] },
  { resource: 'Settings', action: 'manage', roles: ['Admin', 'Owner'] },

  // Users
  { resource: 'Users', action: 'view', roles: ['Admin'] },
  { resource: 'Users', action: 'create', roles: ['Admin'] },
  { resource: 'Users', action: 'update', roles: ['Admin'] },
  { resource: 'Users', action: 'delete', roles: ['Admin'] },

  // Billing
  { resource: 'Billing', action: 'view', roles: ['Admin', 'Owner'] },
  { resource: 'Billing', action: 'manage', roles: ['Admin', 'Owner'] },

  // Audit Log
  { resource: 'AuditLog', action: 'view', roles: ['Admin'] },
  { resource: 'AuditLog', action: 'export', roles: ['Admin'] },
];

/**
 * Check if a role has permission for a resource and action
 */
export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const permission = PERMISSIONS.find(
    (p) => p.resource === resource && p.action === action
  );

  if (!permission) {
    return false;
  }

  return permission.roles.includes(role);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return PERMISSIONS.filter((p) => p.roles.includes(role));
}

/**
 * Check if role can access a resource (any action)
 */
export function canAccessResource(role: Role, resource: Resource): boolean {
  return PERMISSIONS.some((p) => p.resource === resource && p.roles.includes(role));
}


