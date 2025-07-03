import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

//this is the type of meta data structure that we can query to the database
type CoolType ={
coolness: number;
refrence:string
}

@Injectable()
export class PineconeSetupService {


    private pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });

    //usually vector databases let us store:
    //string value & embeddings

    //but pinecone lets us store:
    //Metadata also that helps us save more info..

    //namespace: partition vectors from an index smaller group. Make operations limited to one namespace
    async createNamespace(){
        //if we have larger data than namespaces use is a more optimised approach
        const index =await this.getIndexDetails();
        const namespace = index.namespace('cool-namespace')
    }


    async createIndex() {
        const indexName = 'quickstart';

        await this.pc.createIndex({
            name: indexName,
            dimension: 1536, // Replace with your model dimensions
            metric: 'cosine', // Replace with your model metric
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });
    }

//get all indexes present
    async listIndexes(){
        const result = await this.pc.listIndexes();
        console.log('result',result);
        
    }

    //specify the index name to get the index details

    async getIndexDetails(){
        const indexName = 'quickstart';
        const result = await this.pc.index<CoolType>(indexName);
        console.log('result',result);
        return result;
        
    }

    generateNumberArray(length:number){
        return Array.from({ length }, ()=>Math.random())
    }

    //adding data to the database....
    async upsertVectors(){
        const embedding = this.generateNumberArray(1536);
        const index = this.getIndexDetails();
        const upsertResult = (await index).upsert([{
            id:'id-1',
            values:embedding,
            metadata:{
                coolness: 10,
                refrence: 'some refrence'
            }
        }])

    }

    async queryVectors(){
        const index = this.getIndexDetails();
        const result = (await index).query({
            id:'id-1',
            topK:1
        })
        console.log('result????',result);
        
    }

    async main(){
        await this.upsertVectors();
    }


}
