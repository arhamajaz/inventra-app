import { prisma } from './prisma';

export async function getAiPrompt(name: string, defaultPrompt: string): Promise<string> {
  try {
    const promptRecord = await prisma.aiPrompt.findUnique({
      where: { name },
    });
    return promptRecord?.prompt || defaultPrompt;
  } catch (error) {
    console.error(`Failed to fetch AI prompt '${name}':`, error);
    return defaultPrompt;
  }
}
