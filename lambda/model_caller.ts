import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput } from "@aws-sdk/client-bedrock-runtime";
import { Handler } from "aws-lambda";
import { HtmlToTextOptions, convert } from "html-to-text";
import fetch from "node-fetch";

export const handler: Handler = async (event, context) => {

    const badResponse = {
        statusCode: 400,
        body: JSON.stringify('Invalid request.  Give me a valid URL!')
    }

    if (event.body && event.body !== "") {
        let body = JSON.parse(event.body);
        if (body.url && body.url !== "") {
            let url = body.url;

            const websiteResponse = await fetch(new URL(url));
            const websiteHtml = await websiteResponse.text();
            const covertOptions: HtmlToTextOptions = {
                wordwrap: 150
            }

            const websiteText = convert(websiteHtml, covertOptions);

            const modelId = process.env.MODEL_ID;
            const contentType = 'application/json';
            const rockerRuntimeClient = new BedrockRuntimeClient({region: process.env.REGION});
            const modelInstruction = 'Summarize the above web page content.';

            const inputCommand: InvokeModelCommandInput = { 
                modelId,
                contentType,
                accept: contentType,
                body: JSON.stringify({
                    anthropic_version: 'bedrock-2023-05-31',
                    max_tokens: 1024,
                    messages: [
                        {role: 'user', 'content': `"${websiteText}" ${modelInstruction}` }
                    ]
                })
            }
            
            const command = new InvokeModelCommand(inputCommand);
            const response = await rockerRuntimeClient.send(command);
    
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': `${contentType}`
                },
                body: JSON.stringify(JSON.parse(new TextDecoder().decode(response.body)).content, null, 2)
            }
        } else {
            return badResponse;
        }
    } else {
        return badResponse;
    }
}