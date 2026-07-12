import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const ai = getAI();
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert prompt engineer. Your task is to take a simple prompt for image generation and enhance it to be highly detailed, descriptive, and optimized for an AI image generator.

Focus on adding details about:
1. Subject matter and composition
2. Lighting and atmosphere
3. Camera angle, lens type, or perspective
4. Artistic style (e.g., cinematic, photorealistic, cyberpunk, watercolor)
5. Color palette

Return ONLY the enhanced prompt text, without any conversational padding, quotes, or markdown formatting. The output should be a single paragraph ready to be pasted directly into an image generator.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nOriginal prompt: " + prompt }] }
      ]
    });

    const enhancedPrompt = response.text?.trim() || prompt;

    return NextResponse.json({ enhancedPrompt });
  } catch (error: any) {
    console.error("Enhance Prompt API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
