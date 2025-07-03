import { Controller, Get } from '@nestjs/common';
import { OpenAitoolsService } from './open-aitools.service';

@Controller('open-aitools')
export class OpenAitoolsController {
    constructor(private readonly openAiToolsService: OpenAitoolsService){}


    @Get()
    async openAI(){
       const response =  this.openAiToolsService.openAI()

        return response
    }
}
