import { Module } from '@nestjs/common';
import { ImageGenerationController } from './image-generation.controller';
import { ImageGenerationService } from './image-generation.service';
import { CommonServicesService } from 'src/common-services/common-services.service';

@Module({
    imports: [],
    controllers: [ImageGenerationController],
    providers: [ ImageGenerationService, CommonServicesService],
})
export class ImageGenerationModule {}
