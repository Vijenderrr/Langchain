import { Controller, Get } from '@nestjs/common';
import { ChromadbSetupService } from './chromadb-setup.service';

@Controller('chromadb-setup')
export class ChromadbSetupController {
    constructor(private readonly chromedbSetupService: ChromadbSetupService) { }

    @Get('main')
    async main() {
        await this.chromedbSetupService.main();
    }
    @Get('addData')
    async addData(){
        await this.chromedbSetupService.addData();
        return 'done';
    }
}
