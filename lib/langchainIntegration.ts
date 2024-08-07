//lib/langchainIntegration.ts

import { AzureAISearchVectorStore, AzureAISearchQueryType } from '@langchain/community/vectorstores/azure_aisearch';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';

const createRAGChain = async (query: string, contextDocs: any[]) => {
    const vectorStore = new AzureAISearchVectorStore(
        new OpenAIEmbeddings(),
        {
            endpoint: process.env.AZURE_AISEARCH_ENDPOINT,
            key: process.env.AZURE_AISEARCH_KEY,
            indexName: 'vectorsearch',
            search: { type: AzureAISearchQueryType.SemanticHybrid },
        }
    );

    const retriever = vectorStore.asRetriever();
    const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');
    const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0});

    const ragChain = await createStuffDocumentsChain({
        llm,
        prompt,
        outputParser: new StringOutputParser(),
    });

    const retrievedDocs = await retriever.invoke(query);
    const response = await ragChain.invoke({
        question: query,
        context: retrievedDocs,
    });

    return response;
};

const createOpenAISummary = async (findings: any[]) => {
    const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 });
    const summaryPrompt = `Create a summary based on the following findings: ${JSON.stringify(findings)}`;

    const response = await llm.invoke({ text: summaryPrompt });
    return response;
};

export { createRAGChain, createOpenAISummary };
