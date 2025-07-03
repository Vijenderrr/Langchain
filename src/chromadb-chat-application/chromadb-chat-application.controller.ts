import { Controller, Get } from '@nestjs/common';
import { ChromadbChatApplicationService } from './chromadb-chat-application.service';

@Controller('chromadb-chat-application')
export class ChromadbChatApplicationController {

    constructor(private readonly chromedbChatApplicationService: ChromadbChatApplicationService) { }

    @Get()
    async main()
    {
        // await this.chromedbChatApplicationService.main();
        // await this.chromedbChatApplicationService.createCollection();
        // await this.chromedbChatApplicationService.populateCollection();
        await this.chromedbChatApplicationService.askQuestion();
    }
}
