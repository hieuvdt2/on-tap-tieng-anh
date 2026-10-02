import { generateTopicQuestions } from "./generator";

export async function generatePublishedQuestions(topicId: string, count: number) {
  try {
    return await generateTopicQuestions(topicId, count);
  } catch {
    return [];
  }
}
