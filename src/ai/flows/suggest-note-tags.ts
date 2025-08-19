'use server';

/**
 * @fileOverview A note tag suggestion AI agent.
 *
 * - suggestNoteTags - A function that suggests relevant tags for a note based on its content.
 * - SuggestNoteTagsInput - The input type for the suggestNoteTags function.
 * - SuggestNoteTagsOutput - The return type for the suggestNoteTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNoteTagsInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The content of the note for which tags are to be suggested.'),
});
export type SuggestNoteTagsInput = z.infer<typeof SuggestNoteTagsInputSchema>;

const SuggestNoteTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the note content.'),
});
export type SuggestNoteTagsOutput = z.infer<typeof SuggestNoteTagsOutputSchema>;

export async function suggestNoteTags(input: SuggestNoteTagsInput): Promise<SuggestNoteTagsOutput> {
  return suggestNoteTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNoteTagsPrompt',
  input: {schema: SuggestNoteTagsInputSchema},
  output: {schema: SuggestNoteTagsOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant tags for notes based on their content.

  Given the following note content, suggest a list of tags that would be helpful for organizing and categorizing the note.

  Note Content: {{{noteContent}}}

  Please provide only the array of tags in the output.`,
});

const suggestNoteTagsFlow = ai.defineFlow(
  {
    name: 'suggestNoteTagsFlow',
    inputSchema: SuggestNoteTagsInputSchema,
    outputSchema: SuggestNoteTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
