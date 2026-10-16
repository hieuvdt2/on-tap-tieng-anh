export const CONTENT_PROMPT_VERSION = "content-generation-v3";

// Không có đoạn này model gần như chỉ trả "easy"/"medium" (ví dụ mẫu trong JSON bị chép lại). Mô tả
// cụ thể thế nào là câu khó để tỉ lệ khó thực sự xuất hiện.
const difficultyRule = `
ĐỘ KHÓ (bắt buộc): trong mỗi lượt, khoảng 30% câu "easy", 40% "medium", 30% "hard"; điền đúng trường difficulty cho từng câu.
- easy: một quy tắc cơ bản, ngữ cảnh rõ, phương án nhiễu sai rõ ràng.
- medium: cần nhận ra dấu hiệu trong câu hoặc phân biệt hai cấu trúc quen thuộc.
- hard: cần cân nhắc ngữ cảnh hoặc ngoại lệ; ít nhất hai phương án nhiễu nghe hợp lý, câu dài hơn, kiểu bẫy hay gặp trong đề thi tốt nghiệp.
`;

type Level = "easy" | "medium" | "hard";

const HARD_HINTS = {
  grammar: "hard: cần cân nhắc ngữ cảnh hoặc ngoại lệ; ít nhất hai phương án nhiễu nghe hợp lý, kiểu bẫy hay gặp trong đề thi tốt nghiệp.",
  reading: "hard: câu suy luận, ý ngầm, nghĩa của từ trong ngữ cảnh hoặc tham chiếu xa; phương án nhiễu bám sát nội dung đoạn văn.",
  ordering: "hard: ít từ nối rõ ràng, phải dựa vào mạch ý, đại từ, mạo từ a/the hoặc quan hệ nguyên nhân - kết quả để sắp xếp.",
} as const;

function focusRule(difficulty: Level, kind: keyof typeof HARD_HINTS = "grammar") {
  const label = { easy: "dễ (easy)", medium: "vừa (medium)", hard: "khó (hard)" }[difficulty];
  return `
ĐỘ KHÓ (bắt buộc): người học chọn mức ${label}. Ít nhất 70% số câu/bài phải ở mức "${difficulty}", còn lại ở mức kề; điền đúng trường difficulty cho từng mục.
${difficulty === "hard" ? `- ${HARD_HINTS[kind]}\n` : ""}`;
}

const rules = `
Chỉ trả về JSON hợp lệ, không markdown.
Nội dung tự soạn, không chép đề thi hay sách giáo khoa.
NGÔN NGỮ (bắt buộc): mọi trường là nội dung của đề — title, body, prompt, stem, options (text), sentences (text) — phải viết HOÀN TOÀN bằng tiếng Anh, tuyệt đối không có từ tiếng Việt, kể cả tiêu đề và đoạn văn có chỗ trống. Chỉ explanation và wrongAnswerExplanations được viết bằng tiếng Việt.
Mỗi câu trắc nghiệm có đúng 4 lựa chọn a, b, c, d; chỉ một đáp án đúng.
explanation và wrongAnswerExplanations viết bằng tiếng Việt, ngắn gọn và chính xác.
Không gọi nội dung là đề chính thức.
`;

export function buildTopicQuestionsPrompt(input: {
  topicName: string;
  context: string;
  count: number;
  avoidStems?: string[];
  reviewNotes?: string[];
  difficulty?: "easy" | "medium" | "hard";
}) {
  return `${rules}${input.difficulty ? focusRule(input.difficulty) : difficultyRule}
Tạo ${input.count} câu trắc nghiệm cho chủ đề "${input.topicName}".
Kiến thức: ${input.context}
${input.reviewNotes?.length ? `Các lỗi cần tạo câu tương tự nhưng không sao chép: ${input.reviewNotes.join(" | ")}` : ""}
Tránh các stem: ${(input.avoidStems ?? []).slice(-30).join(" | ")}
JSON: {"questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildMixedQuestionsPrompt(input: {
  topics: { slug: string; name: string; context: string }[];
  count: number;
  reviewNotes?: string[];
  difficulty?: Level;
}) {
  return `${rules}${input.difficulty ? focusRule(input.difficulty) : difficultyRule}
Tạo ${input.count} câu chẩn đoán mới, phân bố qua các chủ đề dưới đây. Mỗi câu thêm topicSlug đúng từ danh sách.
${input.topics.map((topic) => `${topic.slug}: ${topic.name}. ${topic.context}`).join("\n")}
${input.reviewNotes?.length ? `Lỗi cũ chỉ dùng làm mẫu kiến thức, không chép stem: ${input.reviewNotes.join(" | ")}` : ""}
JSON: {"questions":[{"topicSlug":"","stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildReadingPrompt(count = 4, difficulty?: Level) {
  return `${rules}${difficulty ? focusRule(difficulty, "reading") : ""}
Viết một bài đọc tiếng Anh nguyên bản 280-380 từ phù hợp THPT Việt Nam, rồi tạo đúng ${count} câu đọc hiểu. Bao phủ ý chính, chi tiết, tham chiếu từ và suy luận. Không dùng kiến thức ngoài đoạn văn.
JSON: {"title":"","body":"","questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

// Xin thêm câu cho một bài đọc đã có sẵn, không viết lại đoạn văn — giữ mỗi lượt gọi AI nhỏ và
// nhanh thay vì bắt AI trả cả đoạn văn lẫn 10 câu trong một lần (dễ timeout/vượt rate limit).
export function buildReadingQuestionsPrompt(input: { body: string; count: number; avoidStems?: string[]; difficulty?: Level }) {
  return `${rules}${input.difficulty ? focusRule(input.difficulty, "reading") : ""}
Đây là một bài đọc đã có sẵn. Không viết lại hay chỉnh sửa đoạn văn này:
"""
${input.body}
"""
Dựa đúng vào đoạn văn trên, tạo thêm đúng ${input.count} câu đọc hiểu mới, khác với các câu đã có. Bao phủ ý chính, chi tiết, tham chiếu từ và suy luận. Không dùng kiến thức ngoài đoạn văn.
${input.avoidStems?.length ? `Tránh trùng các stem đã dùng: ${input.avoidStems.slice(-20).join(" | ")}` : ""}
JSON: {"questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildOrderingPrompt(count = 5, difficulty?: Level) {
  return `${rules}${difficulty ? focusRule(difficulty, "ordering") : ""}
Tạo đúng ${count} bài sắp xếp. title là một tiêu đề tiếng Anh ngắn về chủ đề (ví dụ "Weekend Plans"), không đánh số bài. Mỗi bài gồm bốn câu/ lượt lời tạo thành đoạn hội thoại hoặc đoạn văn tự nhiên. Mảng sentences phải ở thứ tự xáo trộn; correctOrder dùng đủ a,b,c,d và không được trùng thứ tự hiển thị a,b,c,d.
JSON: {"items":[{"title":"","prompt":"Put the sentences in the correct order.","sentences":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctOrder":["b","d","a","c"],"explanation":"","difficulty":"medium"}]}`;
}

export function buildGapPrompt(input: {
  type: "gap_short" | "gap_long";
  count: number;
  topics: { slug: string; name: string }[];
  sequenceStart: number;
  format?: "leaflet" | "advertisement" | "passage";
}) {
  const blankEnd = input.sequenceStart + input.count - 1;
  const length = input.type === "gap_short" ? "130-170" : "160-220";
  const format = input.format === "leaflet"
    ? "Viết thành leaflet hoặc thông báo của nhà trường. title là tên chiến dịch viết hoa."
    : input.format === "advertisement"
      ? "Viết thành quảng cáo hoặc thông báo ngắn. title viết hoa."
      : "Viết thành một đoạn văn liền mạch.";
  return `${rules}
${format} Độ dài ${length} từ, có đúng ${input.count} chỗ trống đánh số từ (${input.sequenceStart})______ đến (${blankEnd})______. Stem của mỗi câu là "Choose blank (n)." với n đúng số chỗ trống. Mỗi câu thêm topicSlug đúng từ danh sách: ${input.topics.map((topic) => `${topic.slug}=${topic.name}`).join(", ")}.
${input.type === "gap_long" ? "Các lựa chọn là câu hoặc cụm dài, kiểm tra liên kết và cấu trúc." : "Kiểm tra từ vựng, ngữ pháp và collocation ở cấp THPT. Mỗi lựa chọn là một từ hoặc cụm ngắn."}
Mỗi explanation chỉ một câu tiếng Việt.
JSON: {"title":"","body":"","questions":[{"topicSlug":"","stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildVocabularyPrompt(input: { topicName: string; context: string; count: number; avoidWords: string[] }) {
  return `${rules}
Tạo ${input.count} từ hoặc cụm từ vựng tiếng Anh thường gặp trong đề thi tốt nghiệp THPT, thuộc chủ đề "${input.topicName}". Từ hữu ích cho học sinh Việt Nam trình độ B1.
Gợi ý ngữ cảnh: ${input.context}
Mỗi mục: word (tiếng Anh, 1-3 chữ, dạng gốc), wordClass (n, v, adj, adv, phr…), ipa (phiên âm IPA, có thể bỏ trống), meaningVi (nghĩa tiếng Việt ngắn gọn), example (một câu tiếng Anh tự nhiên có chứa từ đó), note (mẹo dùng hoặc cụm đi kèm bằng tiếng Việt, ngắn).
Không lặp các từ đã có: ${input.avoidWords.slice(-80).join(", ")}
JSON: {"words":[{"word":"","wordClass":"","ipa":"","meaningVi":"","example":"","note":""}]}`;
}
