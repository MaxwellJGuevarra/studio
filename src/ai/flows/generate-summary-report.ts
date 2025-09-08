'use server';

/**
 * @fileOverview A flow to generate a summary report of PII detections, highlighting key risk areas and providing actionable insights based on the proximity and graph analysis.
 *
 * - generateSummaryReport - A function that handles the generation of the summary report.
 * - GenerateSummaryReportInput - The input type for the generateSummaryReport function.
 * - GenerateSummaryReportOutput - The return type for the generateSummaryReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryReportInputSchema = z.object({
  nerResults: z.string().describe('The JSON string of NER results. Can be an empty array.'),
  proximityAnalysisResults: z.string().describe('The JSON string of proximity analysis results.'),
  graphAnalysisResults: z.string().describe('The JSON string of graph analysis results.'),
});
export type GenerateSummaryReportInput = z.infer<typeof GenerateSummaryReportInputSchema>;

const GenerateSummaryReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the PII detections. If no PII is found, state that.'),
  riskLevel: z.enum(['low', 'medium', 'high', 'none']).describe('The overall risk level. "none" if no PII is detected.'),
  keyFindings: z.array(z.string()).describe('A list of key findings and actionable insights. Can be empty.'),
});
export type GenerateSummaryReportOutput = z.infer<typeof GenerateSummaryReportOutputSchema>;

export async function generateSummaryReport(input: GenerateSummaryReportInput): Promise<GenerateSummaryReportOutput> {
  // If nerResults is an empty array string, return a default report
  if (input.nerResults === '[]') {
    return {
      summary: 'No PII entities were detected in the provided data.',
      riskLevel: 'none',
      keyFindings: [],
    };
  }
  return generateSummaryReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryReportPrompt',
  input: {schema: GenerateSummaryReportInputSchema},
  output: {schema: GenerateSummaryReportOutputSchema},
  prompt: `You are a security expert. You will generate a concise summary report based on the following information.

NER Results: {{{nerResults}}}
Proximity Analysis Results: {{{proximityAnalysisResults}}}
Graph Analysis Results: {{{graphAnalysisResults}}}

Your response must be a JSON object that conforms to the GenerateSummaryReportOutputSchema.
Highlight key risk areas and provide actionable insights in the keyFindings array. If NER Results are empty, your summary should state that no PII was found, the risk level is "none", and key findings should be an empty array.`,
});

const generateSummaryReportFlow = ai.defineFlow(
  {
    name: 'generateSummaryReportFlow',
    inputSchema: GenerateSummaryReportInputSchema,
    outputSchema: GenerateSummaryReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
