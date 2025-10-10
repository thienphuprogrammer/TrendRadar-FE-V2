import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/apollo/server/auth/authMiddleware';
import { getLogger } from '@server/utils';

const logger = getLogger('CHATBOT_SSE');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await requireAuth(req);
    const question = req.query.question as string;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Mock streaming response - replace with actual LLM integration
    const mockResponse = `Based on current trend data, ${question} shows interesting patterns. The hashtag has gained 15% more mentions in the last 24 hours, with sentiment remaining positive at 72%. Key platforms driving this trend are TikTok (45%) and Instagram (35%).`;

    const words = mockResponse.split(' ');

    // Stream tokens
    for (let i = 0; i < words.length; i++) {
      const token = words[i] + (i < words.length - 1 ? ' ' : '');
      
      res.write(`data: ${JSON.stringify({
        type: 'token',
        content: token
      })}\n\n`);

      // Simulate delay between tokens
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({
      type: 'done',
      latency: Date.now()
    })}\n\n`);

    res.end();

    logger.info(`Chatbot response streamed for user ${user.id}`);
  } catch (error) {
    logger.error('Chatbot stream error:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: 'Failed to generate response'
    })}\n\n`);
    res.end();
  }
}


