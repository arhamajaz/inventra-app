
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env
config({ path: path.resolve(process.cwd(), '.env') });

async function verifyGemini() {
  const { ai } = await import('../ai/genkit');
  console.log('--- Gemini API Verification ---');
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY is missing in .env');
    process.exit(1);
  }

  console.log(`✅ GEMINI_API_KEY found: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);

  try {
    console.log('Testing AI generation...');
    const response = await ai.generate('Say "API Key Verification Successful" if you can hear me.');
    console.log(`🤖 AI Response: ${response.text}`);
    console.log('✅ Data flow verification successful!');
  } catch (error) {
    console.error('❌ AI Generation failed:', error);
    process.exit(1);
  }
}

verifyGemini();
