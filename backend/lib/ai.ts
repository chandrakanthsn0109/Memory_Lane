import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateText(blueprint: any) {
  const prompt = `
Write a short workplace memory.

Event: ${blueprint.eventType}
Emotion: ${blueprint.emotion}
Intensity: ${blueprint.intensity}

Rules:
- Max 30 words
- No metrics, no points, no rankings

Return:
Headline:
Story:
Close:
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return parseGeminiResponse(text);
}

function parseGeminiResponse(text: string) {
  const lines = text.split("\n").filter(Boolean);
  return {
    headline: lines[0] || "A Meaningful Moment",
    story: lines[1] || "",
    close: lines[2] || ""
  };
}
