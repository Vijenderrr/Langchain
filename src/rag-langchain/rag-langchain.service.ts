import { Injectable } from '@nestjs/common';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { Chroma } from '@langchain/community/vectorstores/chroma'

@Injectable()
export class RagLangchainService {

    private model = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0.8,
        maxTokens: 700,
        verbose: true
    });

    private myData = [
        "My name is John",
        "My name os Bob",
        "My favorite food is pizza",
        "My favorite food is pasta",
    ]

    private question = "What are my favorite foods?";

    async main() {

        //cheerio webpage loader
        const loader = new CheerioWebBaseLoader('https://stackoverflow.com/questions/57007075/running-rabbitmq-in-docker-container')
        const docs = await loader.load();

        //text splitter
        const textSplitter = new RecursiveCharacterTextSplitter({   ///there are many text splitters available in langchain, but we are using the basic one
            chunkSize: 200,
            chunkOverlap: 50
        });

        //just add this data in the vector store
        const splitedDocs = await textSplitter.splitDocuments(docs);


        //Store the data in vector data base of langchain
        const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings)
        //instad of using the MemoryVectorStore of langchain we can use chromaDB in to do the same. Use the function storingInChromaDB() to store the data in chromaDB

        await vectorStore.addDocuments(this.myData.map(
            content => new Document({ pageContent: content })
        ));

        // await vectorStore.addDocuments(splitedDocs);

        //create data retriever
        const retriever = vectorStore.asRetriever({
            k: 2 //it will give us 2 most relevant documents
        });

        //get relevant documents:
        const results = await retriever._getRelevantDocuments(this.question);

        const resultDocs = results.map(
            result => result.pageContent
        );

        const template = ChatPromptTemplate.fromMessages([
            ['system', 'Answer the users questions based on the following context: {context}'],
            ['user', '{input}']
        ])

        const chain = template.pipe(this.model);

        const response = await chain.invoke({
            context: resultDocs,
            input: this.question
        });

        console.log(response);

    }

//here we are loading the pdf file and splitting the text
    async pdfBaseLoader() {
        const loader = new PDFLoader('PolicySchedule-696237053.pdf')
        const docs = await loader.load();

        //text splitter with custom separator
        const textSplitter = new RecursiveCharacterTextSplitter({
           separators:[`, \n`]
        });

        //just add this data in the vector store
        const splitedDocs = await textSplitter.splitDocuments(docs);

        console.log('splited dossssdsdsd',splitedDocs);
        

    }

//here we are storing the data in chroma db

//this is without langchain
    // private client = new ChromaClient({
    //     path: 'http://localhost:8000',
    // })


    // private embeddingFunction =  new OpenAIEmbeddingFunction({
    //     openai_api_key: process.env.OPENAI_API_KEY!,
    //     openai_model:'text-embedding-3-small'
    // })

    async storingInChromaDB(splitDocuments){

        //this is with langchain
        const vectorStore = await Chroma.fromDocuments(splitDocuments, new OpenAIEmbeddings(),{
            collectionName:'books',
            url:'http://localhost:8000'
        })

        return vectorStore

    }
}
