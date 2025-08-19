/**
 * @fileOverview Type definitions for the stock analysis AI agent.
 *
 * - AnalyzeStockInputSchema - The Zod schema for the input to the analyzeStock function.
 * - AnalyzeStockInput - The TypeScript type for the input to the analyzeStock function.
 * - AnalyzeStockOutputSchema - The Zod schema for the output of the analyzeStock function.
 * - AnalyzeStockOutput - The TypeScript type for the output of the analyzeStock function.
 */

import {z} from 'zod';

export const AnalyzeStockInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
  eps: z.string().describe('The current Earnings Per Share (EPS) of the company.'),
  growthRate: z.string().describe('The user-projected annual growth rate for the next 5 years.'),
  intrinsicValue: z.string().describe('The intrinsic value calculated by the user\'s DCF model.'),
});
export type AnalyzeStockInput = z.infer<typeof AnalyzeStockInputSchema>;

export const AnalyzeStockOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the stock.'),
});
export type AnalyzeStockOutput = z.infer<typeof AnalyzeStockOutputSchema>;
