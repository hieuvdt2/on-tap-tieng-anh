import { describe, expect, it } from "vitest";
import { focusTopics, overallLevel, pickWeakTopic, topicToStudyFirst } from "./recommend";

const topics = [
  { id: "simple", order: 0, attempts: 0, level: null, score: null },
  { id: "past", order: 1, attempts: 4, level: "solid" as const, score: 0.9 },
  { id: "perfect", order: 2, attempts: 3, level: "weak" as const, score: 0.2 },
  { id: "conditional", order: 3, attempts: 2, level: "weak" as const, score: 0.4 },
];

describe("focusTopics", () => {
  it("puts weak topics ahead of topics the student has not opened", () => {
    expect(focusTopics(topics).map((topic) => topic.id)).toEqual([
      "perfect",
      "conditional",
      "simple",
    ]);
  });
});

describe("pickWeakTopic", () => {
  it("chooses the lowest weak score", () => {
    expect(pickWeakTopic(topics)?.id).toBe("perfect");
  });

  it("falls back to the least practiced topic", () => {
    const steady = topics.map((topic) =>
      topic.level === "weak" ? { ...topic, level: "learning" as const, score: 0.6 } : topic,
    );
    expect(pickWeakTopic(steady)?.id).toBe("simple");
  });
});

describe("topicToStudyFirst", () => {
  it("picks the weak topic from the earliest grade", () => {
    const ranked = [
      { id: "late", order: 4, attempts: 3, level: "weak" as const, score: 0.2, gradeFrom: 11 },
      { id: "early", order: 1, attempts: 3, level: "weak" as const, score: 0.3, gradeFrom: 7 },
      { id: "none", order: 0, attempts: 0, level: null, score: null, gradeFrom: 6 },
    ];
    expect(topicToStudyFirst(ranked)?.id).toBe("early");
  });
});

describe("overallLevel", () => {
  it("ignores topics with no attempts", () => {
    expect(overallLevel(topics)).toBe("learning");
  });
});
