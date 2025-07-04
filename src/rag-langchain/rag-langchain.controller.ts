import { Controller, Get } from '@nestjs/common';
import { RagLangchainService } from './rag-langchain.service';

@Controller('rag-langchain')
export class RagLangchainController {

    constructor(private readonly ragLangchainService: RagLangchainService) { }

    // GET http://localhost:8080/rag-langchain/main
    // GET http://localhost:8080/rag-langchain/pdf

    // Endpoint to run the full RAG workflow
    @Get('main')
    async runRagPipeline() {
        return await this.ragLangchainService.main();
    }

    // Endpoint to load and split PDF
    @Get('pdf')
    async loadPdf() {
        return await this.ragLangchainService.pdfBaseLoader();
    }
}
