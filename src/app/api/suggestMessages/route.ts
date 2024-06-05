import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { StreamingTextResponse, streamText } from 'ai';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req: Request) {
    const { messages } = await req.json();
    const result = await streamText({
        model: openai.chat('gpt-4-turbo'),
        prompt:"check",
    });


    console.log(result, "****************************************************response");

    return result.toAIStreamResponse();

}