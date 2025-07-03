import { Controller, Get } from '@nestjs/common';
import { AudioAiService } from './audio-ai.service';

@Controller('audio-ai')
export class AudioAiController {

    constructor(private readonly audioAIService: AudioAiService){}


    @Get('c')
    async createTranslation(){
        await this.audioAIService.createTranscription();
        return 'done';
    }

    @Get('translation')
    async getTranslation(){
        await this.audioAIService.translate();
        return 'done';
    }

    @Get('texttospeach')
    async textToSpeech(){
        await this.audioAIService.textToSpeech();
        return 'done';
    }

}
