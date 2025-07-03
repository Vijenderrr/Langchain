import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';
import { join } from 'path';
import { DynamicTool } from "langchain/tools";

@Injectable()
export class CommonServicesService {

    async createEmbedding(input: string | string[]) {
        const openai = new OpenAI();

        const response = await openai.embeddings.create({
            input: input,
            model: 'text-embedding-3-small'
        })
        return response.data

    }

    loadJSONData<T>(fileName: string): T {
        const path = join(__dirname, fileName);
        const rawData = readFileSync(path);
        return JSON.parse(rawData.toString());
    }

    saveDataToJsonFile(data: any, fileName: string) {
        const dataString = JSON.stringify(data);
        const dataBuffer = Buffer.from(dataString);
        const path = join(__dirname, fileName);
        writeFileSync(path, dataBuffer);
        console.log(`saved data to ${fileName}`);
    }

    //find dot product of two arrays>>>
    dotProduct(a: number[], b: number[]) {
        return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
    }

    //angle between two vectors in the arrays...
    cosineSimilarity(a: number[], b: number[]) {
        const product = this.dotProduct(a, b);
        const aMagnitude = Math.sqrt(a.map(value => value * value).reduce((a, b) => a + b, 0));
        const bMagnitude = Math.sqrt(b.map(value => value * value).reduce((a, b) => a + b, 0));
        return product / (aMagnitude * bMagnitude);
    }


    //tool to create image using OpenAI's DALL-E model
    //This tool can be used in LangChain to generate images based on text prompts.
    imageGenerationTool() {
        const imageGeneration = new DynamicTool({
            name: "generate_image",
            description: "Use this tool to generate an image from a given prompt.",
            func: async (prompt: string) => {
                const openai = new OpenAI();
                const response = await openai.images.generate({
                    prompt,
                    model: "dall-e-3",
                    size: "1024x1024",
                    style: "natural",
                    response_format: "b64_json",
                    n: 1,
                });

                const imageBase64 = response.data[0].b64_json;
                const filePath = "generated_image.png";
                writeFileSync(filePath, Buffer.from(imageBase64, "base64"));
                return `Image generated and saved as ${filePath}`;
            },
        });

        return imageGeneration;
    }

}
