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
    const body = await req.json();
    const { 
      prompt,
      model = 'gemini-3.1-flash-lite-image',
      aspectRatio = '1:1',
      imageSize = '1K',
      numImages = 1
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    
    // Safety check for models
    const actualModel = model === 'gemini-3.1-flash-image' ? 'gemini-3.1-flash-image' : 'gemini-3.1-flash-lite-image';

    const generatePromise = async () => {
      const response = await ai.models.generateContent({
        model: actualModel,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        }
      });
      
      let imageUrl = null;
      let textResponse = '';
      
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
        } else if (part.text) {
          textResponse += part.text;
        }
      }
      return imageUrl;
    };

    // Generate multiple images if requested (up to 4)
    const count = Math.min(Math.max(1, parseInt(numImages) || 1), 4);
    const promises = Array(count).fill(0).map(() => generatePromise());
    
    const results = await Promise.allSettled(promises);
    
    const images: string[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        images.push(result.value);
      }
    });

    if (images.length === 0) {
      // If all failed, throw the first error if available
      const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
      throw new Error(firstError?.reason?.message || "Failed to generate images");
    }

    return NextResponse.json({ images });

  } catch (error: any) {
    console.error("Image Generation API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
