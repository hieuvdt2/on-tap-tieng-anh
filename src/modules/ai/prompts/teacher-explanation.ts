export const TEACHER_PROMPT_VERSION = "teacher-explanation-v1";

const errorTypes = [
  "GRAMMAR_RULE",
  "TENSE_CONFUSION",
  "VOCABULARY",
  "COLLOCATION",
  "PREPOSITION",
  "WORD_FORM",
  "SIGNAL_WORD_MISSED",
  "NEGATION",
  "SUBJECT_VERB_AGREEMENT",
  "UNKNOWN",
] as const;

export type TeacherErrorType = (typeof errorTypes)[number];

export function normalizeErrorType(value: string): TeacherErrorType {
  return errorTypes.find((item) => item === value) ?? "UNKNOWN";
}

export function buildTeacherPrompt(input: {
  topicName: string;
  structure: string;
  stem: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  selectedAnswer: string;
  builtInExplanation: string;
}) {
  const options = input.options.map((option) => `${option.id}. ${option.text}`).join("\n");
  return `Bạn là giáo viên tiếng Anh THPT. Giải thích bằng tiếng Việt vì sao học sinh sai.
Chủ đề: ${input.topicName}
Cấu trúc: ${input.structure}
Câu: ${input.stem}
Phương án:
${options}
Đáp án đúng: ${input.correctAnswer}
Học sinh chọn: ${input.selectedAnswer}
Gợi ý có sẵn: ${input.builtInExplanation}

errorType phải thuộc: ${errorTypes.join(", ")}.
Không bịa đây là đề chính thức. Câu luyện ngắn chỉ để đọc, không phải câu thi.
Chỉ trả về JSON với các khóa: errorType, correctAnswer, whyCorrect, whyWrong, rule, structure, signalWords, commonMistake, comparison, shortExample, practicePrompt.`;
}
