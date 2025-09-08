'use server';

import { assistWithPIIMaskingRules } from '@/ai/flows/assist-with-pii-masking-rules';
import { generateSummaryReport } from '@/ai/flows/generate-summary-report';
import type { PiiEntity, ProcessingResult, MaskingRule } from '@/lib/types';

// Mock function to simulate NER
function mockNerDetection(text: string): PiiEntity[] {
  const entities: PiiEntity[] = [];
  const patterns = {
    PERSON: /\b([A-Z][a-z'’.-]+)\s([A-Z][a-z'’.-]+)\b/gi, // Case-insensitive
    EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    PHONE_NUMBER: /\b\d{3}-\d{3}-\d{4}\b/g,
  };

  let match;
  for (const [type, regex] of Object.entries(patterns)) {
    while ((match = regex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: type as PiiEntity['type'],
        start: match.index,
        end: match.index + match[0].length,
        score: Math.random() * (0.99 - 0.85) + 0.85, // random score between 0.85 and 0.99
        context: text.substring(Math.max(0, match.index - 30), Math.min(text.length, match.index + match[0].length + 30))
      });
    }
  }
  return entities;
}

// Mock proximity and graph analysis results
function mockAnalysis(entities: PiiEntity[]) {
    const proximityAnalysisResults = {
        highRiskPairs: entities.length > 1 ? [[entities[0].text, entities[1].text]] : [],
        summary: entities.length > 1 ? "High risk correlation found between names and other PII." : "No significant proximity risks detected."
    };
    const graphAnalysisResults = {
        clusters: entities.length > 2 ? [[entities[0].text, entities[1].text, entities[2].text]] : [],
        centrality: entities.reduce((acc, entity) => {
            acc[entity.text] = Math.random();
            return acc;
        }, {} as Record<string, number>),
        summary: entities.length > 0 ? "The graph shows a dense cluster around a person's name, indicating a high re-identification risk." : "No complex relationships found in the data."
    };
    return { proximityAnalysisResults, graphAnalysisResults };
}

export async function processCsvFile(fileContent: string): Promise<ProcessingResult> {
  try {
    const nerResults = mockNerDetection(fileContent);
    const { proximityAnalysisResults, graphAnalysisResults } = mockAnalysis(nerResults);

    // Prepare input for AI flows
    const summaryInput = {
      nerResults: JSON.stringify(nerResults.map(e => ({ type: e.type, value: e.text }))),
      proximityAnalysisResults: JSON.stringify(proximityAnalysisResults),
      graphAnalysisResults: JSON.stringify(graphAnalysisResults),
    };

    const summaryResponse = await generateSummaryReport(summaryInput);
    
    let maskingRules: MaskingRule[] = [];
    if (nerResults.length > 0) {
        const maskingInput = {
          piiEntities: nerResults.map(e => ({ type: e.type, value: e.text, context: e.context })),
          desiredLevelOfObfuscation: 'medium' as const,
        };
        const maskingResponse = await assistWithPIIMaskingRules(maskingInput);
        maskingRules = maskingResponse.maskingRules as MaskingRule[];
    }
    
    return {
      originalData: fileContent,
      nerResults,
      summaryReport: summaryResponse,
      maskingRules
    };
  } catch (error) {
    console.error("Error processing file:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred during PII analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred during PII analysis.");
  }
}
