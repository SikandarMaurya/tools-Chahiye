import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text, mode, language, style } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `
You are a highly capable AI Content Summarizer.
Analyze the following text and provide a structured JSON response based on the requested parameters.

Parameters:
- Mode (Length/Type): ${mode || 'Auto'}
- Language: ${language || 'Auto'}
- Style: ${style || 'Professional'}

Please provide the output in the requested language.

Required JSON Structure:
{
  "title": "A suitable title for the content",
  "summary": "The main summary text based on the Mode and Style requested",
  "bulletPoints": ["Point 1", "Point 2", "Point 3"],
  "keywords": ["keyword1", "keyword2"],
  "keyInformation": {
    "mainIdea": "Brief statement of the main idea",
    "actionItems": ["Action 1", "Action 2"],
    "dates": ["Date 1"],
    "names": ["Name 1"],
    "numbers": ["Number 1"]
  }
}

Text to summarize:
"""
${text}
"""
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    
    if (!responseText) {
       throw new Error("No response from AI");
    }

    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Summarize API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
