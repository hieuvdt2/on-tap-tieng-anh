import { describe, expect, it } from "vitest";
import {
  buildOrderingPrompt,
  buildReadingPrompt,
  buildReadingQuestionsPrompt,
  buildTopicQuestionsPrompt,
} from "./content-generation";

describe("difficulty in generation prompts", () => {
  it("asks for the chosen level and gives a hint specific to the kind", () => {
    expect(buildOrderingPrompt(2, "hard")).toContain('phải ở mức "hard"');
    expect(buildOrderingPrompt(2, "hard")).toContain("mạch ý");
    expect(buildReadingPrompt(4, "hard")).toContain("suy luận");
    expect(buildReadingQuestionsPrompt({ body: "x", count: 2, difficulty: "hard" })).toContain("suy luận");
    expect(buildTopicQuestionsPrompt({ topicName: "t", context: "c", count: 3, difficulty: "hard" })).toContain("bẫy");
  });

  it("keeps the level out when none is chosen", () => {
    expect(buildOrderingPrompt(2)).not.toContain("người học chọn mức");
    expect(buildReadingPrompt(4)).not.toContain("người học chọn mức");
    expect(buildTopicQuestionsPrompt({ topicName: "t", context: "c", count: 3 })).toContain("30% câu");
  });
});
