import { Controller, Get } from '@nestjs/common';
import { AudioAiService } from './audio-ai.service';

@Controller('audio-ai')
export class AudioAiController {
    constructor(private readonly audioAIService: AudioAiService) { }

    //GET http://localhost:3000/audio-ai/transcribe
    //GET http://localhost:3000/audio-ai/translate
    //GET http://localhost:3000/audio-ai/text-to-speech

    @Get('transcribe')
    async createTranscription() {
        const result = await this.audioAIService.createTranscription();
        return { message: 'Transcription completed', text: result };
    }

    @Get('translate')
    async translateAudio() {
        const result = await this.audioAIService.translate();
        return { message: 'Translation completed', text: result };
    }

    @Get('text-to-speech')
    async textToSpeech() {
        const result = await this.audioAIService.textToSpeech();
        return { message: 'Audio generated', file: result };
    }
}
