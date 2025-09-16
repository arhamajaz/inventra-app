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
import { products } from '@/lib/mock-data';

const productList = products.map(p => ({ id: p.id, name: p.name, category: p.category }));

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

const prompt = ai.definePrompt({
  name: 'identifyProductPrompt',
  input: {schema: IdentifyProductInputSchema},
  output: {schema: IdentifyProductOutputSchema},
  prompt: `You are an expert product identifier for an inventory management system. You will be provided with an image of a product.
Your task is to first use your general knowledge to identify the product in the image.
Then, you must determine if this identified product matches any of the products in the following list.

Available products (JSON format):
${JSON.stringify(productList)}

Use the image as the primary source of information. Provide the product name of the best match from the list, its corresponding ID, a confidence score for the match, and your reasoning.

If the product in the image does not seem to match any product in the list, identify the product from your general knowledge, but choose the closest possible match from the list and use a lower confidence score to indicate the mismatch.

Image: {{media url=photoDataUri}}`,
});

const identifyProductFlow = ai.defineFlow(
  {
    name: 'identifyProductFlow',
    inputSchema: IdentifyProductInputSchema,
    outputSchema: IdentifyProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
