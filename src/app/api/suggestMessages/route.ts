import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST() {
  const result = await streamText({
    model: groq.chat("llama-3.1-8b-instant"),
    prompt:
      "Suggest casual conversation questions in one line using || as separator",
  });
 
  return result.toTextStreamResponse();
}
 