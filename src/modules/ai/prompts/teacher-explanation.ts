export const TEACHER_PROMPT_VERSION = "teacher-explanation-v2";

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
whyCorrect/whyWrong/rule (bắt buộc): phải nêu đúng yếu tố ngữ pháp thực sự quyết định đáp án (chủ ngữ, thì, dấu hiệu, cấu trúc...), không gán lý do cho từ/cụm không liên quan đến việc chọn đáp án đúng.
Không bịa đây là đề chính thức. Câu luyện ngắn chỉ để đọc, không phải câu thi.
Chỉ trả về JSON với các khóa: errorType, correctAnswer, whyCorrect, whyWrong, rule, structure, signalWords, commonMistake, comparison, shortExample, practicePrompt.`;
}
