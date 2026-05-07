import { prisma } from './prisma';

interface LogUsageParams {
  userId?: string;
  modelName: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  action: string;
}

export async function logAiUsage({
  userId,
  modelName,
  promptTokens,
  completionTokens,
  totalTokens,
  action,
}: LogUsageParams) {
  try {
    await prisma.aiUsage.create({
      data: {
        userId,
        modelName,
        promptTokens,
        completionTokens,
        totalTokens,
        action,
      },
    });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}
