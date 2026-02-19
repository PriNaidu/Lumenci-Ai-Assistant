import type { ChartData, ChatMessage, ElementId, AIResponse } from '../types';
import { buildSystemPrompt } from '../lib/prompts';
import { AI_MODEL, AI_TEMPERATURE, MAX_HISTORY_MESSAGES } from '../lib/constants';

export async function sendChatMessage(
  userMessage: string,
  chartData: ChartData,
  targetElementId: ElementId | null,
  messageHistory: ChatMessage[]
): Promise<AIResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env.local file.'
    );
  }

  const systemPrompt = buildSystemPrompt(chartData, targetElementId);

  const conversationHistory = messageHistory
    .filter((m) => m.role !== 'system')
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 4096,
      temperature: AI_TEMPERATURE,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from AI.');
  }

  return parseAIResponse(content);
}

function parseAIResponse(raw: string): AIResponse {
  // Extract JSON from the response (in case there's extra text)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // If no JSON found, treat the whole thing as a message
    return {
      message: raw,
      suggestions: [],
      evidenceGaps: [],
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      message: parsed.message ?? raw,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      evidenceGaps: Array.isArray(parsed.evidenceGaps) ? parsed.evidenceGaps : [],
    };
  } catch {
    return {
      message: raw,
      suggestions: [],
      evidenceGaps: [],
    };
  }
}
