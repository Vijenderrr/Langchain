import { Controller, Get } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Controller('langchain')
export class LangchainController {
    constructor(private readonly langchainService: LangchainService) { }

    // GET http://localhost:8080/langchain/basic
    // GET http://localhost:8080/langchain/template
    // GET http://localhost:8080/langchain/message
    // GET http://localhost:8080/langchain/string-parser
    // GET http://localhost:8080/langchain/comma-parser
    // GET http://localhost:8080/langchain/structured-parser


    @Get('basic')
    async main() {
        const result = await this.langchainService.main();
        return { message: 'Basic model response', data: result };
    }

    @Get('template')
    async template() {
        const result = await this.langchainService.fromTemplate();
        return { message: 'Prompt Template Response', data: result };
    }

    @Get('message')
    async message() {
        const result = await this.langchainService.fromMessage();
        return { message: 'Message Prompt Response', data: result };
    }

    @Get('string-parser')
    async stringParser() {
        const result = await this.langchainService.stringParser();
        return { message: 'Parsed as string', data: result };
    }

    @Get('comma-parser')
    async commaParser() {
        const result = await this.langchainService.commaSeperatedParser();
        return { message: 'Parsed as comma-separated list', data: result };
    }

    @Get('structured-parser')
    async structuredParser() {
        const result = await this.langchainService.structuredParser();
        return { message: 'Parsed as structured JSON', data: result };
    }
}
