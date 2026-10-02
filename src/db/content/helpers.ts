import type { QuestionSeed } from "./types";

const letters = ["a", "b", "c", "d"] as const;
type Letter = (typeof letters)[number];

export function mcq(input: {
  id: string;
  difficulty: QuestionSeed["difficulty"];
  stem: string;
  choices: Record<Letter, string>;
  answer: Letter;
  explanation: string;
  whyWrong: Partial<Record<Letter, string>>;
}): QuestionSeed {
  const wrongAnswerExplanations = letters
    .filter((letter) => letter !== input.answer)
    .map((letter) => {
      const explanation = input.whyWrong[letter];
      if (!explanation) {
        throw new Error(`Thiếu giải thích phương án ${letter} của ${input.id}`);
      }
      return { optionId: letter, explanation };
    });

  return {
    id: input.id,
    difficulty: input.difficulty,
    stem: input.stem,
    options: letters.map((letter) => ({
      id: letter,
      text: input.choices[letter],
    })),
    correctAnswer: input.answer,
    explanation: input.explanation,
    wrongAnswerExplanations,
  };
}
