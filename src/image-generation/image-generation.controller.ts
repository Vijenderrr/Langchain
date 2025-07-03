import { Body, Controller, Get } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';

@Controller('image-generation')
export class ImageGenerationController {
    constructor(private readonly imageGenerationService: ImageGenerationService) {}
    
      @Get()
      generateImage(
        @Body() body: { message: string }
      ):Promise<string> {
        this.imageGenerationService.generateImageVariation(
          // body.message
        );
        return;
      }
}
