
'use server';
/**
 * @fileOverview A flow that processes user feedback or a product request.
 *
 * - processUserFeedback - A function that handles the feedback or request.
 */

import {ai} from '@/ai/genkit';
import { processFeedbackPrompt } from '@/ai/prompts/process-feedback-prompt';
import { ProcessFeedbackInput, ProcessFeedbackInputSchema, ProcessFeedbackOutput, ProcessFeedbackOutputSchema } from '@/lib/feedback-types';

export async function processUserFeedback(input: ProcessFeedbackInput): Promise<ProcessFeedbackOutput> {
  return processFeedbackFlow(input);
}

const processFeedbackFlow = ai.defineFlow(
  {
    name: 'processFeedbackFlow',
    inputSchema: ProcessFeedbackInputSchema,
    outputSchema: ProcessFeedbackOutputSchema,
  },
  async input => {
    const prompt = await processFeedbackPrompt();
    const {output} = await prompt(input);
    return output!;
  }
);
