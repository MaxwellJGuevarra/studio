
export interface PiiEntity {
  text: string;
  type: 'PERSON' | 'EMAIL' | 'PHONE_NUMBER' | 'ADDRESS' | 'ORGANIZATION' | 'CREDIT_CARD' | 'SSN' | 'OTHER';
  start: number;
  end: number;
  score: number;
  context: string;
}

export interface MaskingRule {
  entityType: string;
  maskingTechnique: string;
  parameters: Record<string, any>;
  justification: string;
}

export interface ProcessingResult {
  originalData: string;
  nerResults: PiiEntity[];
  summaryReport: any; // JSON object from the AI flow
  maskingRules: MaskingRule[];
}
