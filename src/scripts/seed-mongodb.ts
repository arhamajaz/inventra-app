import { PrismaClient } from '@prisma/client';
import { customers, products, orders } from '../lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // Seed Customers
  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  }

  // Seed Products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        category: product.category,
        stock: product.stock,
        capacity: product.capacity,
        threshold: product.threshold,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description || '',
        historicalSalesData: product.historicalSalesData,
      },
    });
  }

  // Seed Orders
  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {},
      create: {
        id: order.id,
        customerName: order.customerName,
        customerId: order.customerId,
        status: order.status,
        date: order.date,
        items: order.items,
      },
    });
  }

  // Seed AI Prompts
  console.log('Seeding AI prompts...');
  const prompts = [
    {
      name: 'demandForecasting',
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

Please provide a forecast of demand for the next month, in JSON format, with each day as a key and the forecasted demand as the value. Also, provide a confidence level for the forecast, and an explanation of the factors that influenced the forecast.`,
    },
    {
      name: 'productIdentification',
      prompt: `You are an expert product identifier for an inventory management system. You will be provided with an image of a product.
Your task is to first use your general knowledge to identify the product in the image.
Then, you must determine if this identified product matches any of the products in the following list.

Available products (JSON format):
{{productListString}}

Use the image as the primary source of information. Provide the product name of the best match from the list, its corresponding ID, a confidence score for the match, and your reasoning.

If the product in the image does not seem to match any product in the list, identify the product from your general knowledge, but choose the closest possible match from the list and use a lower confidence score to indicate the mismatch.`,
    },
    {
      name: 'restockThreshold',
      prompt: `You are an expert inventory management consultant. You will analyze the provided data and determine the optimal restock threshold for a product.  The goal is to minimize stockouts while also avoiding overstocking.

  Here is the information about the product:
  - Product ID: {{{productId}}}
  - Historical Sales Data (JSON): {{{historicalSalesData}}}
  - Current Stock Level: {{{currentStockLevel}}}
  - Lead Time (Days): {{{leadTimeDays}}}
  - Desired Service Level: {{{serviceLevel}}}

  Consider the following factors:
  - Average daily sales during the lead time.
  - Variability in sales (e.g., standard deviation of daily sales).
  - The desired service level (higher service level requires a larger safety stock).

  Based on this analysis, what is the optimal restock threshold for this product, and what is your reasoning?

  Format your response as a JSON object with the following keys:
  - restockThreshold (number): The calculated restock threshold.
  - reasoning (string): A detailed explanation of the factors considered and the calculation steps.

  Ensure that the restockThreshold is a number and the reasoning is a clear and concise explanation.
  Remember to take into account the fact that the ideal re-stock threshold should adapt to historical sales data to minimize stockouts and overstocking.`,
    },
    {
      name: 'processFeedback',
      prompt: `You are a friendly customer support agent for an inventory management app called Inven-tra. Your task is to respond to user submissions, which can be either general feedback or a request for a new product.
      
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
      
      Please generate a friendly and appropriate JSON response object containing a title and a confirmation message.`,
    }
  ];

  for (const p of prompts) {
    await prisma.aiPrompt.upsert({
      where: { name: p.name },
      update: { prompt: p.prompt },
      create: p,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
