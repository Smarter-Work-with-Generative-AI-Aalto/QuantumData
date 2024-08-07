//lib/researchQueue.ts
import { prisma } from '../lib/prisma';
import { createRAGChain, createOpenAISummary } from '../lib/langchainIntegration';

export async function processResearchRequestQueue(teamId: string) {
    const pendingRequest = await prisma.aIRequestQueue.findFirst({
        where: { teamId, status: 'in queue' },
        orderBy: { createdAt: 'asc' },
    });

    if (!pendingRequest) {
        return;
    }

    const { id, documentIds, userSearchQuery, sequentialQuery } = pendingRequest;

    await prisma.aIRequestQueue.update({
        where: { id },
        data: { status: `researching 0/${documentIds.length}` },
    });

    let allFindings = [];

    for (let i = 0; i < documentIds.length; i++) {
        const documentId = documentIds[i];
        const findings = await handleDocumentSearch(documentId, userSearchQuery, sequentialQuery);

        allFindings = allFindings.concat(findings);

        await prisma.aIRequestQueue.update({
            where: { id },
            data: {
                status: `researching ${i + 1}/${documentIds.length}`,
                individualFindings: allFindings,
            },
        });
    }

    const overallSummary = await createOpenAISummary(allFindings);

    await prisma.aIRequestQueue.update({
        where: { id },
        data: {
            status: 'completed',
            overallSummary,
        },
    });

    await prisma.aIActivityLog.create({
        data: {
            ...pendingRequest,
            status: 'completed',
            individualFindings: allFindings,
            overallSummary,
        },
    });

    await prisma.aIRequestQueue.delete({
        where: { id },
    });
}

async function handleDocumentSearch(documentId: string, query: string, sequential: boolean) {
    const documentChunks = await retrieveDocumentChunks(documentId);

    if (sequential) {
        // Process chunks sequentially
        const allResults = [];

        for (const chunk of documentChunks) {
            const result = await createRAGChain(query, [chunk]);
            allResults.push(result);
        }

        return allResults;
    } else {
        // Process chunks in parallel
        return await createRAGChain(query, documentChunks);
    }
}

async function retrieveDocumentChunks(documentId: string) {
    // Retrieve document chunks from your storage (e.g., vector store, database)
    // This is a placeholder, replace it with your actual retrieval logic
    return [];
}
