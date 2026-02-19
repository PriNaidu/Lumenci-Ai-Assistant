import type { ChartData, ChatMessage, ElementId, AIResponse } from '../types';
import { buildSystemPrompt } from '../lib/prompts';
import { AI_MODEL, AI_TEMPERATURE, MAX_HISTORY_MESSAGES } from '../lib/constants';

export async function sendChatMessage(
  userMessage: string,
  chartData: ChartData,
  targetElementId: ElementId | null,
  messageHistory: ChatMessage[]
): Promise<AIResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // Use mock AI if no API key is configured
  if (!apiKey) {
    return getMockResponse(userMessage, chartData, targetElementId);
  }

  const systemPrompt = buildSystemPrompt(chartData, targetElementId);

  const conversationHistory = messageHistory
    .filter((m) => m.role !== 'system')
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
        temperature: AI_TEMPERATURE,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from AI.');
  }

  return parseAIResponse(content);
}

function parseAIResponse(raw: string): AIResponse {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
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

// ─── Mock AI for demo/testing without an API key ────────────────────────

async function getMockResponse(
  userMessage: string,
  chartData: ChartData,
  targetElementId: ElementId | null
): Promise<AIResponse> {
  await new Promise((r) => setTimeout(r, 1500));

  const msg = userMessage.toLowerCase();
  const target = targetElementId
    ? chartData.elements.find((el) => el.id === targetElementId)
    : null;

  if (!target) {
    const gaps = chartData.elements
      .filter((el) => !el.evidence || el.evidence.trim() === '')
      .map((el) => ({
        elementId: el.id,
        field: 'evidence' as const,
        description: `This element is missing evidence. Please provide a technical document, patent reference, or URL that supports the mapping between "${el.claimElement.slice(0, 50)}..." and the accused product feature.`,
      }));

    return {
      message:
        gaps.length > 0
          ? `I've reviewed your claim chart with **${chartData.elements.length} elements**. I found **${gaps.length} element(s)** with missing or weak evidence that need attention.\n\nPlease select a specific element to get targeted refinement suggestions, or provide documentation to fill the evidence gaps I've flagged.`
          : `I've reviewed your claim chart with **${chartData.elements.length} elements**. The chart looks well-structured overall. Select a specific element and tell me how you'd like to refine it — for example:\n\n- "Strengthen the evidence"\n- "Make the claim language more precise"\n- "Improve the product feature mapping"`,
      suggestions: [],
      evidenceGaps: gaps,
    };
  }

  if (msg.includes('strengthen') || msg.includes('evidence') || msg.includes('improve')) {
    if (!target.evidence || target.evidence.trim() === '') {
      return {
        message: `Element **"${target.claimElement.slice(0, 60)}..."** currently has **no evidence**. I cannot strengthen what doesn't exist yet.\n\nTo proceed, please provide one of the following:\n- A technical document or specification\n- A patent reference\n- A URL to product documentation\n- A teardown report or analysis`,
        suggestions: [],
        evidenceGaps: [
          {
            elementId: target.id,
            field: 'evidence',
            description:
              'No evidence exists for this element. Provide a technical document, specification, or product documentation URL to support the infringement mapping.',
          },
        ],
      };
    }

    return {
      message: `I've analyzed the evidence for this element and suggest strengthening it with more specific technical citations. The current evidence references the right sources but could be more precise about **which sections** and **what specific disclosures** support the infringement mapping.`,
      suggestions: [
        {
          elementId: target.id,
          changes: [
            {
              field: 'evidence',
              newValue: `${target.evidence}; See specifically Section 4.2.1 (Architecture Overview) which discloses the implementation details matching the claimed functionality. Cross-reference with technical whitepaper "System Architecture and Design Specification" (Rev. 3, 2024), pp. 12-18.`,
            },
          ],
          reasoning:
            'Adding specific section references and cross-references to supporting documents strengthens the evidentiary basis for this claim mapping and makes it more defensible in litigation.',
        },
      ],
      evidenceGaps: [],
    };
  }

  if (msg.includes('fix') || msg.includes('clarify') || msg.includes('precise') || msg.includes('language')) {
    return {
      message: `I've reviewed the claim element language and suggest making it more precise to better align with standard patent claim construction conventions. The revised language uses proper antecedent basis and clearer functional relationships.`,
      suggestions: [
        {
          elementId: target.id,
          changes: [
            {
              field: 'claimElement',
              newValue: `${target.claimElement.replace(/;$/, '')} in accordance with predetermined parameters;`,
            },
          ],
          reasoning:
            'Adding "in accordance with predetermined parameters" provides clearer claim scope and better maps to the product feature by specifying the configurable nature of the implementation.',
        },
      ],
      evidenceGaps: [],
    };
  }

  if (msg.includes('mapping') || msg.includes('product') || msg.includes('feature') || msg.includes('map')) {
    return {
      message: `I've analyzed the product feature mapping for this element. The current mapping could be more specific about **how** the accused product implements the claimed functionality. A more detailed mapping will strengthen the infringement argument.`,
      suggestions: [
        {
          elementId: target.id,
          changes: [
            {
              field: 'productFeature',
              newValue: `${target.productFeature}. Specifically, the accused product implements this through its ${target.productFeature.split(' ')[0]} module, which performs the claimed operation during runtime processing.`,
            },
          ],
          reasoning:
            'A more specific product feature description that identifies the exact module and runtime behavior strengthens the element-by-element infringement analysis.',
        },
      ],
      evidenceGaps: [],
    };
  }

  return {
    message: `I've analyzed **Element "${target.claimElement.slice(0, 50)}..."** and found an opportunity to improve the overall mapping.\n\nThe product feature description could be more specific, and the evidence could benefit from additional technical references. Here's my suggestion:`,
    suggestions: [
      {
        elementId: target.id,
        changes: [
          {
            field: 'productFeature',
            newValue: `${target.productFeature} — as implemented in the product's core processing pipeline, performing the claimed functionality through dedicated hardware/software integration`,
          },
        ],
        reasoning:
          'Adding implementation details to the product feature mapping creates a clearer nexus between the patent claim and the accused product, strengthening the infringement position.',
      },
    ],
    evidenceGaps: target.evidence
      ? []
      : [
          {
            elementId: target.id,
            field: 'evidence',
            description:
              'This element lacks supporting evidence. Please provide technical documentation, product specifications, or teardown analysis.',
          },
        ],
  };
}
