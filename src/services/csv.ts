import Papa from 'papaparse';
import type { ChartData, ClaimElement } from '../types';
import { generateId } from '../lib/utils';

const HEADER_ALIASES: Record<string, string> = {
  'claim element': 'claimElement',
  'claim limitation': 'claimElement',
  'claim': 'claimElement',
  'limitation': 'claimElement',
  'product feature': 'productFeature',
  'accused feature': 'productFeature',
  'product': 'productFeature',
  'feature': 'productFeature',
  'evidence': 'evidence',
  'citation': 'evidence',
  'proof': 'evidence',
  'source': 'evidence',
};

function normalizeHeader(header: string): string | null {
  const normalized = header.trim().toLowerCase();
  return HEADER_ALIASES[normalized] ?? null;
}

interface ParseResult {
  data: ChartData;
  warnings: string[];
}

export async function parseCSV(
  input: string | File,
  title?: string
): Promise<ParseResult> {
  let text: string;
  if (input instanceof File) {
    text = await input.text();
  } else {
    text = input;
  }

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = processResults(results, title);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      },
    });
  });
}

function processResults(
  results: Papa.ParseResult<Record<string, string>>,
  title?: string
): ParseResult {
  const warnings: string[] = [];

  if (!results.data || results.data.length === 0) {
    throw new Error('No data found in CSV. Please check your file format.');
  }

  const headers = results.meta.fields ?? [];
  if (headers.length < 3) {
    throw new Error(
      `Expected 3 columns (Claim Element, Product Feature, Evidence) but found ${headers.length}.`
    );
  }

  const fieldMap: Record<string, string> = {};
  const mappedFields = new Set<string>();

  for (const header of headers) {
    const mapped = normalizeHeader(header);
    if (mapped && !mappedFields.has(mapped)) {
      fieldMap[header] = mapped;
      mappedFields.add(mapped);
    }
  }

  // If headers weren't recognized, assume column order
  if (mappedFields.size < 3) {
    fieldMap[headers[0]] = 'claimElement';
    fieldMap[headers[1]] = 'productFeature';
    fieldMap[headers[2]] = 'evidence';
    warnings.push(
      'Column headers not recognized. Assuming order: Claim Element, Product Feature, Evidence.'
    );
  }

  const elements: ClaimElement[] = [];

  for (let i = 0; i < results.data.length; i++) {
    const row = results.data[i];
    const element: ClaimElement = {
      id: generateId(),
      claimElement: '',
      productFeature: '',
      evidence: '',
    };

    for (const [csvHeader, fieldKey] of Object.entries(fieldMap)) {
      if (fieldKey === 'claimElement' || fieldKey === 'productFeature' || fieldKey === 'evidence') {
        element[fieldKey] = (row[csvHeader] ?? '').trim();
      }
    }

    // Skip completely empty rows
    if (!element.claimElement && !element.productFeature && !element.evidence) {
      continue;
    }

    if (!element.evidence) {
      warnings.push(`Row ${i + 1} has empty evidence.`);
    }

    elements.push(element);
  }

  if (elements.length === 0) {
    throw new Error('No valid rows found in CSV after parsing.');
  }

  return {
    data: {
      title: title ?? 'Untitled Claim Chart',
      elements,
    },
    warnings,
  };
}
