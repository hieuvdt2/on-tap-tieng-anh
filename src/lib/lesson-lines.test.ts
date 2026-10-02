import { describe, expect, it } from "vitest";
import { toLessonLines } from "./lesson-lines";

describe("toLessonLines", () => {
  it("splits one idea per line and keeps the term before the colon", () => {
    expect(toLessonLines("some: thường ở câu khẳng định.\nany: ở câu phủ định và câu hỏi.")).toEqual([
      { term: "some", text: "thường ở câu khẳng định.", children: [] },
      { term: "any", text: "ở câu phủ định và câu hỏi.", children: [] },
    ]);
  });

  it("keeps a line without a colon as plain text", () => {
    expect(toLessonLines("Nói kết quả có thật nếu điều kiện xảy ra.")).toEqual([
      { term: null, text: "Nói kết quả có thật nếu điều kiện xảy ra.", children: [] },
    ]);
  });

  it("splits only at the first colon", () => {
    expect(toLessonLines("Tính từ ngắn: thêm -er, ví dụ: taller.")).toEqual([
      { term: "Tính từ ngắn", text: "thêm -er, ví dụ: taller.", children: [] },
    ]);
  });

  it("nests a dashed line under the previous item", () => {
    expect(toLessonLines("He, she, it: thêm -s.\n- -es: khi tận cùng s, x, ch, sh.")).toEqual([
      {
        term: "He, she, it",
        text: "thêm -s.",
        children: [{ term: "-es", text: "khi tận cùng s, x, ch, sh.", children: [] }],
      },
    ]);
  });

  it("splits a long plain paragraph into separate items", () => {
    const source = "So sánh hơn nói A hơn B, tức chỉ có hai đối tượng. So sánh nhất nói A đứng đầu trong một nhóm từ ba trở lên.";
    expect(toLessonLines(source).map((line) => line.text)).toEqual([
      "So sánh hơn nói A hơn B, tức chỉ có hai đối tượng.",
      "So sánh nhất nói A đứng đầu trong một nhóm từ ba trở lên.",
    ]);
  });
});