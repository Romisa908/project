
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, VerificationStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function verifyClaim(claim: string): Promise<VerificationResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this skin or hair care claim: "${claim}"`,
    config: {
      systemInstruction: `You are a world-class dermatological science expert and cosmetic chemist. 
      Your goal is to verify skin and hair care claims found on social media or in advertising.
      Break down the ingredients or practices, verify them with scientific literature, and categorize them.
      Be objective, concise, and prioritize safety. 
      Do NOT provide medical diagnosis or treatment. 
      State clearly if evidence is insufficient.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.STRING },
          classification: { 
            type: Type.STRING, 
            description: "One of: 'Scientifically Supported', 'Partially Supported', 'Not Supported', or 'Insufficient Evidence'" 
          },
          ingredients: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Key active ingredients or practices involved."
          },
          scientificExplanation: { 
            type: Type.STRING,
            description: "A simple yet scientific explanation of why the claim is or isn't valid."
          },
          potentialRisks: { 
            type: Type.STRING,
            description: "Dermatological risks like irritation, photosensitivity, or chemical burns."
          },
          alternatives: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Safe, evidence-based alternatives or better ways to use the ingredients."
          },
          confidenceScore: { 
            type: Type.NUMBER,
            description: "Score from 0 to 1 indicating scientific certainty."
          }
        },
        required: ["claim", "classification", "ingredients", "scientificExplanation", "potentialRisks", "alternatives", "confidenceScore"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    return result as VerificationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Verification failed. Please try a more specific claim.");
  }
}
