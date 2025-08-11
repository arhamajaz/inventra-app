// src/ai/flows/demand-forecasting.ts
'use server';

/**
 * @fileOverview A demand forecasting AI agent.
 *
 * - forecastDemand - A function that handles the demand forecasting process.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastDemandInputSchema = z.object({
  productName: z.string().describe('The name of the product to forecast demand for.'),
  historicalSalesData: z.string().describe('Historical sales data for the product, in JSON format.'),
  marketTrends: z.string().optional().describe('Optional: Current market trends that might affect demand, in text format.'),
  seasonalTrends: z.string().optional().describe('Optional: Seasonal trends that might affect demand, in text format.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const ForecastDemandOutputSchema = z.object({
  forecastedDemand: z.string().describe('A forecast of demand for the next month, in JSON format, with each day as a key and the forecasted demand as the value.'),
  confidenceLevel: z.number().describe('A number between 0 and 1 indicating the confidence level of the forecast.'),
  explanation: z.string().describe('An explanation of the factors that influenced the forecast.'),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: ForecastDemandInputSchema},
  output: {schema: ForecastDemandOutputSchema},
  prompt: `You are an expert demand forecaster. You will be provided with the historical sales data for a product, and you will use this information to forecast demand for the next month.

{% if marketTrends %}Here are some current market trends that might affect demand:
{{marketTrends}}
{% endif %}

{% if seasonalTrends %}Here are some seasonal trends that might affect demand:
{{seasonalTrends}}
{% endif %}

Historical Sales Data:
{{historicalSalesData}}

Product Name:
{{productName}}

Please provide a forecast of demand for the next month, in JSON format, with each day as a key and the forecasted demand as the value. Also, provide a confidence level for the forecast, and an explanation of the factors that influenced the forecast.
`, 
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
