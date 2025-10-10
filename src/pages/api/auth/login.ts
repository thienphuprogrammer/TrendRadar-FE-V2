import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/apollo/server/auth/authService';
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
    console.log('Login API called with:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Calling authService.login...');
    const authPayload = await authService.login(email, password);
    console.log('AuthService response:', authPayload ? 'Success' : 'Failed');

    if (!authPayload) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json(authPayload);
  } catch (error) {
    console.error('Login error details:', error);
    logger.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}


