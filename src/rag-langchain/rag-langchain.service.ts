import { Injectable } from '@nestjs/common';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter, TextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Chroma } from '@langchain/community/vectorstores/chroma'

import { BufferMemory } from 'langchain/memory';
import { RunnableSequence } from '@langchain/core/runnables';


@Injectable()
export class RagLangchainService {

    private model = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0.8,
        maxTokens: 700,
        verbose: true
    });

    private question = "What are my favorite foods?";

    private myData = [
        "My name is John",
        "My name os Bob",
        "My favorite food is pizza",
        "My favorite food is pasta",
    ]

    /**
      * This function demonstrates a full RAG flow:
      * - Load a webpage
      * - Split it into chunks
      * - Store in memory vector store
      * - Retrieve relevant chunks
      * - Ask a question based on them
      */
    async main() {

        // Step 1: Load HTML content from the web
        const loader = new CheerioWebBaseLoader(
            'https://en.wikipedia.org/wiki/Instagram'
        );
        const docs = await loader.load();

        // Step 2: Split the content into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 50,
        });

        const splitDocs = await splitter.splitDocuments(docs);

        //just add this data in the vector store
        // const splitedDocs = await textSplitter.splitDocuments(docs);

        // Step 3: Create an in-memory vector store
        const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

        // Option 1: Use static text instead of webpage for simplicity
        await vectorStore.addDocuments(
            this.myData.map((text) => new Document({ pageContent: text }))
        );

        //Option 2: use splited data from browser
        // await vectorStore.addDocuments(splitedDocs);

        // Step 4: Retrieve top 2 most relevant documents
        const retriever = vectorStore.asRetriever({ k: 2 });
        const results = await retriever._getRelevantDocuments(this.question);
        const context = results.map((doc) => doc.pageContent).join('\n');


        // Step 5: Prepare a prompt and query the model
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', 'Answer the user’s question based on the following context:\n{context}'],
            // ['system', 'Conversation History:\n{history}'],  //option 1 the simpler way..
            ['user', '{input}'],
        ]);

        const chain = prompt.pipe(this.model);

        const response = await chain.invoke({
            context,
            input: this.question,
        });

        console.log('RAG Response:', response.content);
        return response.content;

    }


    async main_1(question: string) {
        // Step 1: Load HTML content from the web
        const loader = new CheerioWebBaseLoader(
            'https://en.wikipedia.org/wiki/Instagram'
        );
        const docs = await loader.load();

        // Step 2: Split the content into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 50,
        });

        const splitDocs = await splitter.splitDocuments(docs);
        console.log('splitdoz',docs);
        

        // Step 3: Create an in-memory vector store
        const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

        // Use static data for now (or replace with: await vectorStore.addDocuments(splitDocs);)
        await vectorStore.addDocuments(
            splitDocs
        );

        // Step 4: Retrieve top 2 most relevant documents
        const retriever = vectorStore.asRetriever({ k: 2 });
        console.log( 'Question:', question);
        
        const results = await retriever._getRelevantDocuments(question);
        const context = results.map((doc) => doc.pageContent).join('\n');

        // Step 5: Use LangChain's ConversationChain with memory
        const memory = new BufferMemory({
            memoryKey: "history", // required for ConversationChain
            returnMessages: true
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ['system', 'You are a helpful assistant. Use the following context to assist the user.\nContext: {context}'],
            ['user', '{input}'],
        ]);

        const chain = RunnableSequence.from([
            {
                history: async () => await memory.loadMemoryVariables({}),
                context: async () => context,
                input: async () => question
            },
            prompt,
            this.model
        ]);

        // 4. Run the chain
        const response = await chain.invoke({});

        // 5. Save to memory manually
        await memory.saveContext(
            { input: this.question },
            { output: response.content }
        );

        console.log('RAG + Memory Response:', response.content);
        return response.content;
    }

    //here we are loading the pdf file and splitting the text
    async pdfBaseLoader() {
        const loader = new PDFLoader('PolicySchedule-696237053.pdf')
        const docs = await loader.load();

        //text splitter with custom separator
        const textSplitter = new RecursiveCharacterTextSplitter({
            separators: [`, \n`]
        });

        //just add this data in the vector store
        const splitedDocs = await textSplitter.splitDocuments(docs);

        console.log('PDF split output:', splitedDocs);
        return splitedDocs;


    }

    /**
 * Stores split documents into ChromaDB
 */
    async storingInChromaDB(splitDocuments) {

        //this is with langchain
        //it will automatically create a collection named 'books' in ChromaDB
        const vectorStore = await Chroma.fromDocuments(splitDocuments, new OpenAIEmbeddings(), {
            collectionName: 'books',
            url: 'http://localhost:8000'
        })

        console.log('Data stored in Chroma');
        return vectorStore;

    }
}
