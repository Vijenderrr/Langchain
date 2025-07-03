import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(
    @Body() body: { message: string }
  ) {
    // this.appService.openAI();
    this.appService.encodePrompt();
    // this.appService.openAIWithHistory(body.message);
    // return this.appService.generateAndSaveEmbeddings();  //Part 1
  }


  @Get('findSimilarity')   //Part 2
  // This endpoint is used to find similarity between the input text and the stored embeddings.
  findingSimilarity(): Promise<string> {
    return this.appService.findingSimilarity();
  }
}
