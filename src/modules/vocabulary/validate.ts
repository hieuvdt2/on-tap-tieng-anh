// Kiểm tra từ do AI sinh ra trước khi lưu vào kho. Nghĩa phải là tiếng Việt, từ và ví dụ phải là
// tiếng Anh; không có bước này model yếu hay trả nghĩa bằng tiếng Anh hoặc ví dụ lẫn tiếng Việt.
const VIETNAMESE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

export type GeneratedWord = {
  word: string;
  wordClass: string;
  ipa?: string | null;
  meaningVi: string;
  example: string;
  note?: string | null;
};

export function headwordKey(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

export function wordIssues(item: GeneratedWord): string[] {
  const issues: string[] = [];
  const word = item.word.trim();
  if (!word || word.length > 40 || word.split(/\s+/).length > 4 || !/^[A-Za-z][A-Za-z\s'’-]*$/.test(word)) {
    issues.push("từ phải là tiếng Anh, tối đa 4 chữ, không có số hay ký tự lạ");
  }
  if (!VIETNAMESE.test(item.meaningVi)) issues.push("nghĩa phải viết bằng tiếng Việt");
  if (item.meaningVi.trim().length < 2 || item.meaningVi.length > 120) issues.push("nghĩa quá ngắn hoặc quá dài");
  if (VIETNAMESE.test(item.example) || item.example.trim().split(/\s+/).length < 4) {
    issues.push("câu ví dụ phải là một câu tiếng Anh");
  }
  if (VIETNAMESE.test(word)) issues.push("từ chứa ký tự tiếng Việt");
  return issues;
}
