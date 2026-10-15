import { describe, expect, it } from "vitest";
import { paperAQuestions } from "@/db/content/exam/paper-a";
import { paperBQuestions } from "@/db/content/exam/paper-b";
import { paperCExam, paperCHash, paperCQuestions, paperCStimuli } from "@/db/content/exam/paper-c";
import { contentHash } from "@/db/hash";

// Bản đáp án tham khảo đi kèm đề (không phải đáp án chính thức của Bộ); đã tự đối chiếu từng câu.
const KEY = "CDBAA ADBAB BBDCD DBADA DCCAD ACDCA DADCC DAAAD".replace(/ /g, "");

describe("paper C (official 2026, mã đề 1116)", () => {
  it("has 40 questions in exam order with unique ids and stems", () => {
    expect(paperCQuestions).toHaveLength(40);
    expect(new Set(paperCQuestions.map((question) => question.id)).size).toBe(40);
    expect(new Set(paperCQuestions.map((question) => question.stem)).size).toBe(40);
    expect(paperCExam.questionIds).toEqual(paperCQuestions.map((question) => question.id));
    expect(paperCExam.questionCount).toBe(40);
    expect(paperCExam.durationMinutes).toBe(50);
  });

  it("does not collide with papers A and B", () => {
    const others = [...paperAQuestions, ...paperBQuestions];
    const ids = new Set(others.map((question) => question.id));
    expect(paperCQuestions.some((question) => ids.has(question.id))).toBe(false);
    // Một số đề bài chung chung của đề thật trùng đề bài ở A/B, nên mã băm của C kèm mã đoạn văn.
    const hashes = new Set(others.map((question) => contentHash(question.stem)));
    const clashes = paperCQuestions.filter((question) => hashes.has(paperCHash(question)));
    expect(clashes.map((question) => question.id)).toEqual([]);
    expect(new Set(paperCQuestions.map(paperCHash)).size).toBe(40);
  });

  it("matches the section counts of the exam", () => {
    const kinds = new Map(paperCStimuli.map((stimulus) => [stimulus.id, stimulus.kind]));
    const counts = { gap_short: 0, gap_long: 0, ordering: 0, reading: 0 };
    for (const question of paperCQuestions) {
      if (question.type === "ordering") counts.ordering += 1;
      else if (question.type === "gap_short") counts.gap_short += 1;
      else if (question.type === "gap_long") counts.gap_long += 1;
      else if (kinds.get(question.stimulusId) === "passage") counts.reading += 1;
    }
    expect(counts).toEqual({ gap_short: 12, ordering: 5, gap_long: 5, reading: 18 });
  });

  it("uses the reference answer key for the 35 multiple-choice questions", () => {
    paperCQuestions.slice(5).forEach((question, index) => {
      expect(question.correctAnswer, `câu ${index + 6}`).toBe(KEY[index + 5]!.toLowerCase());
    });
  });

  it("gives every multiple-choice question 4 options and an explanation for each wrong one", () => {
    for (const question of paperCQuestions.filter((item) => item.type !== "ordering")) {
      expect(question.options.map((option) => option.id)).toEqual(["a", "b", "c", "d"]);
      expect(question.wrongAnswerExplanations).toHaveLength(3);
      expect(question.wrongAnswerExplanations.map((item) => item.optionId)).not.toContain(question.correctAnswer);
    }
  });

  it("keeps ordering answers as full permutations of the shown sentences, never in the shown order", () => {
    const expected = [
      "d,c,b,a,e",
      "a,c,b",
      "c,e,a,d,b",
      "c,d,a,e,b",
      "b,c,d,a,e",
    ];
    paperCQuestions.slice(0, 5).forEach((question, index) => {
      const ids = question.options.map((option) => option.id);
      expect(question.correctAnswer).toBe(expected[index]);
      expect([...question.correctAnswer.split(",")].sort()).toEqual([...ids].sort());
      expect(question.correctAnswer).not.toBe(ids.join(","));
    });
  });

  it("numbers the blanks of each gap passage across the whole paper", () => {
    const ranges: Record<string, [number, number]> = {
      "stim-c-wealth": [6, 10],
      "stim-c-flyer": [29, 34],
      "stim-c-leaflet": [35, 40],
    };
    for (const [id, [from, to]] of Object.entries(ranges)) {
      const body = paperCStimuli.find((stimulus) => stimulus.id === id)!.body;
      for (let n = from; n <= to; n += 1) expect(body, `${id} (${n})`).toMatch(new RegExp(`\\(${n}\\)\\s*_{3,}`));
    }
  });

  it("lists every gap question under the stimulus whose blank it numbers", () => {
    const byId = new Map(paperCQuestions.map((question) => [question.id, question]));
    for (let n = 6; n <= 40; n += 1) {
      const question = byId.get(`pc-${n}`)!;
      if (question.type !== "gap_short" && question.type !== "gap_long") continue;
      const stimulus = paperCStimuli.find((item) => item.id === question.stimulusId)!;
      expect(stimulus.body, `câu ${n}`).toMatch(new RegExp(`\\(${n}\\)\\s*_{3,}`));
      expect(question.stem).toContain(`(${n})`);
    }
  });
});
