
'use server';
/**
 * @fileOverview A flow that processes user feedback or a product request.
 *
 * - processUserFeedback - A function that handles the feedback or request.
 */

import {ai} from '@/ai/genkit';
import { processFeedbackPrompt } from '@/ai/prompts/process-feedback-prompt';
import { ProcessFeedbackInput, ProcessFeedbackInputSchema, ProcessFeedbackOutput, ProcessFeedbackOutputSchema } from '@/lib/feedback-types';

import { logAiUsage } from '@/lib/ai-tracking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    // Fetch session for user tracking
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const prompt = await processFeedbackPrompt();
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
        action: 'Feedback Processing',
      });
    }

    return output!;
  }
);
