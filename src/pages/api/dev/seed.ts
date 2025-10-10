import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getLogger } from '@server/utils';

const execAsync = promisify(exec);
const logger = getLogger('SEED_API');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = req.query.profile || 'full';

    logger.info(`Running seed script with profile: ${profile}`);

    const { stdout, stderr } = await execAsync(
      `node scripts/seed_dummy.js ${profile}`
    );

    logger.info('Seed output:', stdout);
    if (stderr) {
      logger.warn('Seed stderr:', stderr);
    }

    return res.status(200).json({
      message: 'Seed completed successfully',
      profile,
      output: stdout
    });
  } catch (error) {
    logger.error('Seed error:', error);
    return res.status(500).json({
      error: 'Seed failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}


