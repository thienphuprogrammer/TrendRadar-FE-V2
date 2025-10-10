import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/apollo/server/auth/authService';
import { extractToken } from '@/apollo/server/auth/authMiddleware';
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
    const token = extractToken(req);

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const success = await authService.logout(token);

    if (!success) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


