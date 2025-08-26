
'use server';
/**
 * @fileOverview A flow that processes user feedback or a product request.
 *
 * - processUserFeedback - A function that handles the feedback or request.
 * - ProcessFeedbackInput - The input type for the processUserFeedback function.
 * - ProcessFeedbackOutput - The return type for the processUserFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ProcessFeedbackInputSchema = z.object({
  feedback: z.string().optional().describe('The user\'s general feedback.'),
  productRequest: z.string().optional().describe('The user\'s product request.'),
});
export type ProcessFeedbackInput = z.infer<typeof ProcessFeedbackInputSchema>;

export const ProcessFeedbackOutputSchema = z.object({
    title: z.string().describe('A short, friendly title for the response.'),
    message: z.string().describe('A confirmation message to the user, acknowledging their submission and explaining the next steps.'),
});
export type ProcessFeedbackOutput = z.infer<typeof ProcessFeedbackOutputSchema>;


export async function processUserFeedback(input: ProcessFeedbackInput): Promise<ProcessFeedbackOutput> {
  return processFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processFeedbackPrompt',
  input: {schema: ProcessFeedbackInputSchema},
  output: {schema: ProcessFeedbackOutputSchema},
  prompt: `You are a friendly customer support agent for an inventory management app called Foresight. Your task is to respond to user submissions, which can be either general feedback or a request for a new product.

If the user provided feedback:
- Acknowledge their feedback warmly.
- Thank them for taking the time to share their thoughts.
- Assure them that their feedback has been received and will be considered by the team for future improvements.
- Generate a suitable title and message for the confirmation.

If the user provided a product request:
- Acknowledge their request for a new product.
- Thank them for their suggestion.
- Let them know that the request has been forwarded to the procurement team for evaluation.
- Generate a suitable title and message for the confirmation.

The user has submitted the following:
{{#if feedback}}
Feedback: {{{feedback}}}
{{/if}}
{{#if productRequest}}
Product Request: {{{productRequest}}}
{{/if}}

Please generate a friendly and appropriate JSON response object containing a title and a confirmation message.
`,
});

const processFeedbackFlow = ai.defineFlow(
  {
    name: 'processFeedbackFlow',
    inputSchema: ProcessFeedbackInputSchema,
    outputSchema: ProcessFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
