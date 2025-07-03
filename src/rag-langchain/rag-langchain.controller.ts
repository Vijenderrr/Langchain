import { Controller, Get } from '@nestjs/common';
import { RagLangchainService } from './rag-langchain.service';

@Controller('rag-langchain')
export class RagLangchainController {

    constructor(private readonly ragLangchainService: RagLangchainService) { }


    
    @Get('main')
    async main() {
        return await this.ragLangchainService.main();
    }
    @Get()
    async getAnswer() {
        return await this.ragLangchainService.pdfBaseLoader();
    }
}
