import { NextApiRequest } from 'next';
import { authService, User } from './authService';
import { getLogger } from '../utils';

const logger = getLogger('AUTH_MIDDLEWARE');

/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Support "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Authenticate user from request
 */
export async function authenticateUser(req: NextApiRequest): Promise<User | null> {
  const token = extractToken(req);

  if (!token) {
    return null;
  }

  try {
    const user = await authService.getUserByToken(token);
    return user;
  } catch (error) {
    logger.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req: NextApiRequest): Promise<User> {
  const user = await authenticateUser(req);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Require specific role middleware
 */
export async function requireRole(
  req: NextApiRequest,
  allowedRoles: Array<'Admin' | 'Owner' | 'Analyst' | 'Viewer'>
): Promise<User> {
  const user = await requireAuth(req);

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return user;
}


