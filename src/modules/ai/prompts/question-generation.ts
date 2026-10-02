export const QUESTION_PROMPT_VERSION = "question-generation-v1";

export type GrammarPromptContext = {
  name: string;
  purpose: string;
  usage: string;
  structure: string;
  affirmativePattern: string;
  negativePattern: string;
  questionPattern: string;
  signalWords: string[];
  commonMistakes: { wrong: string; right: string; why: string }[];
};

export function buildQuestionPrompt(input: {
  grammar: GrammarPromptContext;
  count: number;
  avoidStems: string[];
}) {
  const mistakes = input.grammar.commonMistakes
    .map((mistake) => `${mistake.wrong} → ${mistake.right} (${mistake.why})`)
    .join("\n");
  const avoid = input.avoidStems.slice(0, 12).map((stem) => `- ${stem}`).join("\n");

  return `Bạn soạn câu trắc nghiệm tiếng Anh cho học sinh THPT Việt Nam.
Chủ đề: ${input.grammar.name}
Mục đích: ${input.grammar.purpose}
Cách dùng: ${input.grammar.usage}
Cấu trúc: ${input.grammar.structure}
Khẳng định: ${input.grammar.affirmativePattern}
Phủ định: ${input.grammar.negativePattern}
Câu hỏi: ${input.grammar.questionPattern}
Từ tín hiệu: ${input.grammar.signalWords.join(", ")}
Lỗi hay gặp:
${mistakes || "Không có."}

Viết ${input.count} câu mới. Đề bài và bốn phương án bằng tiếng Anh. Lời giải bằng tiếng Việt.
Mỗi câu có đúng bốn phương án id a, b, c, d. Chỉ một đáp án đúng.
wrongAnswerExplanations có đúng ba phần tử, mỗi phần tử là một phương án sai.
Không chép các câu sau:
${avoid || "Không có."}
Không nói đây là đề chính thức của Bộ.
Chỉ trả về JSON:
{"questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"easy"}]}
difficulty chỉ được là easy, medium hoặc hard.`;
}
