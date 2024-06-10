import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { StreamData, StreamingTextResponse, streamText } from 'ai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function POST(req: Request) {
  const prompt =
    "Suggested  casual questions in one line and use || for separation in one line only";

  // const questions:string[] = prompt.split('||');
  // const finalPrompt = questions.join('\n');

  const result = await streamText({
    model: openai.chat('gemma-7b-it'),
    prompt: prompt,
  });


  const data = new StreamData();


  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });
  // return result.toAIStreamResponse(); 
  return new StreamingTextResponse(stream);

}

