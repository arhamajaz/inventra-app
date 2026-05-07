
'use server';

import { forecastDemand, ForecastDemandInput, ForecastDemandOutput } from '@/ai/flows/demand-forecasting';
import { calculateRestockThreshold, CalculateRestockThresholdInput, CalculateRestockThresholdOutput } from '@/ai/flows/restock-alert-threshold';
import { identifyProduct, IdentifyProductInput, IdentifyProductOutput } from '@/ai/flows/product-identification';
import { processUserFeedback } from '@/ai/flows/process-feedback';
import type { ProcessFeedbackInput, ProcessFeedbackOutput } from '@/lib/feedback-types';
import { prisma } from '@/lib/prisma';
import { Product, Order, Customer } from '@/lib/types';


type ForecastResult = ForecastDemandOutput | { error: string };
type RestockResult = CalculateRestockThresholdOutput | { error: string };
type IdentifyResult = IdentifyProductOutput | { error: string };
type FeedbackResult = ProcessFeedbackOutput | { error: string };


export async function getDemandForecast(input: ForecastDemandInput): Promise<ForecastResult> {
  try {
    const result = await forecastDemand(input);
    return result;
  } catch (error) {
    console.error('Demand forecast failed:', error);
    let message = error instanceof Error ? error.message : 'An unknown error occurred';
    if (message.toLowerCase().includes('quota') || message.toLowerCase().includes('limit')) {
      message = 'AI service is temporarily busy (quota exceeded). Please try again in a minute.';
    }
    return { error: message };
  }
}

export async function getRestockThreshold(input: CalculateRestockThresholdInput): Promise<RestockResult> {
    try {
      const result = await calculateRestockThreshold(input);
      return result;
    } catch (error) {
      console.error('Restock threshold calculation failed:', error);
      let message = error instanceof Error ? error.message : 'An unknown error occurred';
      if (message.toLowerCase().includes('quota') || message.toLowerCase().includes('limit')) {
        message = 'AI service is temporarily busy (quota exceeded). Please try again in a minute.';
      }
      return { error: message };
    }
  }

export async function getProductIdentification(input: IdentifyProductInput): Promise<IdentifyResult & { dbProduct?: Product | null }> {
  try {
    const result = await identifyProduct(input);
    let dbProduct: Product | null = null;

    if (result.productId) {
      const found = await prisma.product.findUnique({
        where: { id: result.productId }
      });
      if (found) {
        dbProduct = found as unknown as Product;
      }
    }

    return { ...result, dbProduct };
  } catch (error) {
    console.error('Product identification failed:', error);
    let message = error instanceof Error ? error.message : 'An unknown error occurred';
    if (message.toLowerCase().includes('quota') || message.toLowerCase().includes('limit')) {
      message = 'AI service is temporarily busy (quota exceeded). Please try again in a minute.';
    }
    return { error: message } as any;
  }
}

export async function processFeedback(input: ProcessFeedbackInput): Promise<FeedbackResult> {
    try {
      const result = await processUserFeedback(input);
      return result;
    } catch (error) {
      console.error('Processing feedback failed:', error);
      let message = error instanceof Error ? error.message : 'An unknown error occurred';
      if (message.toLowerCase().includes('quota') || message.toLowerCase().includes('limit')) {
        message = 'AI service is temporarily busy (quota exceeded). Please try again in a minute.';
      }
      return { error: message };
    }
  }

// Database Actions
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany();
    return products as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product as unknown as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany();
    return orders as unknown as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const customers = await prisma.customer.findMany();
    return customers as unknown as Customer[];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getDashboardStats() {
    try {
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const customerCount = await prisma.customer.count();
        
        const products = await prisma.product.findMany({
            select: { stock: true, threshold: true }
        });
        const lowStockCount = products.filter(p => p.stock <= p.threshold).length;

        const salesData = [
            { name: 'Jan', sales: 450000 },
            { name: 'Feb', sales: 480000 },
            { name: 'Mar', sales: 520000 },
            { name: 'Apr', sales: 490000 },
            { name: 'May', sales: 550000 },
            { name: 'Jun', sales: 580000 },
        ];

        return {
            productCount,
            orderCount,
            customerCount,
            lowStockCount,
            salesData
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { productCount: 0, orderCount: 0, customerCount: 0, lowStockCount: 0, salesData: [] };
    }
}
export async function registerUser(data: { email: string; name: string; role: 'Admin' | 'Consumer' }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: 'User already exists' };
    }

    let customerId: string | undefined;
    if (data.role === 'Consumer') {
      const generatedId = `CUST-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const customer = await prisma.customer.create({
        data: {
          id: generatedId,
          name: data.name,
          email: data.email,
        },
      });
      customerId = customer.id;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        customerId: customerId,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Registration failed:', error);
    return { error: 'Failed to create account' };
  }
}
