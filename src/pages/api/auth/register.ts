import { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from '@/apollo/server/auth/authMiddleware';
import { authService } from '@/apollo/server/auth/authService';
import { logAuditEvent } from '@/apollo/server/rbac/rbacMiddleware';
import { getLogger } from '@server/utils';

const logger = getLogger('AUTH_API');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Only Admin can register new users
    const currentUser = await requireRole(req, ['Admin']);

    const { email, name, password, role } = req.body;

    if (!email || !name || !password || !role) {
      return res.status(400).json({
        error: 'Email, name, password, and role are required'
      });
    }

    if (!['Admin', 'Owner', 'Analyst', 'Viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await authService.register(email, name, password, role);

    // Audit log
    await logAuditEvent(
      currentUser.id,
      'CREATE',
      'user',
      user.id,
      { email, name, role },
      req.socket.remoteAddress,
      req.headers['user-agent']
    );

    return res.status(201).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
      }
    }
    logger.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


