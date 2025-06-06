
'use server';
/**
 * @fileOverview A Genkit flow to interact with an AI Chat model (now Google AI).
 *
 * - callDeepseekChat - A function that handles sending a message and getting a response.
 *   (Note: Name kept for compatibility, but now uses Google AI via Genkit)
 * - AiAssistantChatFlowInput - The input type for the function.
 * - AiAssistantChatFlowOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit'; // Genkit is already configured with GoogleAI
import { z } from 'genkit';
import type { AiAssistantChatFlowInput, AiAssistantChatFlowOutput } from '@/types';

const AiChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message to the assistant."),
  // chatHistory: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).optional().describe("Optional chat history for context.")
});

const AiChatOutputSchema = z.object({
  assistantResponse: z.string().describe("The assistant's response message."),
});

// This is the actual function that will be called from the frontend.
// The name 'callDeepseekChat' is kept for compatibility with the existing frontend call,
// but it now uses Google AI via Genkit.
export async function callDeepseekChat(input: AiAssistantChatFlowInput): Promise<AiAssistantChatFlowOutput> {
  // Check for Google API Key, as Genkit's googleAI plugin relies on it.
  const googleApiKeyFromEnv = process.env.GOOGLE_API_KEY;
  if (!googleApiKeyFromEnv || googleApiKeyFromEnv === 'YOUR_API_KEY_HERE' || googleApiKeyFromEnv.trim() === '') {
    const errorMessage = "AI Assistant is not configured for Google AI. GOOGLE_API_KEY missing, empty, or using placeholder. " +
                         "Please check the server logs for more details and ensure a valid GOOGLE_API_KEY is set in your .env file and that the server has been restarted.";
    console.error(
      "🛑 GOOGLE_API_KEY ERROR (AI Assistant): Key is missing, empty, or still the placeholder 'YOUR_API_KEY_HERE'.\n" +
      `  - Value of process.env.GOOGLE_API_KEY found by server: "${googleApiKeyFromEnv}"\n` +
      "  - Please ensure a valid GOOGLE_API_KEY is set in your .env file in the project root.\n" +
      "  - IMPORTANT: You MUST restart your Next.js development server (npm run dev) after changing the .env file."
    );
    throw new Error(errorMessage);
  }
  return aiAssistantChatFlow(input);
}

const aiAssistantChatFlow = ai.defineFlow(
  {
    name: 'aiAssistantChatFlow', // Renamed flow for clarity internally
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => {
    // Construct a simple prompt. For more complex history, you might build a prompt array.
    const prompt = `System: You are a helpful assistant. User: ${input.userMessage} Assistant:`;
    
    try {
      const response = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.0-flash', // Or your preferred Google AI model
        config: {
          // You can add safety settings or other configurations here if needed
          // temperature: 0.7,
        },
      });

      const assistantResponse = response.text;

      if (!assistantResponse) {
        throw new Error('No response content from AI model.');
      }

      return { assistantResponse };

    } catch (error) {
      console.error("Error calling Google AI model for AI Assistant:", error);
      let detailedErrorMessage = `Failed to get response from AI Assistant.`;

      if (error instanceof Error) {
        // Re-throw original configuration errors if they somehow get here
        if (error.message.startsWith('AI Assistant is not configured for Google AI')) {
          throw error;
        }
        detailedErrorMessage = `Failed to get response from AI Assistant: ${error.message}`;
      } else {
        detailedErrorMessage = `Failed to get response from AI Assistant: An unexpected error occurred.`;
      }
      throw new Error(detailedErrorMessage);
    }
  }
);
