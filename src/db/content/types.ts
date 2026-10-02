export type Difficulty = "easy" | "medium" | "hard";

export type QuestionSeed = {
  id: string;
  difficulty: Difficulty;
  stem: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  wrongAnswerExplanations: { optionId: string; explanation: string }[];
};

export type TopicSeed = {
  id: string;
  slug: string;
  name: string;
  gradeFrom: number;
  gradeTo: number;
  summary: string;
  purpose: string;
  usage: string;
  structure: string;
  affirmativePattern: string;
  negativePattern: string;
  questionPattern: string;
  signalWords: string[];
  examples: { sentence: string; note: string }[];
  commonMistakes: { wrong: string; right: string; why: string }[];
  comparisons: { with: string; note: string }[];
  prerequisiteSlugs: string[];
  questions: QuestionSeed[];
};

export type VocabularyItem = {
  word: string;
  meaningVi: string;
  wordClass: string;
  example: string;
  note: string;
};

export type VocabularyCollocation = {
  phrase: string;
  meaningVi: string;
  example: string;
};

export type VocabularyTopicSeed = {
  skill: "vocabulary";
  id: string;
  slug: string;
  name: string;
  gradeFrom: number;
  gradeTo: number;
  summary: string;
  overview: string;
  items: VocabularyItem[];
  collocations: VocabularyCollocation[];
  commonMistakes: { wrong: string; right: string; why: string }[];
  prerequisiteSlugs: string[];
  questions: QuestionSeed[];
};

export type CurriculumTopic = TopicSeed | VocabularyTopicSeed;

export function isVocabularyTopic(topic: CurriculumTopic): topic is VocabularyTopicSeed {
  return "skill" in topic && topic.skill === "vocabulary";
}
