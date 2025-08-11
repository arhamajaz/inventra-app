import { config } from 'dotenv';
config();

import '@/ai/flows/restock-alert-threshold.ts';
import '@/ai/flows/demand-forecasting.ts';
import '@/ai/flows/product-identification.ts';
