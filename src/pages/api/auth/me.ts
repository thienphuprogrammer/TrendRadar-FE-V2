import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/apollo/server/auth/authMiddleware';
import { getLogger } from '@server/utils';

const logger = getLogger('AUTH_API');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await requireAuth(req);
    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    logger.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


