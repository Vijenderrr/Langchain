import { Injectable } from '@nestjs/common';
import { createReadStream, writeFileSync } from 'fs';
import OpenAI from 'openai';

@Injectable()
export class ImageGenerationService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Optional if using dotenv elsewhere
  });

  /**
   * Generates a DALL·E 3 image and returns the URL.
   */
  async generateImage(prompt: string): Promise<string> {
    const response = await this.openAi.images.generate({
      prompt,
      model: 'dall-e-3',
      style: 'natural',
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0].url;
    console.log('Generated image URL:', imageUrl);

    return imageUrl;
  }

  /**
   * Generates an image and saves it locally as a base64-decoded PNG.
   */
  async generateImageForLocal(prompt: string): Promise<string> {
    const response = await this.openAi.images.generate({
      prompt,
      model: 'dall-e-3',
      style: 'natural',
      size: '1024x1024',
      quality: 'standard',
      n: 1,
      response_format: 'b64_json',
    });

    const rawImage = response.data[0].b64_json;
    if (rawImage) {
      writeFileSync('generated_image.png', Buffer.from(rawImage, 'base64'));
      console.log('Image saved as generated_image.png');
    }

    return 'generated_image.png';
  }

  /**
   * Creates a variation of an existing image (e.g., image.png).
   */
  async generateImageVariation(): Promise<string> {
    const response = await this.openAi.images.createVariation({
      image: createReadStream('image.png'), // Image should be 256x256 and PNG
      model: 'dall-e-2',
      response_format: 'b64_json',
      n: 1,
    });

    const rawImage = response.data[0].b64_json;
    if (rawImage) {
      writeFileSync('image_variation.png', Buffer.from(rawImage, 'base64'));
      console.log('Image variation saved as image_variation.png');
    }

    return 'image_variation.png';
  }

  /**
   * Edits an image using a prompt and optional mask (image must support transparency).
   */
  async editImage(prompt: string): Promise<string> {
    const response = await this.openAi.images.edit({
      image: createReadStream('car.png'), // Must be PNG, 1024x1024, with transparency
      mask: createReadStream('car.png'),
      prompt,
      model: 'dall-e-2', // Only DALL·E 2 supports image editing right now
      response_format: 'b64_json',
      n: 1,
    });

    const rawImage = response.data[0].b64_json;
    if (rawImage) {
      writeFileSync('edited_image.png', Buffer.from(rawImage, 'base64'));
      console.log('Edited image saved as edited_image.png');
    }

    return 'edited_image.png';
  }
}
