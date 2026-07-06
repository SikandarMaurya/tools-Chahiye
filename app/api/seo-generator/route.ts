import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { 
      websiteName, 
      pageTitle, 
      pageUrl, 
      targetKeyword, 
      secondaryKeywords, 
      pageType, 
      businessType, 
      tone, 
      targetCountry,
      language
    } = await req.json();

    if (!pageTitle || !targetKeyword) {
      return NextResponse.json({ error: "Page Title and Target Keyword are required" }, { status: 400 });
    }

    const prompt = `
You are an expert SEO professional. Generate a comprehensive SEO metadata and analysis payload based on the following inputs:

Inputs:
- Website Name: ${websiteName || 'N/A'}
- Page Title Idea: ${pageTitle}
- Target URL: ${pageUrl || 'N/A'}
- Primary Target Keyword: ${targetKeyword}
- Secondary Keywords: ${secondaryKeywords || 'N/A'}
- Page Type: ${pageType || 'WebPage'}
- Business Type: ${businessType || 'N/A'}
- Tone: ${tone || 'Professional'}
- Target Country: ${targetCountry || 'Global'}
- Language: ${language || 'English'}

Provide the output as a valid JSON object matching this exact structure:

{
  "meta": {
    "title": "SEO Optimized Title (target ~60 chars)",
    "description": "SEO Optimized Description (target 150-160 chars)",
    "urlSlug": "seo-friendly-slug-with-hyphens"
  },
  "keywords": {
    "primary": "Primary Keyword",
    "secondary": ["kw1", "kw2"],
    "lsi": ["lsi1", "lsi2"],
    "longTail": ["long tail 1", "long tail 2"]
  },
  "headings": {
    "h1": "Optimized H1 Tag",
    "h2": ["H2 suggestion 1", "H2 suggestion 2", "H2 suggestion 3"],
    "h3": ["H3 suggestion 1", "H3 suggestion 2"]
  },
  "suggestions": {
    "imageAltTags": ["suggested alt tag 1", "suggested alt tag 2"],
    "internalLinks": ["topic for internal link 1"],
    "externalLinks": ["type of authority site to link to"]
  },
  "openGraph": {
    "title": "OG Title",
    "description": "OG Description",
    "type": "website or article etc"
  },
  "twitter": {
    "title": "Twitter Title",
    "description": "Twitter Description",
    "card": "summary_large_image"
  },
  "schema": {
     // Provide a valid JSON-LD object relevant to the Page Type (e.g., Article, Product, WebPage, FAQPage)
  },
  "faqs": [
    { "question": "Relevant FAQ 1", "answer": "Answer 1" },
    { "question": "Relevant FAQ 2", "answer": "Answer 2" },
    { "question": "Relevant FAQ 3", "answer": "Answer 3" }
  ],
  "analysis": {
    "score": 95, // integer out of 100 representing how well the inputs were optimized initially
    "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2", "Improvement suggestion 3"]
  }
}

Ensure the output language matches the requested Language.
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
    console.error("SEO Generator API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate SEO data" },
      { status: 500 }
    );
  }
}
