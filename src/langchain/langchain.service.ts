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

    async main() {

        //we will get the response from the model for the question we asked
        const response1 = await this.model.invoke(
            'Give me 4 good books to read'
        )

        //in this we will get the response from the model for the batch of questions we asked
        const response2 = await this.model.batch([
            'Hello',
            'give me a summary of the book'
        ])

        //in this we will get the response from the model for the stream of questions we asked
        const response3 = await this.model.stream('give me 4 good books to read');
        for await (const chunk of response3) {
            console.log(chunk.content);

        }
        return response3
    }

    async fromTemplate() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'write a short description for the following producs: {product_name}'
        )

        //this is just to demonstrate how the prompt will look like
        const wholePrompt = await prompt.format({
            product_name: 'bicycle'
        })

        //create a chain: connecting the model with the prompt
        const chain = prompt.pipe(this.model);
        console.log('???????????', wholePrompt);

        const response = await chain.invoke({
            product_name: 'bicycle'
        })

        console.log('response????', response)
    }


    async fromMessage() {
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', 'write a short for the product provided by user'],
            ['human', '{product_name}']
        ])

        const chain = prompt.pipe(this.model);
        const result = await chain.invoke({
            //is the name is different from that of the template, it will show an error
            //so we need to make sure that the name of the variable is same as that of
            product_name: 'bicycle'
        })

        console.log('result????????', result);

    }

    //Below are the parsers that we can use to parse the output from the model

    async stringParser() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'Write a short description for the following products: {product_name}'
        );

        //with this parser we will get the response.content directly...
        const parser = new StringOutputParser();

        const chain = prompt.pipe(this.model).pipe(parser);

        const response = await chain.invoke({
            product_name: 'bicycle'
        })
        console.log('stringparser???', response)
    }



    async commaSeperatedParser() {
        const prompt = ChatPromptTemplate.fromTemplate(
            'Write a short description for the following products: {product_name}'
        );

        //with this parser we will get the response.content directly...
        const parser = new CommaSeparatedListOutputParser();

        const chain = prompt.pipe(this.model).pipe(parser);

        const response = await chain.invoke({
            product_name: 'bicycle'
        })
        console.log('stringparser???', response)
    }


    async structuredParser() {
        const templatePrompt = ChatPromptTemplate.fromTemplate(`
            Extract information from the following phrase.
            Formatting instructions: {formatting_instructions}
            Phrase: {phrase}
            `);
        const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
            name: 'the name of the person',
            likes: 'what the person likes',
        })

        const chain = templatePrompt.pipe(this.model).pipe(outputParser);

        const response = await chain.invoke({
            formatting_instructions: outputParser.getFormatInstructions(),
            phrase: 'John likes to play football'
        });

        console.log('response????', response)
    }

}
