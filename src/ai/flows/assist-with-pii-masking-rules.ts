'use server';
/**
 * @fileOverview This file defines a Genkit flow to assist users with PII masking rules.
 *
 * - assistWithPIIMaskingRules - A function that suggests masking rules based on identified PII and its context.
 * - AssistWithPIIMaskingRulesInput - The input type for the assistWithPIIMaskingRules function.
 * - AssistWithPIIMaskingRulesOutput - The return type for the assistWithPIIMaskingRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistWithPIIMaskingRulesInputSchema = z.object({
  piiEntities: z.array(
    z.object({
      type: z.string().describe('The type of PII entity (e.g., name, email, phone number).'),
      value: z.string().describe('The actual PII value detected.'),
      context: z.string().describe('The surrounding text context of the PII entity.'),
    })
  ).describe('A list of detected PII entities with their types, values, and context.'),
  desiredLevelOfObfuscation: z.enum(['low', 'medium', 'high']).default('medium').describe('The desired level of obfuscation (low, medium, high).'),
});
export type AssistWithPIIMaskingRulesInput = z.infer<typeof AssistWithPIIMaskingRulesInputSchema>;

const AssistWithPIIMaskingRulesOutputSchema = z.object({
  maskingRules: z.array(
    z.object({
      entityType: z.string().describe('The type of PII entity the rule applies to.'),
      maskingTechnique: z.string().describe('The suggested masking technique (e.g., redaction, substitution, tokenization).'),
      parameters: z.record(z.string(), z.any()).optional().describe('Parameters for the masking technique (e.g., replacement character, tokenization algorithm). Can be an empty object.'),
      justification: z.string().describe('Explanation of why this rule is appropriate for this entity type and context.'),
    })
  ).describe('A list of suggested PII masking rules.'),
});
export type AssistWithPIIMaskingRulesOutput = z.infer<typeof AssistWithPIIMaskingRulesOutputSchema>;

export async function assistWithPIIMaskingRules(input: AssistWithPIIMaskingRulesInput): Promise<AssistWithPIIMaskingRulesOutput> {
  return assistWithPIIMaskingRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistWithPIIMaskingRulesPrompt',
  input: {schema: AssistWithPIIMaskingRulesInputSchema},
  output: {schema: AssistWithPIIMaskingRulesOutputSchema},
  prompt: `You are an expert data security engineer specializing in PII masking.

  Based on the identified PII entities, their context, and the desired level of obfuscation, suggest appropriate masking rules.

  Consider the following masking techniques:
  - Redaction: Removing the PII value completely.
  - Substitution: Replacing the PII value with a generic value (e.g., "[NAME]").
  - Tokenization: Replacing the PII value with a random, irreversible token.
  - Pseudonymization: Replacing the PII value with a consistent, reversible pseudonym.

  For each PII entity, provide a masking rule with the following properties:
  - entityType: The type of PII entity the rule applies to.
  - maskingTechnique: The suggested masking technique.
  - parameters: Parameters for the masking technique.
  - justification: Explanation of why this rule is appropriate for this entity type and context.

  The desired level of obfuscation is: {{{desiredLevelOfObfuscation}}}

  Here are the PII entities:
  {{#each piiEntities}}
  - Type: {{{type}}}, Value: {{{value}}}, Context: {{{context}}}
  {{/each}}
  
  Format your response as a JSON object conforming to the AssistWithPIIMaskingRulesOutputSchema schema.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const assistWithPIIMaskingRulesFlow = ai.defineFlow(
  {
    name: 'assistWithPIIMaskingRulesFlow',
    inputSchema: AssistWithPIIMaskingRulesInputSchema,
    outputSchema: AssistWithPIIMaskingRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
