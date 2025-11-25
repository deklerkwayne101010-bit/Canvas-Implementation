import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Initialize the client. 
// Note: In a real production app, you might proxy this through a backend to hide the key,
// but for this frontend-only demo, we use the env var directly as per instructions.
let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found in environment variables.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateMagicText = async (prompt: string, currentText?: string): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key missing";

  try {
    const fullPrompt = currentText 
      ? `Rewrite the following text to be ${prompt}: "${currentText}". Return only the rewritten text.`
      : `Write a short, catchy text for a design about: ${prompt}. Return only the text.`;

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

export const generateMagicImage = async (prompt: string): Promise<string> => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  try {
    // Using gemini-2.5-flash-image for standard image generation tasks
    // as per guidelines (nano banana).
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Handle potential multiple parts or finding the inline data
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
       for (const part of parts) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    
    // Fallback if no inline data found but maybe a text description of failure
    if (response.text) {
        throw new Error("Model returned text instead of image: " + response.text);
    }

    throw new Error("No image data generated");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const removeTextFromImage = async (base64Image: string): Promise<string> => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  // Strip prefix if present for the API call
  const data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const mimeType = base64Image.match(/data:image\/(.*?);base64/)?.[1] || 'image/png';

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            { inlineData: { mimeType, data } },
            { text: "Remove all text from this image, keeping the background intact." }
        ]
      }
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
       for (const part of parts) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Remove Text Error:", error);
    throw error;
  }
};

interface ExtractedText {
    content: string;
    box_2d: [number, number, number, number]; // ymin, xmin, ymax, xmax
}

export const extractTextFromImage = async (base64Image: string): Promise<ExtractedText[]> => {
    const client = getClient();
    if (!client) throw new Error("API Key missing");

    const data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    const mimeType = base64Image.match(/data:image\/(.*?);base64/)?.[1] || 'image/png';

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: "Detect all text in this image. Return a JSON list where each item has 'content' (the text string) and 'box_2d' (ymin, xmin, ymax, xmax) using a 0-1000 scale." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            content: { type: Type.STRING },
                            box_2d: { type: Type.ARRAY, items: { type: Type.INTEGER } } // [ymin, xmin, ymax, xmax]
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (error) {
        console.error("Extract Text Error:", error);
        return [];
    }
};
