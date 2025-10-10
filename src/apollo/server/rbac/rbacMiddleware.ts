import { User } from '../auth/authService';
import { hasPermission, Resource, Action, Role } from './permissions';
import { getLogger } from '../utils';

const logger = getLogger('RBAC');

/**
 * Check if user has permission
 */
export function checkPermission(
  user: User,
  resource: Resource,
  action: Action
): boolean {
  const allowed = hasPermission(user.role as Role, resource, action);

  if (!allowed) {
    logger.warn(
      `Permission denied: ${user.email} (${user.role}) attempted ${action} on ${resource}`
    );
  }

  return allowed;
}

/**
 * Require permission middleware
 */
export function requirePermission(
  user: User,
  resource: Resource,
  action: Action
): void {
  if (!checkPermission(user, resource, action)) {
    throw new Error(`Forbidden: Insufficient permissions to ${action} ${resource}`);
  }
}

/**
 * Audit log helper
 */
export async function logAuditEvent(
  userId: number,
  action: string,
  resource: string,
  resourceId?: number,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const { getKnex } = await import('../utils/knex');
  const knex = getKnex();

  await knex('audit_logs').insert({
    user_id: userId,
    action,
    resource,
    resource_id: resourceId,
    details: details ? JSON.stringify(details) : null,
    ip_address: ipAddress,
    user_agent: userAgent
  });

  logger.info(`Audit: User ${userId} ${action} ${resource} ${resourceId || ''}`);
}


