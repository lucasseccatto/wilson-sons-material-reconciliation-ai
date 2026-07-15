import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

/**
 * Lazily retrieves the initialized Google Gen AI client.
 * This prevents app crashes at module-load time if the API key is missing.
 */
export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('A variável de ambiente GEMINI_API_KEY é obrigatória para usar o motor de reconciliação de IA.');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}
