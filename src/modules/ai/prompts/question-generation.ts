export const QUESTION_PROMPT_VERSION = "question-generation-v3";

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
EXPLANATION (bắt buộc): phải nêu đúng yếu tố ngữ pháp thực sự quyết định đáp án (chủ ngữ, thì, dấu hiệu, cấu trúc...), không gán lý do cho từ/cụm không liên quan đến việc chọn đáp án đúng.
ĐA DẠNG ĐỊNH DẠNG (bắt buộc): khoảng 70-75% câu vẫn là 1 chỗ trống "___" như thường lệ. Khoảng 25-30% còn lại đổi sang MỘT trong các mẫu sau (chọn ngẫu nhiên, không trộn nhiều mẫu trong một câu, vẫn giữ đúng format JSON và đúng 4 phương án):
- Nhiều chỗ trống: stem có đúng 2 chỗ trống "___"; mỗi phương án là một CẶP đáp án cách nhau bằng " / " đúng theo thứ tự 2 chỗ trống.
- Chọn câu đúng: stem là "Which sentence is grammatically correct?"; 4 phương án là 4 CÂU HOÀN CHỈNH khác nhau, chỉ một câu đúng ngữ pháp.
- Tìm phần sai: stem là một câu có đánh dấu bốn cụm bằng "(A)", "(B)", "(C)", "(D)" ngay trước mỗi cụm; 4 phương án là "Phần A", "Phần B", "Phần C", "Phần D"; đáp án đúng là phần chứa lỗi sai thật.
- Biến đổi câu: stem gồm câu gốc rồi tới hướng dẫn viết lại (vd "Begin with: ..."); 4 phương án là 4 CÂU HOÀN CHỈNH viết lại khác nhau, chỉ một câu vừa đúng nghĩa gốc vừa đúng cấu trúc yêu cầu.
Không chép các câu sau:
${avoid || "Không có."}
Không nói đây là đề chính thức của Bộ.
Chỉ trả về JSON:
{"questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"easy"}]}
difficulty chỉ được là easy, medium hoặc hard.`;
}
