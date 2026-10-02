import { describe, expect, it } from "vitest";
import { curriculum } from "@/db/content";
import { topicLabel, topicVietnameseName } from "./topic-names";

describe("topic names", () => {
  it("has a Vietnamese name for every topic", () => {
    const missing = curriculum.filter((topic) => !topicVietnameseName(topic.name)).map((topic) => topic.name);
    expect(missing).toEqual([]);
  });

  it("adds the Vietnamese name in brackets", () => {
    expect(topicLabel("Present Simple")).toBe("Present Simple (Thì hiện tại đơn)");
  });
});
