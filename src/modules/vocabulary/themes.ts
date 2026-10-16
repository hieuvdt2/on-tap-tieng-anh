// Chủ đề của từ vựng (khác với "topic" của bài học). Từ không thuộc chủ đề nào có theme = null và
// hiện ở nhóm "Từ thông dụng khác" (slug "other" chỉ dùng trong URL/bộ lọc).
export const WORD_THEMES = [
  { slug: "family-people", label: "Gia đình & con người" },
  { slug: "body-health", label: "Cơ thể & sức khỏe" },
  { slug: "food-drink", label: "Ăn uống" },
  { slug: "home-things", label: "Nhà cửa & đồ dùng" },
  { slug: "clothes-fashion", label: "Quần áo & thời trang" },
  { slug: "travel-transport", label: "Du lịch & giao thông" },
  { slug: "nature-environment", label: "Thiên nhiên & môi trường" },
  { slug: "weather-time", label: "Thời tiết & thời gian" },
  { slug: "education", label: "Học tập & giáo dục" },
  { slug: "work-business", label: "Công việc & kinh doanh" },
  { slug: "money-shopping", label: "Tiền bạc & mua sắm" },
  { slug: "technology-media", label: "Công nghệ & truyền thông" },
  { slug: "sport-leisure", label: "Thể thao & giải trí" },
  { slug: "arts-culture", label: "Nghệ thuật & văn hóa" },
  { slug: "feelings-character", label: "Cảm xúc & tính cách" },
  { slug: "society-law", label: "Xã hội & pháp luật" },
  { slug: "science", label: "Khoa học & kỹ thuật" },
  { slug: "places-directions", label: "Địa điểm & phương hướng" },
] as const;

export type WordTheme = (typeof WORD_THEMES)[number]["slug"];

export const OTHER_THEME = "other";
export const OTHER_THEME_LABEL = "Từ thông dụng khác";

const SLUGS = new Set<string>(WORD_THEMES.map((theme) => theme.slug));

export function isWordTheme(value: string | null | undefined): value is WordTheme {
  return typeof value === "string" && SLUGS.has(value);
}

/** Bộ lọc từ URL: slug chủ đề, "other", hoặc trống = tất cả. Giá trị lạ coi như không lọc. */
export function parseThemeFilter(value: string | null | undefined): WordTheme | typeof OTHER_THEME | null {
  if (value === OTHER_THEME) return OTHER_THEME;
  return isWordTheme(value) ? value : null;
}

export function themeLabel(slug: string | null | undefined) {
  return WORD_THEMES.find((theme) => theme.slug === slug)?.label ?? OTHER_THEME_LABEL;
}

// Từ vựng theo bài học (topic) có sẵn được quy về chủ đề tương ứng; các chủ đề ngữ pháp-từ vựng
// (collocations, phrasal-verbs…) không có chủ đề riêng.
export const TOPIC_TO_THEME: Record<string, WordTheme> = {
  careers: "work-business",
  education: "education",
  environment: "nature-environment",
  health: "body-health",
  media: "technology-media",
  technology: "technology-media",
  community: "society-law",
  culture: "arts-culture",
};
