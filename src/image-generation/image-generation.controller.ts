import { Body, Controller, Post } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';

@Controller('image-generation')
export class ImageGenerationController {
  constructor(private readonly imageGenerationService: ImageGenerationService) {}

  // POST http://localhost:8080/image-generation/generate-url
  // POST http://localhost:8080/image-generation/generate-local
  // POST http://localhost:8080/image-generation/variation
  // POST http://localhost:8080/image-generation/edit
  
  /**
   * Generates an image from a prompt and returns the URL.
   * @param body - Contains the prompt for image generation.
   */

  @Post('generate-url')
  async generateFromPrompt(@Body() body: { prompt: string }) {
    return await this.imageGenerationService.generateImage(body.prompt);
  }

  @Post('generate-local')
  async generateAndSave(@Body() body: { prompt: string }) {
    return await this.imageGenerationService.generateImageForLocal(body.prompt);
  }

  @Post('variation')
  async variation() {
    return await this.imageGenerationService.generateImageVariation();
  }

  @Post('edit')
  async editImage(@Body() body: { prompt: string }) {
    return await this.imageGenerationService.editImage(body.prompt);
  }
}
