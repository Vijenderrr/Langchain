import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';


@Injectable()
export class OpenAitoolsService {

    async openAI() {
        const openAI = new OpenAI();
        // OpenAI API integration
        const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: 'You are a  helpful assistant that gives information about the time of day'
            },
            {
                role: 'user',
                content: "what is the order status of order no 12121 and what is the date today??"
            },
        ]
        // Configure chat tools (first openAI call)
        const response = await openAI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: context,
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'getTimeOfDay',
                        description: 'Get the time of day'
                    }
                },
                {
                    type: 'function',
                    function: {
                        name: 'getDate',
                        description: 'Get todays date'
                    }
                },
                {
                    type: 'function',
                    function: {
                        name: 'getOrderStatus',
                        description: 'Check what is the status of the order',
                        parameters: {
                            type: 'object',
                            properties: {
                                orderId: {
                                    type: 'string',
                                    description: 'The id of the order to get te status of '
                                }
                            },
                            required: ['orderId']
                        }
                    }
                },
            ],
            tool_choice: 'auto',  //the engine will decide which tool to use
        });
        //decide if tool call is required
        const willInvokeFunction = response.choices[0].finish_reason == 'tool_calls'

        //this is to invoke single tool call...and this was the old way of doing it

        // const toolCall = response.choices[0].message.tool_calls![0]

        // if (willInvokeFunction) {
        //     const toolName = toolCall.function.name
        //     if (toolName == 'getTimeOfDay') {
        //         const toolResponse = this.getTimeOfDay();
        //         context.push(response.choices[0].message);
        //         context.push({
        //             role: 'tool',
        //             content: toolResponse,
        //             tool_call_id: toolCall.id
        //         })
        //     }

        //     if (toolName == 'getDate') {
        //         const toolResponse = this.getDate();
        //         context.push(response.choices[0].message);
        //         context.push({
        //             role: 'tool',
        //             content: toolResponse,
        //             tool_call_id: toolCall.id
        //         })
        //     }

        //     if (toolName == 'getOrderStatus') {
        //         const rawArgument = toolCall.function.arguments;
        //         const parsedArguments = JSON.parse(rawArgument);
        //         const toolResponse = this.getOrderStatus(parsedArguments.orderId);
        //         context.push(response.choices[0].message);
        //         context.push({
        //             role: 'tool',
        //             content: toolResponse,
        //             tool_call_id: toolCall.id
        //         })
        //     }
        // }

        //now more than one tool can be called at once, so we will iterate through all the tool calls
        
        if (willInvokeFunction) {
            context.push(response.choices[0].message); // Push assistant's message with tool calls

            for (const toolCall of response.choices[0].message.tool_calls!) {
                const toolName = toolCall.function.name;
                let toolResponse: string;

                if (toolName === 'getTimeOfDay') {
                    toolResponse = this.getTimeOfDay();
                } else if (toolName === 'getDate') {
                    toolResponse = this.getDate();
                } else if (toolName === 'getOrderStatus') {
                    const rawArguments = toolCall.function.arguments;
                    const parsedArguments = JSON.parse(rawArguments);
                    toolResponse = this.getOrderStatus(parsedArguments.orderId);
                } else {
                    continue; // Skip unknown tools
                }

                // Push the tool message with correct tool_call_id
                context.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: toolResponse,
                });
            }
        }

        const secondResponse = await openAI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: context,
        })

        console.log('this is the second response????????????', secondResponse.choices[0].message.content);



        return response;
    }

    getTimeOfDay() {
        return '2:22 pm'
    }

    getDate() {
        return '11-12-2001'
    }

    getOrderStatus(id: number) {
        return `Order ${id} is in processing`
    }


}



//step 1.  Configure chat tools (first openAI call)
//step 2. decide if tool call is required
//step 3. invoke the tool
//step 4. make a second openAI call with the tool response..