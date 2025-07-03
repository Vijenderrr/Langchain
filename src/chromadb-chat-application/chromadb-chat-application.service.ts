import { Injectable } from '@nestjs/common';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import OpenAI from 'openai';

@Injectable()
export class ChromadbChatApplicationService {

    // Sample data representing personal and company information
    private myInfo = "Vijender Singh is a software developer and works at Covalience India. He is a full stack developer. He lives in Mohali Phase 3B1 sector 60. He loves to travel, gym and drawing.";

    private companyInfo = "Covalience is a software development company. It is located in Mohali. Company culture is very family-like and everyone knows everyone.";

    // Initialize ChromaDB client with local API path
    private client = new ChromaClient({
        path: 'http://localhost:8000',
    });

    // Initialize the embedding function using OpenAI embeddings
    private embeddingFunction: OpenAIEmbeddingFunction = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
        openai_model: 'text-embedding-3-small'
    });

    // Name of the ChromaDB collection used for storing embeddings
    private colleectionInfo = 'personal-info';

    /**
     * Gets or creates a ChromaDB collection using the configured embedding function.
     */
    async getCollection() {
        return await this.client.getOrCreateCollection({
            name: this.colleectionInfo,
            embeddingFunction: this.embeddingFunction
        });
    }

    /**
     * Explicitly creates a new collection in ChromaDB.
     * Note: Will throw an error if the collection already exists.
     */
    async createCollection() {
        return await this.client.createCollection({
            name: this.colleectionInfo
        });
    }

    /**
     * Populates the collection with personal and company data.
     * Automatically generates and stores embeddings.
     */
    async populateCollection() {
        const collection = await this.getCollection();

        await collection.add({
            documents: [this.myInfo, this.companyInfo],
            ids: ['vijender', 'company'],
        });
    }

    /**
     * Asks a question using OpenAI GPT-4o-mini, 
     * injecting the most relevant context retrieved from ChromaDB.
     */
    async askQuestion() {
        const question = 'Is Vijender doing good in the company?';

        // Step 1: Retrieve the collection
        const collection = await this.getCollection();

        // Step 2: Query the collection for the most relevant document
        const result = await collection.query({
            queryTexts: question,
            nResults: 1
        });

        // Step 3: Extract relevant info from the top result
        const relevantInfo = result.documents[0][0];

        if (relevantInfo) {
            // Step 4: Use OpenAI chat completion with retrieved context
            const openai = new OpenAI();

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0,
                messages: [
                    {
                        role: 'assistant',
                        content: `Answer the next question using the information: ${relevantInfo}`
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ]
            });

            const responseMessage = response.choices[0].message;
            console.log('responseMessage', responseMessage.content);
        }
    }

    /**
     * Placeholder main method (optional entry point for testing or manual execution).
     */
    async main() {
        console.log('main');
    }

}
