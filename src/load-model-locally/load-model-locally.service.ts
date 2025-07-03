import { Injectable } from '@nestjs/common';
import { round, pipeline } from '@xenova/transformers'

@Injectable()
export class LoadModelLocallyService {

    //install npm i @xenova/transformers for this..
    async main() {
        console.log(round(2.3333, 2))
    }

    //hugging face is a platform where you can find and share machine learning models, datasets, and more. It provides a wide range of pre-trained models for various tasks such as natural language processing, computer vision, and more. You can use these models in your applications to perform tasks like text generation, image classification, and more.


    async embedder() {
        const embedder = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2'
        )

        const result = await embedder('Hello World', {
            pooling: 'mean',
            normalize: true
        })
        console.log('thhis is the result', result);

    }

    async generateText() {
        const textGenerator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M')
        const result = await textGenerator('WHat is the latest version of node??', {
            max_new_tokens: 200,
            temperature: 0.7,
            repetition_penalty: 2.0
        });

        console.log('what is the result???', result);


    }


}
