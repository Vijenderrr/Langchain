import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAitoolsController } from './open-aitools/open-aitools.controller';
import { OpenAitoolsService } from './open-aitools/open-aitools.service';
import { ImageGenerationController } from './image-generation/image-generation.controller';
import { ImageGenerationService } from './image-generation/image-generation.service';
import { CommonServicesService } from './common-services/common-services.service';
import { ImageGenerationModule } from './image-generation/image-generation.module';
import { AudioAiController } from './audio-ai/audio-ai.controller';
import { AudioAiService } from './audio-ai/audio-ai.service';
import { ChromadbSetupController } from './chromadb-setup/chromadb-setup.controller';
import { ChromadbSetupService } from './chromadb-setup/chromadb-setup.service';
import { ChromadbChatApplicationService } from './chromadb-chat-application/chromadb-chat-application.service';
import { ChromadbChatApplicationController } from './chromadb-chat-application/chromadb-chat-application.controller';
import { PineconeSetupService } from './pinecone-setup/pinecone-setup.service';
import { PineconeSetupController } from './pinecone-setup/pinecone-setup.controller';
import { LangchainController } from './langchain/langchain.controller';
import { LangchainService } from './langchain/langchain.service';
import { RagLangchainController } from './rag-langchain/rag-langchain.controller';
import { RagLangchainService } from './rag-langchain/rag-langchain.service';
import { LoadModelLocallyController } from './load-model-locally/load-model-locally.controller';
import { LoadModelLocallyService } from './load-model-locally/load-model-locally.service';

@Module({
  imports: [ImageGenerationModule],
  controllers: [AppController, OpenAitoolsController, ImageGenerationController, AudioAiController, ChromadbSetupController, ChromadbChatApplicationController, PineconeSetupController, LangchainController, RagLangchainController, LoadModelLocallyController],
  providers: [AppService, OpenAitoolsService, ImageGenerationService, CommonServicesService, AudioAiService, ChromadbSetupService, ChromadbChatApplicationService, PineconeSetupService, LangchainService, RagLangchainService, LoadModelLocallyService],
})
export class AppModule { }
