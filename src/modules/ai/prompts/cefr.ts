import type { CefrLevel } from "@/modules/levels/cefr";

export const CEFR_PROMPT_VERSION = "cefr-generation-v2";

// Mô tả từng bậc để model viết đúng độ khó (diễn giải ngắn từ khung CEFR; không phải trích nguyên văn).
export const LEVEL_DESCRIPTORS: Record<CefrLevel, string> = {
  A1: "Từ vựng cơ bản nhất (gia đình, đồ vật, thức ăn, số, màu). Câu ngắn, một mệnh đề. Chỉ thì hiện tại đơn, hiện tại tiếp diễn, can, there is/are, tính từ sở hữu.",
  A2: "Từ vựng quen thuộc hằng ngày (mua sắm, du lịch, công việc đơn giản). Câu đơn và ghép với and/but/because. Quá khứ đơn, tương lai gần, so sánh, must/should.",
  B1: "Chủ đề quen thuộc (học tập, sở thích, du lịch). Hiện tại hoàn thành, điều kiện loại 1-2, bị động đơn giản, mệnh đề quan hệ cơ bản, cụm động từ thường gặp.",
  B2: "Chủ đề trừu tượng vừa phải (môi trường, công nghệ, xã hội). Điều kiện loại 3, bị động nhiều thì, câu tường thuật, collocation, từ nối, nhận biết ý chính và ý ngầm.",
  C1: "Văn bản dài, ý ngầm, giọng điệu. Đảo ngữ, giả định, mệnh đề quan hệ phức tạp, collocation và thành ngữ ít gặp, từ vựng học thuật.",
  C2: "Sắc thái nghĩa tinh tế, phong cách trang trọng, đảo ngữ và cấu trúc hiếm, từ vựng văn chương/học thuật, phân biệt từ gần nghĩa.",
};

export const PASSAGE_WORDS: Record<CefrLevel, [number, number]> = {
  A1: [60, 90], A2: [90, 130], B1: [150, 220], B2: [220, 300], C1: [250, 350], C2: [300, 400],
};
// Đoạn ngắn một câu hỏi (dùng cho bài đánh giá và phần nghe/đọc của đề theo trình độ).
export const CLIP_WORDS = { passage: [25, 70], listening: [20, 55] } as const;

export const LISTENING_WORDS: Record<CefrLevel, [number, number]> = {
  A1: [50, 80], A2: [70, 110], B1: [100, 160], B2: [140, 200], C1: [160, 240], C2: [200, 280],
};

const rules = `
Chỉ trả về JSON hợp lệ, không markdown.
NGÔN NGỮ: đề bài (stem), các lựa chọn, tiêu đề và văn bản phải HOÀN TOÀN bằng tiếng Anh. Chỉ explanation và wrongAnswerExplanations viết bằng tiếng Việt, ngắn gọn.
Mỗi câu có đúng 4 lựa chọn a, b, c, d và chỉ MỘT đáp án đúng; ba lựa chọn còn lại phải sai rõ ràng (không để hai đáp án cùng đúng).
Đặt đáp án đúng ở các vị trí khác nhau giữa các câu.
Nội dung tự soạn, không chép đề thi.
EXPLANATION (bắt buộc): phải nêu đúng yếu tố ngữ pháp/ngữ nghĩa thực sự quyết định đáp án (chủ ngữ, thì, dấu hiệu, cấu trúc, nghĩa từ trong câu...). Không gán lý do cho một từ/cụm không liên quan đến việc chọn đáp án (ví dụ: không nói "có from nên dùng since" nếu from không phải căn cứ thật). Nếu không chắc lý do thật, chọn câu khác dễ giải thích rõ ràng hơn.`;

const questionJson =
  '{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}';

export function buildCefrQuestionsPrompt(input: { level: CefrLevel; topicName: string; context: string; count: number; avoidStems: string[] }) {
  return `${rules}
Tạo ${input.count} câu trắc nghiệm ngữ pháp/từ vựng ĐÚNG trình độ CEFR ${input.level}, chủ đề "${input.topicName}".
Đặc điểm trình độ ${input.level}: ${LEVEL_DESCRIPTORS[input.level]}
Kiến thức: ${input.context}
Không dùng cấu trúc hay từ vựng vượt quá ${input.level}; không dễ hơn mức này quá nhiều. Điền difficulty hợp lý (A1/A2 thường là easy, B1/B2 medium, C1/C2 hard).
Tránh các stem: ${input.avoidStems.slice(-30).join(" | ")}
JSON: {"questions":[${questionJson}]}`;
}

export function buildCefrPassagePrompt(input: {
  level: CefrLevel;
  kind: "passage" | "listening";
  count: number;
  topicHint: string;
  /** Đoạn ngắn, chỉ một câu hỏi, mỗi đoạn một tình huống riêng. */
  short?: boolean;
}) {
  const [min, max] = input.short ? CLIP_WORDS[input.kind] : (input.kind === "passage" ? PASSAGE_WORDS : LISTENING_WORDS)[input.level];
  const what =
    input.kind === "passage"
      ? `một bài đọc nguyên bản ${min}-${max} từ`
      : `một đoạn để NGHE dài ${min}-${max} từ, viết như lời nói (ngắt câu rõ, không ghi chú sân khấu, không ghi tên người nói trừ dạng "A:" "B:"). ƯU TIÊN hội thoại giữa hai người (A và B, mỗi người ít nhất 2-3 lượt nói) bàn về một việc cụ thể (hẹn giờ, đặt chỗ, hỏi đường…); chỉ dùng độc thoại (thông báo, dự báo thời tiết, lời nhắn thoại) cho một phần nhỏ, không phải phần lớn`;
  const ask =
    input.kind === "passage"
      ? "ý chính, chi tiết, suy luận và nghĩa của từ trong ngữ cảnh"
      : "mục đích, chi tiết cụ thể (số, giờ, địa điểm), thái độ hoặc suy luận ngắn";
  const distractorRule =
    input.kind === "listening"
      ? `\nGiống đề nghe thật: cài thông tin gây nhiễu tự nhiên trước khi chốt đáp án đúng, ví dụ:
- Nhắc một giờ/địa điểm/phương án sai trước, rồi một người nói đổi ý hoặc sửa lại ("Let's meet at 3... actually, make it half past 3").
- Đáp án đúng viết ở ĐỊNH DẠNG KHÁC với lời thoại để buộc người nghe tự quy đổi (lời thoại nói "half past seven" thì lựa chọn ghi "7:30", không ghi lại nguyên văn "half past seven").
Mỗi đoạn có ít nhất một chỗ gây nhiễu như vậy, nhưng đáp án đúng vẫn phải rõ ràng khi nghe hết đoạn, không đánh đố quá mức.`
      : "";
  return `${rules}
Viết ${what} ở trình độ CEFR ${input.level} (gợi ý chủ đề: ${input.topicHint}), rồi tạo đúng ${input.count} câu hỏi trắc nghiệm kiểm tra ${ask}.
Đặc điểm trình độ ${input.level}: ${LEVEL_DESCRIPTORS[input.level]}
Câu hỏi chỉ dựa vào văn bản, không cần kiến thức ngoài.${input.short ? "\nĐây là MỘT đoạn ngắn độc lập (một tình huống riêng, không phải phần của bài dài); chỉ tạo đúng 1 câu hỏi." : ""}${distractorRule}
JSON: {"title":"","body":"","questions":[${questionJson}]}`;
}
