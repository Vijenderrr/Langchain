import { Injectable } from '@nestjs/common';
import { getRandomValues } from 'crypto';
import { createReadStream, writeFileSync } from 'fs';
import OpenAI from 'openai';

@Injectable()
export class ImageGenerationService {

   async generateImage(prompt: string){
    const openAi = new OpenAI();
        // Implement image generation logic here
        const response = await openAi.images.generate({
            prompt:prompt,
            model: 'dall-e-3',
            style:'natural',
            size:'1024x1024',
            quality:'standard',
            n:1
        });
        console.log('Generated image:', response.data[0].url);
        console.log('Generated image:', response);


        // Example: Use OpenAI's DALL-E or Stable Diffusion
        return 'generated_image.png';
    }

    async generateImageForLocal(prompt: string){
        const openAi = new OpenAI();
            // Implement image generation logic here
            const response = await openAi.images.generate({
                prompt:prompt,
                model:'dall-e-3',
                // model:'gpt-image-1',
                style:'natural',
                size:'1024x1024',
                quality:'standard',
                n:1,
                response_format:'b64_json'
            });

            const rawImage = response.data[0].b64_json;
            if(rawImage){
                writeFileSync(`image.png`,Buffer.from(rawImage,'base64'))
            }
            console.log('Generated image:', response);
    
    
            // Example: Use OpenAI's DALL-E or Stable Diffusion
            return 'generated_image.png';
        }

        async generateImageVariation(){
            const openAi = new OpenAI();
            const response = await openAi.images.createVariation({
                image: createReadStream('image.png'), //add file path in image.png
                model:'dall-e-2',
                response_format:'b64_json',
                n:1
            });
            const rawImage = response.data[0].b64_json;
            if(rawImage){
                writeFileSync('cityVariation.png', Buffer.from(rawImage,'base64'))
            }
        }

        async editImage(prompt: string){
            const openai = new OpenAI();

            const response = await openai.images.edit({
                image: createReadStream('pngimg.com - bmw_PNG99541.png'),
                mask:createReadStream('pngimg.com - bmw_PNG99541.png'),
                prompt:'add beautiful background to the car in blue. like a lake or a ocean ',
                // model:'dall-e-3',
                model:'gpt-image-1',

                response_format:'b64_json',
                n:1
            })
            const rawImage = response.data[0].b64_json;
            if(rawImage){
                writeFileSync('responseImage.png', Buffer.from(rawImage,'base64'));
            }
        }



}
