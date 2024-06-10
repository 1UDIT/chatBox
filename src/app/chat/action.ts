'use server';

import { generateText } from 'ai'; 
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

export async function getAnswer(question: string) {
  const prompt =
    "If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?||tell me about your plan";

  const questions: string[] = prompt.split('||');
  const finalPrompt = questions.join('\n');

  const { text, finishReason, usage } = await generateText({
    model: openai.chat('llama3-8b-8192'),
    prompt: finalPrompt,
  });

  return { text, finishReason, usage };
}