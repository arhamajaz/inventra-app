
import { z } from 'zod';

export const ProcessFeedbackInputSchema = z.object({
    feedback: z.string().optional().describe("The user's general feedback."),
    productRequest: z.string().optional().describe("The user's product request."),
});
export type ProcessFeedbackInput = z.infer<typeof ProcessFeedbackInputSchema>;

export const ProcessFeedbackOutputSchema = z.object({
    title: z.string().describe('A short, friendly title for the response.'),
    message: z.string().describe('A confirmation message to the user, acknowledging their submission and explaining the next steps.'),
});
export type ProcessFeedbackOutput = z.infer<typeof ProcessFeedbackOutputSchema>;
