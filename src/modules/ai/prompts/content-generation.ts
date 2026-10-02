export const CONTENT_PROMPT_VERSION = "content-generation-v1";

const rules = `
Chỉ trả về JSON hợp lệ, không markdown.
Nội dung tự soạn, không chép đề thi hay sách giáo khoa.
Giao diện tiếng Việt nhưng stem, passage, options và sentences phải bằng tiếng Anh.
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
}) {
  return `${rules}
Tạo ${input.count} câu trắc nghiệm cho chủ đề "${input.topicName}".
Kiến thức: ${input.context}
${input.reviewNotes?.length ? `Các lỗi cần tạo câu tương tự nhưng không sao chép: ${input.reviewNotes.join(" | ")}` : ""}
Tránh các stem: ${(input.avoidStems ?? []).slice(-30).join(" | ")}
JSON: {"questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"easy"}]}`;
}

export function buildMixedQuestionsPrompt(input: {
  topics: { slug: string; name: string; context: string }[];
  count: number;
  reviewNotes?: string[];
}) {
  return `${rules}
Tạo ${input.count} câu chẩn đoán mới, phân bố qua các chủ đề dưới đây. Mỗi câu thêm topicSlug đúng từ danh sách.
${input.topics.map((topic) => `${topic.slug}: ${topic.name}. ${topic.context}`).join("\n")}
${input.reviewNotes?.length ? `Lỗi cũ chỉ dùng làm mẫu kiến thức, không chép stem: ${input.reviewNotes.join(" | ")}` : ""}
JSON: {"questions":[{"topicSlug":"","stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildReadingPrompt(count = 4) {
  return `${rules}
Viết một bài đọc tiếng Anh nguyên bản 280-380 từ phù hợp THPT Việt Nam, rồi tạo đúng ${count} câu đọc hiểu. Bao phủ ý chính, chi tiết, tham chiếu từ và suy luận. Không dùng kiến thức ngoài đoạn văn.
JSON: {"title":"","body":"","questions":[{"stem":"","options":[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}],"correctAnswer":"a","explanation":"","wrongAnswerExplanations":[{"optionId":"b","explanation":""},{"optionId":"c","explanation":""},{"optionId":"d","explanation":""}],"difficulty":"medium"}]}`;
}

export function buildOrderingPrompt(count = 5) {
  return `${rules}
Tạo đúng ${count} bài sắp xếp. Mỗi bài gồm bốn câu/ lượt lời tạo thành đoạn hội thoại hoặc đoạn văn tự nhiên. Mảng sentences phải ở thứ tự xáo trộn; correctOrder dùng đủ a,b,c,d và không được trùng thứ tự hiển thị a,b,c,d.
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
