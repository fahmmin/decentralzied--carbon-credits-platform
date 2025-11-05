import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message, imageUri1, imageUri2, chatHistory } = await req.json();

        // Get API key from environment variables
        // AI Studio Gemini API key can be set as either:
        // - GEMINI_API_KEY (your preference)
        // - GOOGLE_GENERATIVE_AI_API_KEY (Vercel AI SDK default)
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            console.error('Missing API key. Check your .env.local file has GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY');
            return NextResponse.json(
                { error: 'GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not configured. Please add it to your .env.local file.' },
                { status: 500 }
            );
        }

        // Create Google Generative AI provider with the API key
        // This allows us to pass the API key explicitly instead of relying on env var
        const googleAI = createGoogleGenerativeAI({
            apiKey: apiKey,
        });

        // Build the system prompt
        const systemPrompt = `You are an AI judge for an NFT battle game. You will evaluate two NFTs represented by their image URIs:
- NFT 1: ${imageUri1}
- NFT 2: ${imageUri2}

IMPORTANT: After EACH conversation turn with the user, you MUST choose which NFT you prefer and respond with EXACTLY one of these formats at the END of your response:
- "SELECTION: NFT1" if you prefer the first NFT (${imageUri1})
- "SELECTION: NFT2" if you prefer the second NFT (${imageUri2})

Your response format should be:
1. First, provide a conversational response about the NFTs based on the user's question
2. Then, at the VERY END, include your selection in the exact format above

Make your selection based on:
- The user's conversation and questions
- The visual appeal and quality of the images
- The creative and artistic merit
- Any context provided about the NFTs
- The URL or characteristics described

CRITICAL: You MUST end EVERY response with either "SELECTION: NFT1" or "SELECTION: NFT2". This is required for the battle system to work.`;

        // Build conversation history for the prompt
        let fullPrompt = systemPrompt + "\n\n";

        if (chatHistory && chatHistory.length > 0) {
            chatHistory.forEach((entry: { role: string; content: string }) => {
                if (entry.role === 'user') {
                    fullPrompt += `User: ${entry.content}\n\n`;
                } else if (entry.role === 'assistant') {
                    fullPrompt += `Assistant: ${entry.content}\n\n`;
                }
            });
        }

        fullPrompt += `User: ${message}\n\nAssistant:`;

        // Try different models in order of preference
        // Some API keys may have access to different models
        const modelNames = [
            'gemini-1.5-flash-002',
            'gemini-1.5-flash-001',
            'gemini-1.5-pro-002',
            'gemini-1.5-pro-001',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-2.0-flash',
        ];

        let text: string = '';
        let lastError: any = null;

        // Try each model until one works
        for (const modelName of modelNames) {
            try {
                const model = googleAI(modelName);
                const result = await generateText({
                    model,
                    prompt: fullPrompt,
                    temperature: 0.7,
                });
                text = result.text;
                console.log(`Successfully used model: ${modelName}`);
                break; // Success, exit loop
            } catch (error: any) {
                console.log(`Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models failed, throw the last error
        if (!text && lastError) {
            throw new Error(`All models failed. Last error: ${lastError.message}. Available models: ${modelNames.join(', ')}`);
        }

        // Extract selection from response - look for pattern at end or anywhere in response
        let selection = null;
        const selectionMatch = text.match(/SELECTION:\s*(NFT[12])/i);
        if (selectionMatch) {
            selection = selectionMatch[1].toUpperCase();
        } else {
            // Fallback: check for any mention of NFT1 or NFT2 at the end
            const trimmedText = text.trim().toUpperCase();
            if (trimmedText.endsWith('NFT1') || trimmedText.includes('SELECTION: NFT1')) {
                selection = 'NFT1';
            } else if (trimmedText.endsWith('NFT2') || trimmedText.includes('SELECTION: NFT2')) {
                selection = 'NFT2';
            }
        }

        return NextResponse.json({
            text,
            selection,
        });
    } catch (error: any) {
        console.error('Error calling Gemini API:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process chat request' },
            { status: 500 }
        );
    }
}

