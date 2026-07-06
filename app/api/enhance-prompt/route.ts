import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `You are an expert AI prompt engineer. 
Your task is to take a simple or basic image prompt and enhance it into a highly detailed, professional prompt suitable for Midjourney or Gemini Image generation. 
Add details like lighting, camera type, style, mood, resolution (e.g. 8K, highly detailed), and composition.
Keep the enhanced prompt under 60 words. 
ONLY output the enhanced prompt, nothing else. No conversational text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ enhancedPrompt: response.text.trim() });
  } catch (error: any) {
    console.error("Prompt Enhancer API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
