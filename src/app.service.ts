import { Injectable } from '@nestjs/common';
// import { ChatOpenAI } from "@langchain/openai";
import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
// import { log } from 'node:console';
import { CommonServicesService } from './common-services/common-services.service';

interface DataWithEmbeddings {
  input: string;
  embeddings: {
    object: string;
    index: number;
    embedding: number[];  // Correctly type the embedding as an array of numbers
  };
}


const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
  role: 'system',
  content: 'You are a helpful chatbot'
}
]

const maxContextLength = 700;

const encoder = encoding_for_model('gpt-4');



@Injectable()
export class AppService {

  constructor(private readonly commonService: CommonServicesService) { }


  /**
  * Processes a list of text strings by generating embeddings for each,
  * and saves the combined result (text + embeddings) to a JSON file.
  * 
  * This is typically used as a preprocessing step for semantic search
  * or LLM-based applications that require vector similarity.
  */
  async generateAndSaveEmbeddings() {
    // Step 1: Load the raw input data (an array of strings) from a JSON file
    const data = this.commonService.loadJSONData<string[]>('../common/data/data.json');

    // Step 2: Generate embeddings for each string in the data array
    const embeddings = await this.commonService.createEmbedding(data);

    // Step 3: Combine each original input string with its corresponding embedding
    const dataWithEmbeddings = [];
    for (let i = 0; i < data.length; i++) {
      dataWithEmbeddings.push({
        input: data[i],
        embeddings: embeddings[i],
      });
    }

    // Step 4: Save the final enriched data (text + embedding) to a new JSON file
    this.commonService.saveDataToJsonFile(
      dataWithEmbeddings,
      '../common/data/dataWithEmbeddings.json'
    );

    // Step 5: Return the result (optional: could also be used for preview/logging)
    return dataWithEmbeddings;
  }


  async findingSimilarity() {
    const dataWithEmbeddings = this.commonService.loadJSONData<DataWithEmbeddings[]>('../common/data/dataWithEmbeddings.json');

    const input = 'yfghfhjgjh';

    const inputEmbeddings = await this.commonService.createEmbedding(input);

    const similarities: {
      input: string,
      similarity: number
    }[] = [];
    // let i = 0;
    for (const entry of dataWithEmbeddings) {
      //compare the embedding data with the data we have given
      const similarity = this.commonService.cosineSimilarity(
        entry.embeddings.embedding,
        inputEmbeddings[0].embedding
      )
      // console.log('find embeddings???',entry.embeddings.embedding);
      // console.log('hgfhfjugk.',inputEmbeddings[0].embedding);

      similarities.push({
        input: entry.input,
        similarity: similarity
      })
    }

    console.log(`Similarity of ${input} with: `);
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
      console.log(`${similarity.input}: ${similarity.similarity}`);

    })

    return 'this is the similarity';
  }



  // This function sends a single-turn prompt to OpenAI's GPT-4o-mini model without maintaining conversational context.
  async openAI() {
    // Initialize OpenAI client with API key
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
    });

    // Send a chat completion request
    const response = await openAI.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You will be given a question. Provide a detailed and long answer.',
        },
        {
          role: 'user',
          content: 'How tall is Mount Everest?',
        }
      ],
      max_tokens: 100,        // Max length of the response
      temperature: 1,         // Controls randomness (0 = deterministic, 2 = very random)
      top_p: 1,               // Controls nucleus sampling (1 = no restriction)
      n: 1,                   // Number of completions to generate
      frequency_penalty: 1.5, // Penalizes repetition (-2.0 to 2.0)
      seed: 555               // Makes output deterministic for this input
    });

    // Output the response content
    console.log(response.choices[0].message.content);
  }

  // This function encodes a prompt using the tiktoken library for the GPT-4 model.
  // It demonstrates how to encode a string into tokens, which is useful for understanding token limits
  encodePrompt() {
    const prompt = "How tall is Mount Everest?";
    const encodedPrompt = encoding_for_model('gpt-4');
    const words = encodedPrompt.encode(prompt);
    console.log('wporkdssdsdsdsd', words);
  }

  // This function calculates the total length of the context messages in tokens.
  // It iterates through the context array, encoding each message's content and summing their lengths.
  getContextLength() {
    let length = 0;
    context.forEach((message) => {
      if (typeof message.content === 'string') {
        length += encoder.encode(message.content).length
      } else if (Array.isArray(message.content)) {
        message.content.forEach((messageContent) => {
          if (messageContent.type == 'text') {
            length += encoder.encode(messageContent.text).length;
          }
        })
      }
    })
    console.log('what is the length????', length)
    return length;
  }

  // This function manages the context length by removing older messages until the total context length is within the specified maximum limit.
  // It iterates through the context array, removing the oldest non-system messages until the context
  deleteOlderMessages() {
    let contextLength = this.getContextLength();
    while (contextLength > maxContextLength) {
      for (let i = 0; i < context.length; i++) {
        const message = context[i];
        if (message.role != 'system') {
          context.splice(i, 1);
          contextLength = this.getContextLength();
          console.log('New context length: ' + contextLength);
          break;
        }
      }
    }
  }



  async createChatCompletion(message: string) {

    context.push({
      role: 'user',
      content: message,
    })
    console.log(context);

    const openAI = new OpenAI({
      //setting up api key to access openAI
      apiKey: process.env.OPENAI_API_KEY, // Replace with your actual OpenAI API key
    });

    const response = await openAI.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: context,
    })

    context.push({
      role: 'assistant',
      content: response.choices[0].message.content,
    })

    this.deleteOlderMessages();
    console.log('openAIWithHistory RESPONSE', response.choices[0].message.content);
  }


  openAIWithHistory(message: string) {
    this.createChatCompletion(message);
  }


}
