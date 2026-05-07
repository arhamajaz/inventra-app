'use server';

/**
 * @fileOverview A flow that dynamically determines the ideal re-stock alert threshold for a given product.
 *
 * - calculateRestockThreshold - A function that calculates the re-stock threshold.
 * - CalculateRestockThresholdInput - The input type for the calculateRestockThreshold function.
 * - CalculateRestockThresholdOutput - The return type for the calculateRestockThreshold function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

import { logAiUsage } from '@/lib/ai-tracking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const CalculateRestockThresholdInputSchema = z.object({
  productId: z.string().describe('The unique identifier for the product.'),
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data for the product, as a JSON string.  Include date, quantity sold, and any promotional activities.'
    ),
  currentStockLevel: z.number().describe('The current stock level of the product.'),
  leadTimeDays: z.number().describe('The lead time in days required to restock the product.'),
  serviceLevel: z
    .number()
    .describe(
      'The desired service level (probability of not stocking out) as a decimal between 0 and 1.  For example, 0.95 means 95% service level.'
    ),
});
export type CalculateRestockThresholdInput = z.infer<
  typeof CalculateRestockThresholdInputSchema
>;

const CalculateRestockThresholdOutputSchema = z.object({
  restockThreshold: z
    .number()
    .describe(
      'The calculated restock threshold for the product, which should trigger a reorder.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the calculated restock threshold, explaining the factors considered.'
    ),
});
export type CalculateRestockThresholdOutput = z.infer<
  typeof CalculateRestockThresholdOutputSchema
>;

export async function calculateRestockThreshold(
  input: CalculateRestockThresholdInput
): Promise<CalculateRestockThresholdOutput> {
  return calculateRestockThresholdFlow(input);
}

import { getAiPrompt } from '@/lib/ai-prompts';

const DEFAULT_PROMPT = `You are an expert inventory management consultant. You will analyze the provided data and determine the optimal restock threshold for a product.  The goal is to minimize stockouts while also avoiding overstocking.

  Here is the information about the product:
  - Product ID: {{{productId}}}
  - Historical Sales Data (JSON): {{{historicalSalesData}}}
  - Current Stock Level: {{{currentStockLevel}}}
  - Lead Time (Days): {{{leadTimeDays}}}
  - Desired Service Level: {{{serviceLevel}}}

  Consider the following factors:
  - Average daily sales during the lead time.
  - Variability in sales (e.g., standard deviation of daily sales).
  - The desired service level (higher service level requires a larger safety stock).

  Based on this analysis, what is the optimal restock threshold for this product, and what is your reasoning?

  Format your response as a JSON object with the following keys:
  - restockThreshold (number): The calculated restock threshold.
  - reasoning (string): A detailed explanation of the factors considered and the calculation steps.

  Ensure that the restockThreshold is a number and the reasoning is a clear and concise explanation.
  Remember to take into account the fact that the ideal re-stock threshold should adapt to historical sales data to minimize stockouts and overstocking.
  `;

const calculateRestockThresholdFlow = ai.defineFlow(
  {
    name: 'calculateRestockThresholdFlow',
    inputSchema: CalculateRestockThresholdInputSchema,
    outputSchema: CalculateRestockThresholdOutputSchema,
  },
  async input => {
    // Fetch session for user tracking
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch dynamic prompt
    const dynamicPromptText = await getAiPrompt('restockThreshold', DEFAULT_PROMPT);

    const prompt = ai.definePrompt({
      name: 'calculateRestockThresholdPromptInstance',
      input: {schema: CalculateRestockThresholdInputSchema},
      output: {schema: CalculateRestockThresholdOutputSchema},
      prompt: dynamicPromptText,
    });

    const response = await prompt(input);
    const output = response.output;

    // Log usage
    if (response.usage) {
      await logAiUsage({
        userId,
        modelName: 'googleai/gemini-2.0-flash',
        promptTokens: response.usage.inputTokens,
        completionTokens: response.usage.outputTokens,
        totalTokens: response.usage.totalTokens,
        action: 'Restock Threshold Calculation',
      });
    }

    return output!;
  }
);

