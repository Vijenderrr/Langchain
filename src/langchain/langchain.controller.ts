import { Controller, Get } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Controller('langchain')
export class LangchainController {
    constructor(private readonly langchainService: LangchainService) {}

    @Get()
    async main(){
        const response1 = await this.langchainService.main()
        console.log('this is response1 from langchain',response1)
        // await this.langchainService.fromTemplate();
        // await this.langchainService.fromMessage();
        // await this.langchainService.commaSeperatedParser();
    }
}
