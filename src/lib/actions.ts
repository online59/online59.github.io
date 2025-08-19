"use server";

import { suggestNoteTags } from "@/ai/flows/suggest-note-tags";
import type { SuggestNoteTagsInput } from "@/ai/flows/suggest-note-tags";
import { analyzeStock } from "@/ai/flows/analyze-stock-flow";
import type { AnalyzeStockInput, AnalyzeStockOutput } from "@/ai/flows/analyze-stock-flow";


export async function getTagSuggestions(input: SuggestNoteTagsInput): Promise<string[]> {
  try {
    const result = await suggestNoteTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error suggesting tags:", error);
    // Return an empty array or throw a custom error to be handled by the client
    return [];
  }
}


export async function getStockAnalysis(input: AnalyzeStockInput): Promise<AnalyzeStockOutput> {
  return analyzeStock(input);
}
