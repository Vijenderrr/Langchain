import { Controller, Get } from '@nestjs/common';
import { PineconeSetupService } from './pinecone-setup.service';

@Controller('pinecone-setup')
export class PineconeSetupController {

    constructor(private readonly pinecodeSetupService: PineconeSetupService){}

    @Get()
    async setupPinecone(){
        await this.pinecodeSetupService.createIndex();
    }

    @Get('list')
    async listPineconeIndexes(){
        await this.pinecodeSetupService.listIndexes();
    }

    @Get('addData')
    async addData(){
        await this.pinecodeSetupService.main();
    }

    @Get('query')
    async queryPincode(){
        await this.pinecodeSetupService.queryVectors();
    }

}
