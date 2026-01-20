
import { GoogleGenAI } from "@google/genai";

export const generateNoticeContent = async (topic: string): Promise<{ title: string; description: string }> => {
  try {
    // Initialize inside the call to ensure the latest API_KEY is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional announcement for an investment platform admin panel about: ${topic}. 
      Format the response as JSON with "title" and "description" fields. 
      Keep it professional and concise.`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const data = JSON.parse(text);
    return {
      title: data.title || 'System Update',
      description: data.description || 'New updates have been deployed.'
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: 'Manual Notice',
      description: 'System-generated message placeholder.'
    };
  }
};
