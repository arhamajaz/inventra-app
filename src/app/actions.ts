'use server';

import { forecastDemand, ForecastDemandInput, ForecastDemandOutput } from '@/ai/flows/demand-forecasting';
import { calculateRestockThreshold, CalculateRestockThresholdInput, CalculateRestockThresholdOutput } from '@/ai/flows/restock-alert-threshold';
import { identifyProduct, IdentifyProductInput, IdentifyProductOutput } from '@/ai/flows/product-identification';

type ForecastResult = ForecastDemandOutput | { error: string };
type RestockResult = CalculateRestockThresholdOutput | { error: string };
type IdentifyResult = IdentifyProductOutput | { error: string };

export async function getDemandForecast(input: ForecastDemandInput): Promise<ForecastResult> {
  try {
    const result = await forecastDemand(input);
    return result;
  } catch (error) {
    console.error('Demand forecast failed:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: message };
  }
}

export async function getRestockThreshold(input: CalculateRestockThresholdInput): Promise<RestockResult> {
    try {
      const result = await calculateRestockThreshold(input);
      return result;
    } catch (error) {
      console.error('Restock threshold calculation failed:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return { error: message };
    }
  }

export async function getProductIdentification(input: IdentifyProductInput): Promise<IdentifyResult> {
  try {
    const result = await identifyProduct(input);
    return result;
  } catch (error) {
    console.error('Product identification failed:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: message };
  }
}
