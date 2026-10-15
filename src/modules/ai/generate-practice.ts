import { generateTopicQuestions } from "./generator";

export async function generatePublishedQuestions(topicId: string, count: number, createdBy: string) {
  try {
    return await generateTopicQuestions(topicId, count, createdBy);
  } catch {
    return [];
  }
}
