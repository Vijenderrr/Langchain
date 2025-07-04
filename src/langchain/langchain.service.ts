import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { CommaSeparatedListOutputParser, StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import { CommonServicesService } from "../common-services/common-services.service";

@Injectable()
export class LangchainService {

    constructor(private readonly commonService: CommonServicesService) { }

    private model = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0.8,
        maxTokens: 700,
        verbose: true // set to true to see the logs in the console more clearly
    });


    // 🔸 Simple use: Basic model call with string, batch, and stream
    async main() {

        //we will get the response from the model for the question we asked
        const singlePrompt = await this.model.invoke('Give me 4 good books to read');
        console.log('Single prompt result:', singlePrompt.content);


        //in this we will get the response from the model for the batch of questions we asked
        const batchPrompt = await this.model.batch([
            'Hello',
            'Give me a summary of the book "Atomic Habits"',
        ]);
        console.log('Batch result:', batchPrompt.map((res) => res.content));


        //in this we will get the response from the model for the stream of questions we asked
        const streamPrompt = await this.model.stream('Give me 4 good books to read');
        console.log('Streamed response:');
        for await (const chunk of streamPrompt) {
            console.log(chunk.content);
        }
        return streamPrompt
    }


    // 🔸 PromptTemplate from string
    async fromTemplate() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'write a short description for the following producs: {product_name}'
        )

        //this is just to demonstrate how the prompt will look like
        const wholePrompt = await prompt.format({
            product_name: 'bicycle'
        })
        console.log('The template will look like:', wholePrompt);


        //create a chain: connecting the model with the prompt
        const chain = prompt.pipe(this.model);

        const response = await chain.invoke({
            product_name: 'bicycle'
        })

        console.log('fromTemplate → Response:', response.content);
        return response.content;
    }


    // 🔸 Prompt from system + human messages
    async fromMessage() {
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', 'write a short for the product provided by user'],
            ['human', '{product_name}']
        ])

        const chain = prompt.pipe(this.model);
        const response = await chain.invoke({
            //if the name is different from that of the template, it will show an error
            //so we need to make sure that the name of the variable is same as that of
            product_name: 'bicycle'
        })

        console.log('fromMessage → Response:', response.content);
        return response.content;

    }

    //Below are the parsers that we can use to parse the output from the model

    async stringParser() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'Write a short description for the following products: {product_name}'
        );

        //with this parser we will get the response.content directly...
        const parser = new StringOutputParser();  // Only content (no metadata)

        const chain = prompt.pipe(this.model).pipe(parser);

        const response = await chain.invoke({
            product_name: 'bicycle'
        })
        console.log('String Parser →', response);
        return response;
    }


    // 🔸 Parse response into comma-separated values
    async commaSeperatedParser() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'Give me the list of cities in country: {country_name}'
        );

        //with this parser we will get the response.content directly...
        const parser = new CommaSeparatedListOutputParser();

        const chain = prompt.pipe(this.model).pipe(parser);

        const response = await chain.invoke({
            country_name: 'bicycle'
        })
        console.log('Comma Separated Parser →', response);
        return response;
    }

    // 🔸 Structured JSON-like output
    async structuredParser() {
        const templatePrompt = ChatPromptTemplate.fromTemplate(`
            Extract information from the following phrase.
            Formatting instructions: {formatting_instructions}
            Phrase: {phrase}
            `);

        // The output parser will parse the response into a structured JSON object
        const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
            name: 'the name of the person',
            likes: 'what the person likes',
        })

        const chain = templatePrompt.pipe(this.model).pipe(outputParser);

        const response = await chain.invoke({
            formatting_instructions: outputParser.getFormatInstructions(),
            phrase: 'John likes to play football and drink tea'
        });

        console.log('Structured Parser →', response);
        return response;
    }

}
