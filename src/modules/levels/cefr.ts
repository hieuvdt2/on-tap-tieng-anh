// Khung trình độ CEFR dùng cho "Làm đề theo trình độ". Đây là bài luyện tự đánh giá, không phải bài thi
// chính thức và không thay thế chứng chỉ (IELTS, Cambridge…).
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export function isCefrLevel(value: string | null | undefined): value is CefrLevel {
  return typeof value === "string" && (CEFR_LEVELS as readonly string[]).includes(value);
}

export const BANDS = [
  {
    id: "a",
    label: "A1–A2",
    title: "Cơ bản",
    levels: ["A1", "A2"] as const,
    description: "Câu và từ quen thuộc hằng ngày: chào hỏi, gia đình, mua sắm, thì đơn giản.",
  },
  {
    id: "b",
    label: "B1–B2",
    title: "Trung cấp",
    levels: ["B1", "B2"] as const,
    description: "Nội dung quen thuộc đến khá trừu tượng; mức gần với đề thi THPT.",
  },
  {
    id: "c",
    label: "C1–C2",
    title: "Nâng cao",
    levels: ["C1", "C2"] as const,
    description: "Văn bản dài, ý ngầm, từ vựng học thuật, cấu trúc phức tạp.",
  },
] as const;

export type BandId = (typeof BANDS)[number]["id"];
export type Band = (typeof BANDS)[number];

export function parseBand(value: string | null | undefined): Band | null {
  return BANDS.find((band) => band.id === value) ?? null;
}

// Diễn giải ngắn bằng tiếng Việt về từng bậc (tóm lược ý của thang CEFR, không phải trích nguyên văn).
export const LEVEL_SUMMARIES: Record<CefrLevel, string> = {
  A1: "Hiểu và dùng được những cách nói quen thuộc hằng ngày, giới thiệu bản thân, hỏi và trả lời thông tin rất đơn giản.",
  A2: "Hiểu câu và cách diễn đạt thông dụng về gia đình, mua sắm, công việc, nơi ở; trao đổi những việc quen thuộc, đơn giản.",
  B1: "Nắm ý chính của nội dung rõ ràng về công việc, học tập, giải trí; xử lý được hầu hết tình huống khi đi lại; viết văn bản đơn giản về chủ đề quen thuộc.",
  B2: "Hiểu ý chính của văn bản phức tạp, kể cả chuyên ngành của mình; giao tiếp khá lưu loát, tự nhiên; trình bày quan điểm và cân nhắc lợi hại.",
  C1: "Hiểu nhiều loại văn bản dài, đòi hỏi, nắm được ý ngầm; diễn đạt trôi chảy, linh hoạt cho mục đích xã hội, học thuật và công việc.",
  C2: "Hiểu gần như mọi thứ nghe hoặc đọc; tóm tắt, lập luận mạch lạc và diễn đạt chính xác, tinh tế cả trong tình huống phức tạp.",
};

export const LEVEL_SOURCE = "Đề theo trình độ CEFR";
// Đề theo trình độ dùng chung bảng exam_specification nhưng ẩn khỏi danh sách đề thi thử.
export const LEVEL_SPEC_STATUS = "level";

// Câu có sẵn của app (chương trình THPT) chưa có nhãn CEFR: ước lượng thô theo độ khó đã gán.
// Chỉ là ước lượng, không phải kết quả kiểm định.
export function heuristicCefr(difficulty: string): CefrLevel {
  if (difficulty === "hard") return "B2";
  if (difficulty === "medium") return "B1";
  return "A2";
}

export type LevelEstimate = {
  /** Mức ước lượng, ví dụ "B1" hoặc "Dưới B1". */
  level: string;
  advice: string;
  direction: "down" | "stay" | "up";
};

type PerLevel = { correct: number; total: number };

/**
 * Ước lượng từ kết quả theo từng mức của dải: đúng nhiều ở mức thấp mà yếu ở mức cao thì ở mức thấp;
 * đúng nhiều cả hai thì ở mức cao và nên thử dải kế tiếp.
 */
export function estimateLevel(band: Band, perLevel: Partial<Record<CefrLevel, PerLevel>>): LevelEstimate {
  const [low, high] = band.levels;
  const rate = (level: CefrLevel) => {
    const item = perLevel[level];
    return item && item.total > 0 ? item.correct / item.total : null;
  };
  const lowRate = rate(low);
  const highRate = rate(high);
  const known = [lowRate, highRate].filter((value): value is number => value !== null);
  const overall = known.length ? known.reduce((sum, value) => sum + value, 0) / known.length : 0;

  if (known.length === 0) return { level: "Chưa đủ dữ liệu", advice: "Chưa có câu nào được chấm.", direction: "stay" };
  if ((lowRate ?? overall) < 0.5) {
    return {
      level: `Dưới ${low}`,
      advice: band.id === "a" ? "Ôn lại từ vựng và ngữ pháp nền tảng rồi làm lại đề này." : "Nên làm đề dải thấp hơn trước, rồi quay lại.",
      direction: "down",
    };
  }
  if (highRate === null || highRate < 0.5) {
    return { level: low, advice: `Bạn vững mức ${low}. Luyện thêm rồi thử lại để lên ${high}.`, direction: "stay" };
  }
  if (highRate >= 0.8 && overall >= 0.8) {
    return { level: high, advice: `Bạn làm tốt cả hai mức. Có thể thử dải trình độ kế tiếp.`, direction: "up" };
  }
  return { level: `${low}+`, advice: `Bạn đã vượt ${low} và đang tiến tới ${high}. Tiếp tục luyện ở mức ${high}.`, direction: "stay" };
}
