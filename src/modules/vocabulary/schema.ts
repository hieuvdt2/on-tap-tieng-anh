import { z } from "zod";

export const generatedVocabularySchema = z.object({
  words: z.array(z.object({
    word: z.string().min(1),
    wordClass: z.string().min(1).max(20),
    ipa: z.string().max(60).nullish(),
    meaningVi: z.string().min(1),
    example: z.string().min(1),
    note: z.string().max(200).nullish(),
  })).min(1),
});
