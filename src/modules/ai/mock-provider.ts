import type { AIProvider, GenerateTextInput, GenerateTextOutput } from "./provider";

const presentPerfect = {
  stem: "She ____ in this city since 2019.",
  options: [
    { id: "a", text: "has lived" },
    { id: "b", text: "lived" },
    { id: "c", text: "is living" },
    { id: "d", text: "lives" },
  ],
  correctAnswer: "a",
  explanation: "since 2019 là mốc kéo dài tới hiện tại, nên dùng hiện tại hoàn thành.",
  wrongAnswerExplanations: [
    { optionId: "b", explanation: "lived là quá khứ đơn, dùng khi mốc đã khép, không đi với since." },
    { optionId: "c", explanation: "is living nói việc đang xảy ra lúc nói, không nói khoảng từ 2019 tới nay." },
    { optionId: "d", explanation: "lives là hiện tại đơn, không diễn tả khoảng thời gian bắt đầu trong quá khứ." },
  ],
  difficulty: "medium",
};

function countFrom(prompt: string, pattern: RegExp, fallback: number) {
  return Number(prompt.match(pattern)?.[1] ?? fallback);
}

function mockQuestion(index: number) {
  return {
    ...presentPerfect,
    stem: `Mock question ${index + 1}: She ____ in this city since 2019.`,
  };
}

function generatorReply(input: GenerateTextInput) {
  if (input.operation === "reading-generation") {
    const count = countFrom(input.prompt, /đúng (\d+) câu đọc hiểu/, 4);
    return {
      title: "A Community Reading Project",
      body: `This mock passage contains ${count} questions. ` + "Students in a small town created a weekend reading project for younger children. They selected accessible stories, prepared questions, and invited families to join. The project gradually became a regular community activity because volunteers listened to feedback and improved each meeting. ".repeat(2),
      questions: Array.from({ length: count }, (_, index) => mockQuestion(index)),
    };
  }
  if (input.operation === "ordering-generation") {
    const count = countFrom(input.prompt, /Tạo đúng (\d+) bài/, 5);
    return {
      items: Array.from({ length: count }, (_, index) => ({
        title: `Mock ordering ${index + 1}`,
        prompt: "Put the sentences in the correct order.",
        sentences: [
          { id: "a", text: "Next, the group discussed the possible choices." },
          { id: "b", text: "First, Lan introduced the problem to her classmates." },
          { id: "c", text: "Finally, they agreed on a practical solution." },
          { id: "d", text: "After that, everyone voted for the best idea." },
        ],
        correctOrder: ["b", "a", "d", "c"],
        explanation: "Các câu đi theo trình tự mở vấn đề, thảo luận, bỏ phiếu rồi kết luận.",
        difficulty: "medium",
      })),
    };
  }
  if (input.operation === "gap_short-generation" || input.operation === "gap_long-generation") {
    const count = countFrom(input.prompt, /có đúng (\d+) chỗ trống/, 5);
    const sequence = countFrom(input.prompt, /từ \((\d+)\)/, 1);
    const markers = Array.from({ length: count }, (_, index) => `Sentence ${index + 1} contains gap (${sequence + index})______ for students to complete.`).join(" ");
    return {
      title: "A Mock School Notice",
      body: `Mock sequence ${sequence}. ${markers} ${"The notice gives students clear information about a useful school activity. ".repeat(4)}`,
      questions: Array.from({ length: count }, (_, index) => ({
        ...mockQuestion(index),
        topicSlug: "present-perfect",
      })),
    };
  }
  if (input.operation === "diagnostic-question-generation" || input.operation === "review-question-generation") {
    const count = countFrom(input.prompt, /Tạo (\d+) câu/, 5);
    return {
      questions: Array.from({ length: count }, (_, index) => ({
        ...mockQuestion(index),
        topicSlug: "present-perfect",
      })),
    };
  }
  if (input.operation === "practice-question-generation") {
    const count = countFrom(input.prompt, /Tạo (\d+) câu/, 5);
    return { questions: Array.from({ length: count }, (_, index) => mockQuestion(index)) };
  }
  return { questions: [presentPerfect] };
}

export class MockProvider implements AIProvider {
  readonly name = "mock";
  readonly model = "mock";

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const started = Date.now();
    const value = input.operation === "teacher-explanation"
      ? {
          errorType: "TENSE_CONFUSION",
          correctAnswer: "has lived",
          whyCorrect: "since 2019 còn liên quan tới hiện tại.",
          whyWrong: "Phương án đã chọn không đi với since.",
          rule: "Hiện tại hoàn thành dùng cho việc bắt đầu trong quá khứ và còn tới bây giờ.",
          structure: "Chủ ngữ + have/has + V3.",
          signalWords: "since, for",
          commonMistake: "Dùng quá khứ đơn với since.",
          comparison: "Quá khứ đơn cần mốc đã kết thúc, như in 2019.",
          shortExample: "She has lived here since 2019.",
          practicePrompt: "I ____ (know) her for two years.",
        }
      : generatorReply(input);
    const text = JSON.stringify(value);

    return {
      text,
      inputTokens: null,
      outputTokens: null,
      latencyMs: Date.now() - started,
    };
  }
}
