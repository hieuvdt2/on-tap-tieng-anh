import { describe, expect, it } from "vitest";
import { paperAQuestions } from "@/db/content/exam/paper-a";
import { paperBExam, paperBQuestions, paperBStimuli } from "@/db/content/exam/paper-b";

describe("paper B", () => {
  it("has a second original 40-question paper in exam order", () => {
    expect(paperBQuestions).toHaveLength(40);
    expect(new Set(paperBQuestions.map((question) => question.id)).size).toBe(40);
    expect(new Set(paperBQuestions.map((question) => question.stem)).size).toBe(40);
    expect(paperBExam.questionIds).toEqual(paperBQuestions.map((question) => question.id));
    expect(paperBExam.questionCount).toBe(40);
    expect(paperBExam.durationMinutes).toBe(50);
    expect(paperAQuestions.map((question) => question.id).some((id) => id.startsWith("pb-"))).toBe(false);
    expect(paperBQuestions.map((question) => question.stem).some((stem) => paperAQuestions.some((question) => question.stem === stem))).toBe(false);
  });

  it("matches the section counts", () => {
    const kinds = new Map(paperBStimuli.map((stimulus) => [stimulus.id, stimulus.kind]));
    const counts = { gap_short: 0, gap_long: 0, ordering: 0, reading: 0 };
    for (const question of paperBQuestions) {
      if (question.type === "ordering") counts.ordering += 1;
      else if (question.type === "gap_short") counts.gap_short += 1;
      else if (question.type === "gap_long") counts.gap_long += 1;
      else if (kinds.get(question.stimulusId) === "passage") counts.reading += 1;
    }
    expect(counts).toEqual({ gap_short: 12, ordering: 5, gap_long: 5, reading: 18 });
  });
});
