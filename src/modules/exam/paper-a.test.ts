import { describe, expect, it } from "vitest";
import { paperAExam, paperAQuestions, paperAStimuli } from "@/db/content/exam/paper-a";
import { groupExamBlocks } from "./group";

describe("paper A", () => {
  it("has one original 40-question paper in exam order", () => {
    expect(paperAQuestions).toHaveLength(40);
    expect(new Set(paperAQuestions.map((question) => question.id)).size).toBe(40);
    expect(new Set(paperAQuestions.map((question) => question.stem)).size).toBe(40);
    expect(paperAExam.questionIds).toEqual(paperAQuestions.map((question) => question.id));
    expect(paperAExam.questionCount).toBe(40);
    expect(paperAExam.durationMinutes).toBe(50);
  });

  it("matches the section counts", () => {
    const kinds = new Map(paperAStimuli.map((stimulus) => [stimulus.id, stimulus.kind]));
    const counts = { gap_short: 0, gap_long: 0, ordering: 0, reading: 0 };
    for (const question of paperAQuestions) {
      if (question.type === "ordering") counts.ordering += 1;
      else if (question.type === "gap_short") counts.gap_short += 1;
      else if (question.type === "gap_long") counts.gap_long += 1;
      else if (kinds.get(question.stimulusId) === "passage") counts.reading += 1;
    }
    expect(counts).toEqual({ gap_short: 12, ordering: 5, gap_long: 5, reading: 18 });
  });
});

describe("groupExamBlocks", () => {
  it("keeps one text for consecutive blanks and leaves ordering between texts", () => {
    const blocks = groupExamBlocks([
      { id: "1", type: "gap_short", stimulusId: "leaf", stimulusTitle: "Leaflet", stimulusBody: "Text" },
      { id: "2", type: "gap_short", stimulusId: "leaf", stimulusTitle: "Leaflet", stimulusBody: "Text" },
      { id: "3", type: "ordering", stimulusId: "order", stimulusTitle: "Order", stimulusBody: "Arrange" },
      { id: "4", type: "single_choice", stimulusId: "read", stimulusTitle: "Read", stimulusBody: "Passage" },
    ]);
    expect(blocks.map((block) => block.kind)).toEqual(["stimulus", "ordering", "stimulus"]);
    expect(blocks[0]?.kind === "stimulus" ? blocks[0].items : []).toHaveLength(2);
  });
});