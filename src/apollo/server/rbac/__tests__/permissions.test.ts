import { hasPermission, getRolePermissions, canAccessResource } from '../permissions';

describe('RBAC Permissions', () => {
  describe('hasPermission', () => {
    it('should allow Admin full access', () => {
      expect(hasPermission('Admin', 'Users', 'view')).toBe(true);
      expect(hasPermission('Admin', 'Users', 'create')).toBe(true);
      expect(hasPermission('Admin', 'Users', 'delete')).toBe(true);
      expect(hasPermission('Admin', 'AuditLog', 'view')).toBe(true);
    });

    it('should restrict Viewer permissions', () => {
      expect(hasPermission('Viewer', 'Dashboard', 'view')).toBe(true);
      expect(hasPermission('Viewer', 'TrendExplorer', 'view')).toBe(true);
      expect(hasPermission('Viewer', 'TrendExplorer', 'export')).toBe(false);
      expect(hasPermission('Viewer', 'Users', 'view')).toBe(false);
      expect(hasPermission('Viewer', 'ActionCenter', 'view')).toBe(false);
    });

    it('should allow Analyst data operations', () => {
      expect(hasPermission('Analyst', 'Dashboard', 'view')).toBe(true);
      expect(hasPermission('Analyst', 'Dashboard', 'create')).toBe(true);
      expect(hasPermission('Analyst', 'TrendExplorer', 'export')).toBe(true);
      expect(hasPermission('Analyst', 'DataLab', 'create')).toBe(true);
      expect(hasPermission('Analyst', 'Users', 'view')).toBe(false);
    });

    it('should allow Owner billing access', () => {
      expect(hasPermission('Owner', 'Billing', 'view')).toBe(true);
      expect(hasPermission('Owner', 'Billing', 'manage')).toBe(true);
      expect(hasPermission('Owner', 'ActionCenter', 'apply')).toBe(true);
    });
  });

  describe('getRolePermissions', () => {
    it('should return all permissions for Admin', () => {
      const permissions = getRolePermissions('Admin');
      expect(permissions.length).toBeGreaterThan(20);
    });

    it('should return limited permissions for Viewer', () => {
      const permissions = getRolePermissions('Viewer');
      const viewerPerms = permissions.filter(p => p.action === 'view');
      expect(viewerPerms.length).toBeGreaterThan(0);
      
      const writePerms = permissions.filter(p => ['create', 'update', 'delete'].includes(p.action));
      expect(writePerms.length).toBe(0);
    });
  });

  describe('canAccessResource', () => {
    it('should allow Admin to access all resources', () => {
      expect(canAccessResource('Admin', 'Dashboard')).toBe(true);
      expect(canAccessResource('Admin', 'Users')).toBe(true);
      expect(canAccessResource('Admin', 'Billing')).toBe(true);
      expect(canAccessResource('Admin', 'AuditLog')).toBe(true);
    });

    it('should restrict Viewer resource access', () => {
      expect(canAccessResource('Viewer', 'Dashboard')).toBe(true);
      expect(canAccessResource('Viewer', 'TrendExplorer')).toBe(true);
      expect(canAccessResource('Viewer', 'ActionCenter')).toBe(false);
      expect(canAccessResource('Viewer', 'Users')).toBe(false);
      expect(canAccessResource('Viewer', 'DataLab')).toBe(false);
    });
  });
});

