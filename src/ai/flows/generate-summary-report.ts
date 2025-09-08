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
  nerResults: z.string().describe('The JSON string of NER results.'),
  proximityAnalysisResults: z.string().describe('The JSON string of proximity analysis results.'),
  graphAnalysisResults: z.string().describe('The JSON string of graph analysis results.'),
});
export type GenerateSummaryReportInput = z.infer<typeof GenerateSummaryReportInputSchema>;

const GenerateSummaryReportOutputSchema = z.object({
  report: z.string().describe('The summary report in JSON format.'),
});
export type GenerateSummaryReportOutput = z.infer<typeof GenerateSummaryReportOutputSchema>;

export async function generateSummaryReport(input: GenerateSummaryReportInput): Promise<GenerateSummaryReportOutput> {
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

Highlight key risk areas and provide actionable insights. Return the report in JSON format.`,
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
