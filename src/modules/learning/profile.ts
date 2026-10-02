import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { topicMastery, topics } from "@/db/schema";
import { TOPIC_ORDER } from "@/modules/curriculum/order";
import type { MasteryLevel } from "@/modules/learning/mastery";
import { type RankedTopic, focusTopics, overallLevel, pickWeakTopic } from "@/modules/learning/recommend";

export type TopicProgress = RankedTopic & {
  id: string;
  slug: string;
  name: string;
  summary: string;
  gradeFrom: number;
  gradeTo: number;
  skill: string;
  correct: number;
};

function topicPosition(slug: string) {
  const index = TOPIC_ORDER.indexOf(slug as (typeof TOPIC_ORDER)[number]);
  return index === -1 ? TOPIC_ORDER.length : index;
}

export async function getTopicProgress(userId: string): Promise<TopicProgress[]> {
  const rows = await db
    .select({
      id: topics.id,
      slug: topics.slug,
      name: topics.name,
      summary: topics.summary,
      gradeFrom: topics.gradeFrom,
      gradeTo: topics.gradeTo,
      skill: topics.skill,
      attempts: topicMastery.attempts,
      correct: topicMastery.correct,
      level: topicMastery.level,
      score: topicMastery.masteryScore,
    })
    .from(topics)
    .leftJoin(
      topicMastery,
      and(eq(topicMastery.topicId, topics.id), eq(topicMastery.userId, userId)),
    )
    .orderBy(asc(topics.gradeFrom), asc(topics.slug));

  return rows
    .filter((row) => row.skill === "grammar" || row.skill === "vocabulary")
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      summary: row.summary,
      gradeFrom: row.gradeFrom,
      gradeTo: row.gradeTo,
      skill: row.skill,
      order: topicPosition(row.slug),
      attempts: row.attempts ?? 0,
      correct: row.correct ?? 0,
      level: (row.attempts ?? 0) > 0 ? (row.level as MasteryLevel) : null,
      score: (row.attempts ?? 0) > 0 ? (row.score ?? 0) : null,
    }))
    .sort((left, right) => left.order - right.order);
}

export async function getDashboard(userId: string) {
  const topicList = await getTopicProgress(userId);
  const answered = topicList.reduce((sum, topic) => sum + topic.attempts, 0);
  const correct = topicList.reduce((sum, topic) => sum + topic.correct, 0);
  return {
    topics: topicList,
    focus: focusTopics(topicList),
    overall: overallLevel(topicList),
    answered,
    correct,
    next: focusTopics(topicList, 1)[0] ?? null,
    started: topicList.some((topic) => topic.attempts > 0),
  };
}

export { pickWeakTopic };
