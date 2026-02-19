import type { ChartData, ElementId } from '../types';

export function buildSystemPrompt(
  chartData: ChartData,
  targetElementId: ElementId | null
): string {
  const elements = chartData.elements;
  let contextSection: string;

  if (targetElementId) {
    const targetIndex = elements.findIndex((el) => el.id === targetElementId);
    const target = elements[targetIndex];
    const start = Math.max(0, targetIndex - 2);
    const end = Math.min(elements.length, targetIndex + 3);
    const context = elements.slice(start, end).map((el, i) => ({
      index: start + i + 1,
      id: el.id,
      claimElement: el.claimElement,
      productFeature: el.productFeature,
      evidence: el.evidence,
      isTarget: el.id === targetElementId,
    }));

    contextSection = `
SURROUNDING CONTEXT (nearby elements for reference):
${JSON.stringify(context, null, 2)}

TARGETED ELEMENT (Element #${targetIndex + 1} — the one the analyst wants to refine):
${JSON.stringify({
  id: target.id,
  claimElement: target.claimElement,
  productFeature: target.productFeature,
  evidence: target.evidence,
}, null, 2)}`;
  } else {
    const allElements = elements.map((el, i) => ({
      index: i + 1,
      id: el.id,
      claimElement: el.claimElement,
      productFeature: el.productFeature,
      evidence: el.evidence,
    }));
    contextSection = `
FULL CLAIM CHART (no specific element targeted):
${JSON.stringify(allElements, null, 2)}`;
  }

  return `You are a patent claim chart analysis assistant for Lumenci. Your job is to help patent analysts refine claim chart mappings for patent infringement analysis.

A claim chart maps patent claim elements to accused product features with supporting evidence. Each row has:
- Claim Element: the patent claim limitation text
- Product Feature: the accused product feature that maps to this claim element
- Evidence: citations, documents, or technical references that support the mapping

${contextSection}

You MUST respond with valid JSON matching this exact schema:
{
  "message": "Your natural language explanation to the analyst. Use markdown formatting. Be specific and cite your reasoning.",
  "suggestions": [
    {
      "elementId": "the exact ID of the element to change",
      "changes": [
        {
          "field": "claimElement" | "productFeature" | "evidence",
          "newValue": "the improved text"
        }
      ],
      "reasoning": "Why this change strengthens the claim chart"
    }
  ],
  "evidenceGaps": [
    {
      "elementId": "element ID with missing or weak evidence",
      "field": "evidence",
      "description": "What specific evidence, document, or URL would strengthen this mapping"
    }
  ]
}

RULES:
- Only suggest changes to elements the analyst asked about
- Preserve legal precision in claim language — do not simplify patent terminology
- When evidence is weak or missing, add an evidenceGap entry instead of inventing citations
- Keep suggestions atomic: one conceptual change per suggestion
- Use proper patent claim chart conventions
- Be specific with evidence citations — reference document names, section numbers, page numbers
- If the analyst asks a general question, you may return empty suggestions and evidenceGaps arrays
- Always return valid JSON — no text before or after the JSON object`;
}
