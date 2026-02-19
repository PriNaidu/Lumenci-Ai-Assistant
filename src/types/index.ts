export type ElementId = string;

export interface ClaimElement {
  id: ElementId;
  claimElement: string;
  productFeature: string;
  evidence: string;
}

export interface ChartData {
  title: string;
  elements: ClaimElement[];
}

export interface ChartSnapshot {
  elements: ClaimElement[];
  description: string;
  timestamp: number;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  suggestionId?: string;
  relatedElementIds?: ElementId[];
}

export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';
export type FieldKey = 'claimElement' | 'productFeature' | 'evidence';

export interface FieldChange {
  field: FieldKey;
  oldValue: string;
  newValue: string;
}

export interface AISuggestion {
  id: string;
  elementId: ElementId;
  changes: FieldChange[];
  reasoning: string;
  status: SuggestionStatus;
  timestamp: number;
}

export interface EvidenceGap {
  id: string;
  elementId: ElementId;
  field: FieldKey;
  description: string;
  resolved: boolean;
}

export interface AIResponse {
  message: string;
  suggestions: Array<{
    elementId: ElementId;
    changes: Array<{
      field: FieldKey;
      newValue: string;
    }>;
    reasoning: string;
  }>;
  evidenceGaps: Array<{
    elementId: ElementId;
    field: FieldKey;
    description: string;
  }>;
}
