import { Controller, Get } from '@nestjs/common';
import { LoadModelLocallyService } from './load-model-locally.service';

@Controller('load-model-locally')
export class LoadModelLocallyController {
    constructor(private readonly loadModelLocallyService: LoadModelLocallyService) { }

    @Get()
    async getAnswer() {
        return await this.loadModelLocallyService.generateText();
    }
}
