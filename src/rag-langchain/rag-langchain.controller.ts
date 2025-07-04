import { Body, Controller, Get, Post } from '@nestjs/common';
import { RagLangchainService } from './rag-langchain.service';

@Controller('rag-langchain')
export class RagLangchainController {

    constructor(private readonly ragLangchainService: RagLangchainService) { }

    // GET http://localhost:8080/rag-langchain/main
    // GET http://localhost:8080/rag-langchain/pdf
    // GET http://localhost:8080/rag-langchain/mainWithMemory

    // Endpoint to run the full RAG workflow
    @Get('main')
    async runRagPipeline() {
        return await this.ragLangchainService.main();
    }

    @Post('mainWithMemory')
    async runRagPipelineWithMemory(@Body() body: { question: string }) {
        return await this.ragLangchainService.main_1(body.question);
    }

    // Endpoint to load and split PDF
    @Get('pdf')
    async loadPdf() {
        return await this.ragLangchainService.pdfBaseLoader();
    }
}
