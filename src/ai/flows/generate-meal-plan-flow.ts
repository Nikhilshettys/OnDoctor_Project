
'use server';
/**
 * @fileOverview Generates a meal plan based on age, gender, and dietary preference using Google AI (Gemini).
 *
 * - generateMealPlan - A function that handles meal plan generation.
 * - MealPlannerFlowInput - The input type for the generateMealPlan function.
 * - MealPlannerFlowOutput - The return type for the generateMealPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MealPlannerFlowInput, MealPlannerFlowOutput, MealSuggestionItem } from '@/types';

const MealPlannerInputSchema = z.object({
  age: z.number().int().positive().describe("User's age in years."),
  gender: z.enum(['Male', 'Female', 'Other']).describe("User's gender."),
  dietaryPreference: z.enum(['Vegetarian', 'Non-Vegetarian']).describe("User's dietary preference."),
});

const MealSuggestionSchema = z.object({
  mealType: z.enum(["Breakfast", "Lunch", "Dinner"]).describe("The type of meal (Breakfast, Lunch, or Dinner)."),
  description: z.string().describe("A concise description of a suitable dish for this meal."),
});

const MealPlannerOutputSchema = z.object({
  mealPlan: z.array(MealSuggestionSchema).length(3).describe("An array of exactly three meal suggestions: Breakfast, Lunch, and Dinner, in that order."),
  generalAdvice: z.string().optional().describe("Brief general dietary advice (1-2 helpful sentences), potentially reinforcing protein and mineral intake."),
});

// This is the actual function that will be called from the frontend.
export async function generateMealPlan(input: MealPlannerFlowInput): Promise<MealPlannerFlowOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.error(
      "Google AI API Key is not configured for Meal Planner. " +
      "It's either missing, empty, or still the placeholder 'YOUR_API_KEY_HERE'. " +
      "Value of process.env.GOOGLE_API_KEY: ", process.env.GOOGLE_API_KEY,
      "Please set a valid GOOGLE_API_KEY in your .env file and restart your server."
    );
    throw new Error(
      'The Meal Planner AI is not configured. Google API key missing, empty, or using placeholder. ' +
      'Please set a valid GOOGLE_API_KEY in your .env file and restart your server.'
    );
  }
  return mealPlannerFlow(input);
}

const mealPlannerPrompt = ai.definePrompt({
  name: 'mealPlannerPrompt',
  input: { schema: MealPlannerInputSchema },
  output: { schema: MealPlannerOutputSchema },
  model: 'googleai/gemini-2.0-flash', // Explicitly use gemini-2.0-flash
  prompt: `
You are an expert nutritionist AI. Your task is to generate a sample one-day meal plan
and provide brief general dietary advice based on the user's age, gender, and dietary preference.

User Details:
Age: {{{age}}} years
Gender: {{{gender}}}
Dietary Preference: {{{dietaryPreference}}}

Instructions:
- You MUST provide exactly three meal suggestions in a JSON field called 'mealPlan'.
- 'mealPlan' should be an array of objects. Each object must have a 'mealType' (string: "Breakfast", "Lunch", or "Dinner") and a 'description' (string: a concise description of a suitable dish).
- The meal suggestions MUST be in the order: Breakfast, Lunch, Dinner.
- Ensure the suggestions are balanced and appropriate for the given profile.
- **Crucially, the meal plan should prioritize foods rich in protein and essential minerals.** Consider sources like lean meats, fish, poultry, beans, lentils, tofu, nuts, seeds, dairy or fortified plant-based alternatives, and a variety of fruits and vegetables, especially leafy greens.
- If the preference is 'Vegetarian', all suggestions must be strictly vegetarian (no meat or fish), while still focusing on protein and mineral content from plant-based sources.
- If the preference is 'Non-Vegetarian', you can include meat, fish, or poultry, but aim for a balanced intake and variety, emphasizing lean protein and mineral-dense options.
- Provide general dietary advice (1-2 helpful sentences) in a JSON field called 'generalAdvice'. This advice should potentially reinforce the importance of protein and minerals.
- Structure your ENTIRE output as a single, valid JSON object matching the defined output schema.
`,
});

const mealPlannerFlow = ai.defineFlow(
  {
    name: 'mealPlannerFlow',
    inputSchema: MealPlannerInputSchema,
    outputSchema: MealPlannerOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await mealPlannerPrompt(input);
      if (!output) {
        throw new Error('Failed to generate meal plan from AI. No output received.');
      }
      // Validate the structure of the mealPlan array.
      if (
        !output.mealPlan ||
        output.mealPlan.length !== 3 ||
        output.mealPlan[0].mealType !== "Breakfast" ||
        output.mealPlan[1].mealType !== "Lunch" ||
        output.mealPlan[2].mealType !== "Dinner"
      ) {
        console.warn("AI output for meal plan structure might not be as expected (B,L,D). Output:", JSON.stringify(output.mealPlan));
        // Attempt to create a fallback or throw a more specific error.
        // For now, let's allow it if it generally conforms but log a warning.
        // A stricter approach might throw new Error("AI did not return meals in the expected Breakfast, Lunch, Dinner order.");
      }
      return output;
    } catch (error) {
      console.error("Error in mealPlannerFlow:", error);
      // Provide a structured error response that the frontend can handle
      // This helps if the AI completely fails or if parsing the structured output fails.
      return {
        mealPlan: [
          { mealType: "Breakfast", description: "Error: Could not generate suggestion." },
          { mealType: "Lunch", description: "Error: Could not generate suggestion." },
          { mealType: "Dinner", description: "Error: Could not generate suggestion." }
        ],
        generalAdvice: `An error occurred while generating the meal plan: ${error instanceof Error ? error.message : String(error)}. Please check API key and server logs.`,
      };
    }
  }
);
