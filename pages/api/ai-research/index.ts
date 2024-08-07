import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { processResearchRequestQueue } from '../../../lib/researchQueue';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            return await handlePost(req, res);
        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, teamId, documentIds, userSearchQuery, similarityScore, sequentialQuery, enhancedSearch } = req.body;

    if (!userId || !teamId || !documentIds || !userSearchQuery) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newRequest = await prisma.aIRequestQueue.create({
            data: {
                userId,
                teamId,
                documentIds,
                userSearchQuery,
                similarityScore: similarityScore || 1.0,
                sequentialQuery: sequentialQuery !== undefined ? sequentialQuery : true,
                enhancedSearch: enhancedSearch !== undefined ? enhancedSearch : false,
            },
        });

        processResearchRequestQueue(teamId);

        return res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating research request:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
