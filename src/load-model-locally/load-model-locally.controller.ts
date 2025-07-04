import { Controller, Get } from '@nestjs/common';
import { LoadModelLocallyService } from './load-model-locally.service';

@Controller('load-model-locally')
export class LoadModelLocallyController {
    constructor(private readonly loadModelLocallyService: LoadModelLocallyService) { }


    // GET http://localhost:8080/load-model-locally/round-test
    // GET http://localhost:8080/load-model-locally/embed
    // GET http://localhost:8080/load-model-locally/generate


    @Get('generate')
    async getTextGeneration() {
        return await this.loadModelLocallyService.generateText();
    }

    @Get('embed')
    async getEmbeddings() {
        return await this.loadModelLocallyService.embedder();
    }

    @Get('round-test')
    async getRoundTest() {
        await this.loadModelLocallyService.main();
        return { message: 'Check console for rounded number.' };
    }
}
