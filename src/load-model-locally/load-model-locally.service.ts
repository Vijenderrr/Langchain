import { Injectable } from '@nestjs/common';
import { round, pipeline } from '@xenova/transformers'

@Injectable()
export class LoadModelLocallyService {

    /**
     * Just a test to show the utility function from the library.
     * It rounds a number to specified decimal places.
     */
    async main() {
        console.log('Rounded Value:', round(2.3333, 2)); // Output: 2.33
    }

    // Hugging face is a platform where you can find and share machine learning models, datasets, and more. 
    // It provides a wide range of pre-trained models for various tasks such as natural language processing, computer vision, and more. 
    // You can use these models in your applications to perform tasks like text generation, image classification, and more.

    /**
       * Loads an embedding model locally and generates feature vectors for a given input.
       * This can be used for similarity search or vector databases like Chroma/Weaviate.
       */

    async embedder() {
        const embedder = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2' // Small transformer model
        );

        const result = await embedder('Hello World', {
            pooling: 'mean',     // Averages token vectors into one vector
            normalize: true,     // Normalizes the output vector
        });

        console.log('Embeddings:', result);
        return result;
    }

    /**
  * Loads a text-generation model locally and generates a response for the input query.
  * This simulates a basic chatbot-style interaction.
  */
    async generateText() {
        const textGenerator = await pipeline(
            'text2text-generation',
            'Xenova/LaMini-Flan-T5-783M' // Lightweight model fine-tuned for Q&A
        );

        const result = await textGenerator('What is the latest version of Node.js?', {
            max_new_tokens: 200,
            temperature: 0.7,
            repetition_penalty: 2.0
        });

        console.log('Generated Response:', result);
        return result;
    }


}
