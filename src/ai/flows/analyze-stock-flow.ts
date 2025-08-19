'use server';
/**
 * @fileOverview A stock analysis AI agent.
 *
 * - analyzeStock - A function that analyzes a stock based on user inputs and real-time data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeStockInputSchema, AnalyzeStockOutputSchema, type AnalyzeStockInput, type AnalyzeStockOutput } from './analyze-stock-flow-types';

// Mock functions for tools. In a real scenario, you'd use an API for this.
async function fetchStockPrice(ticker: string): Promise<number> {
  console.log(`Fetching price for ${ticker}`);
  // This is a mock. A real implementation would call a financial data API.
  const prices: {[key: string]: number} = {
    'GOOGL': 178.54,
    'AAPL': 214.29,
    'MSFT': 447.67,
    'TSLA': 182.58
  }
  return prices[ticker] || Math.random() * 1000;
}

async function fetchStockNews(ticker: string): Promise<string[]> {
    console.log(`Fetching news for ${ticker}`);
    // This is a mock. A real implementation would use a news API.
    const news: {[key: string]: string[]} = {
        'GOOGL': ["Google announces new AI advancements at I/O.", "Alphabet's Q2 earnings exceed expectations."],
        'AAPL': ["Apple unveils new iPhone model with advanced camera.", "Analysts raise price target for Apple ahead of WWDC."],
        'MSFT': ["Microsoft closes deal to acquire gaming studio.", "Microsoft Azure reports strong growth in cloud services."],
        'TSLA': ["Tesla announces record delivery numbers.", "New Cybertruck review is mostly positive."]
    };
    return news[ticker] || ["No recent news found for this ticker."];
}


const getStockPriceTool = ai.defineTool(
  {
    name: 'getStockPrice',
    description: 'Returns the current market price of a stock.',
    inputSchema: z.object({
      ticker: z.string().describe('The stock ticker symbol, e.g., GOOGL.'),
    }),
    outputSchema: z.number(),
  },
  async (input) => await fetchStockPrice(input.ticker)
);

const getStockNewsTool = ai.defineTool(
  {
    name: 'getStockNews',
    description: 'Returns recent news headlines for a given stock.',
    inputSchema: z.object({
      ticker: z.string().describe('The stock ticker symbol, e.g., GOOGL.'),
    }),
    outputSchema: z.array(z.string()),
  },
  async (input) => await fetchStockNews(input.ticker)
);

const prompt = ai.definePrompt({
    name: 'stockAnalysisPrompt',
    input: { schema: AnalyzeStockInputSchema },
    output: { schema: AnalyzeStockOutputSchema },
    tools: [getStockPriceTool, getStockNewsTool],
    prompt: `You are a financial analyst AI. Your task is to provide a brief, insightful analysis of a stock for a retail investor.

The user has provided the following information from their own Discounted Cash Flow (DCF) calculation:
- Stock Ticker: {{{ticker}}}
- Current EPS: {{{eps}}}
- Projected 5-Year Growth Rate: {{{growthRate}}}%
- Calculated Intrinsic Value: \${{{intrinsicValue}}}

Use the available tools to fetch the current stock price and recent news headlines.

Based on all this information, provide a concise analysis covering the following points in a professional, easy-to-read format:

1.  **Valuation Comparison:** Compare the user's calculated intrinsic value with the current market price. Is the stock potentially undervalued, overvalued, or fairly valued according to this model?

2.  **Growth Rate Reality Check:** Comment on the user's projected growth rate. Is it realistic, optimistic, or pessimistic given the company's situation and recent news?

3.  **Recent News Context:** Briefly mention how the latest news might impact the stock's future.

4.  **Overall Summary:** Provide a concluding sentence that summarizes the findings.

**IMPORTANT:**
- Be neutral and objective. Do not give direct financial advice to buy or sell.
- Present the output as a single block of text, using markdown for formatting (like bolding and lists if needed).
- Always use the tools to get the current price and news to ensure your analysis is timely.`,
});


const analyzeStockFlow = ai.defineFlow(
  {
    name: 'analyzeStockFlow',
    inputSchema: AnalyzeStockInputSchema,
    outputSchema: AnalyzeStockOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function analyzeStock(input: AnalyzeStockInput): Promise<AnalyzeStockOutput> {
  return analyzeStockFlow(input);
}
