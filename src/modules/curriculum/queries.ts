import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { examSpecifications, grammarTopics, topics, vocabularyTopics } from "@/db/schema";
import { getTopicProgress } from "@/modules/learning/profile";

export async function getExamNote() {
  const rows = await db
    .select({ notes: examSpecifications.notes })
    .from(examSpecifications)
    .limit(1);
  return rows[0]?.notes ?? "";
}

export async function getLesson(slug: string, userId: string) {
  const topicRows = await db.select().from(topics).where(eq(topics.slug, slug)).limit(1);
  const topic = topicRows[0];
  if (!topic) return null;

  const progressList = await getTopicProgress(userId);
  const progress = progressList.find((item) => item.slug === slug) ?? null;
  const linkPrerequisites = (slugs: string[]) =>
    slugs.flatMap((prerequisiteSlug) => {
      const match = progressList.find((item) => item.slug === prerequisiteSlug);
      return match ? [{ slug: match.slug, name: match.name }] : [];
    });

  if (topic.skill === "vocabulary") {
    const vocabularyRows = await db
      .select()
      .from(vocabularyTopics)
      .where(eq(vocabularyTopics.topicId, topic.id))
      .limit(1);
    const vocabulary = vocabularyRows[0];
    if (!vocabulary) return null;
    return {
      kind: "vocabulary" as const,
      topic,
      vocabulary,
      progress,
      prerequisites: linkPrerequisites(vocabulary.prerequisiteSlugs),
    };
  }

  if (topic.skill !== "grammar") return null;

  const grammarRows = await db
    .select()
    .from(grammarTopics)
    .where(eq(grammarTopics.topicId, topic.id))
    .limit(1);
  const grammar = grammarRows[0];
  if (!grammar) return null;

  return {
    kind: "grammar" as const,
    topic,
    grammar,
    progress,
    prerequisites: linkPrerequisites(grammar.prerequisiteSlugs),
  };
}
