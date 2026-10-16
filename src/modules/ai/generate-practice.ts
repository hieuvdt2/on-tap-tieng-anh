import { generateTopicQuestions } from "./generator";

export async function generatePublishedQuestions(
  topicId: string,
  count: number,
  createdBy: string,
  difficulty?: "easy" | "medium" | "hard",
) {
  try {
    return await generateTopicQuestions(topicId, count, createdBy, difficulty);
  } catch {
    return [];
  }
}
