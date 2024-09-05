// pages/api/ai-activity-log/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/session';
import { getAIActivityLogByTeam } from '../../../models/aiActivityLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: 'Missing teamId' });
    }

    const logs = await getAIActivityLogByTeam(String(teamId));

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
