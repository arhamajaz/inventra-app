'use server';
/**
 * @fileOverview A product identification AI agent.
 *
 * - identifyProduct - A function that handles the product identification process.
 * - IdentifyProductInput - The input type for the identifyProduct function.
 * - IdentifyProductOutput - The return type for the identifyProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { logAiUsage } from '@/lib/ai-tracking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const IdentifyProductInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyProductInput = z.infer<typeof IdentifyProductInputSchema>;

const IdentifyProductOutputSchema = z.object({
  productName: z.string().describe('The name of the identified product.'),
  productId: z.string().describe('The ID of the identified product from the provided list.'),
  confidence: z.number().describe('A number between 0 and 1 indicating the confidence level of the identification.'),
  reasoning: z.string().describe('An explanation of the factors that influenced the identification.'),
});
export type IdentifyProductOutput = z.infer<typeof IdentifyProductOutputSchema>;

export async function identifyProduct(input: IdentifyProductInput): Promise<IdentifyProductOutput> {
  return identifyProductFlow(input);
}

import { getAiPrompt } from '@/lib/ai-prompts';

const DEFAULT_PROMPT = `You are an expert product identifier for an inventory management system. You will be provided with an image of a product.
Your task is to first use your general knowledge to identify the product in the image.
Then, you must determine if this identified product matches any of the products in the following list.

Available products (JSON format):
{{productListString}}

Use the image as the primary source of information. Provide the product name of the best match from the list, its corresponding ID, a confidence score for the match, and your reasoning.

If the product in the image does not seem to match any product in the list, identify the product from your general knowledge, but choose the closest possible match from the list and use a lower confidence score to indicate the mismatch.`;

const identifyProductFlow = ai.defineFlow(
  {
    name: 'identifyProductFlow',
    inputSchema: IdentifyProductInputSchema,
    outputSchema: IdentifyProductOutputSchema,
  },
  async input => {
    // Fetch session for user tracking
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch fresh product list from database
    const products = await prisma.product.findMany({
      select: { id: true, name: true, category: true }
    });
    
    const productListString = JSON.stringify(products);

    // Fetch dynamic prompt
    const dynamicPromptText = await getAiPrompt('productIdentification', DEFAULT_PROMPT);

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      input: input.photoDataUri,
      prompt: dynamicPromptText.replace('{{productListString}}', productListString),
      output: { schema: IdentifyProductOutputSchema },
    });
    
    const output = response.output;

    // Log usage
    if (response.usage) {
      await logAiUsage({
        userId,
        modelName: 'googleai/gemini-2.0-flash',
        promptTokens: response.usage.inputTokens,
        completionTokens: response.usage.outputTokens,
        totalTokens: response.usage.totalTokens,
        action: 'Product Identification',
      });
    }
    
    return output!;
  }
);
