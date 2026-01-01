
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateShopTemplate(shopName: string, category: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a minimalist webshop frontend for a store named "${shopName}" that sells "${category}".
    Include valid HTML, CSS, and some interactive JS. 
    Use a clean, modern aesthetic with Tailwind-like styling in the CSS.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          js: { type: Type.STRING },
        },
        required: ["html", "css", "js"],
      },
    },
  });

  return JSON.parse(response.text);
}
