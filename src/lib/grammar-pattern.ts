export type GrammarRole = "subject" | "verb" | "helper" | "negation";

export type GrammarTerm = {
  key: string;
  role: GrammarRole;
  name: string;
  hint: string;
};

export const grammarTerms: GrammarTerm[] = [
  {
    key: "chủ ngữ",
    role: "subject",
    name: "Chủ ngữ",
    hint: "Người hoặc vật được nói tới trong câu. Trong công thức, chủ ngữ đứng trước động từ ở câu khẳng định.",
  },
  {
    key: "v quá khứ",
    role: "verb",
    name: "V quá khứ",
    hint: "Động từ ở thì quá khứ đơn. Động từ có quy tắc thêm -ed. Động từ bất quy tắc dùng dạng riêng, như see thành saw.",
  },
  {
    key: "v-ing",
    role: "verb",
    name: "V-ing",
    hint: "Động từ thêm -ing. Bỏ -e cuối rồi thêm -ing nếu động từ tận cùng bằng e câm: write thành writing. Gấp đôi phụ âm cuối khi cần: run thành running.",
  },
  {
    key: "v-ed",
    role: "verb",
    name: "V-ed",
    hint: "Quá khứ của động từ có quy tắc. Thêm -ed: play thành played. Tận cùng -e chỉ thêm -d: live thành lived.",
  },
  {
    key: "v-s",
    role: "verb",
    name: "V-s",
    hint: "Động từ hiện tại đơn với he, she, it. Thêm -s với hầu hết động từ: work thành works. Thêm -es khi tận cùng s, x, z, ch, sh, o: watch thành watches, go thành goes. Phụ âm + y thì đổi y thành i rồi thêm -es: study thành studies.",
  },
  {
    key: "do/does/did",
    role: "helper",
    name: "do / does / did",
    hint: "Trợ động từ. does cho he, she, it ở hiện tại. do cho các ngôi còn lại ở hiện tại. did cho mọi ngôi ở quá khứ. Động từ chính phía sau về nguyên mẫu.",
  },
  {
    key: "do/does",
    role: "helper",
    name: "do / does",
    hint: "Trợ động từ của hiện tại đơn. does đi với he, she, it. do đi với I, you, we, they. Khi đã có do hoặc does, động từ chính về dạng nguyên mẫu.",
  },
  {
    key: "can/could/should",
    role: "helper",
    name: "can / could / should",
    hint: "Động từ khuyết thiếu. Phía sau luôn là động từ nguyên mẫu, không thêm -s hay to.",
  },
  {
    key: "must/have to/might",
    role: "helper",
    name: "must / have to / might",
    hint: "must là bắt buộc. have to cũng là bắt buộc nhưng chia theo ngôi. might là khả năng không chắc. Cả ba đi với động từ nguyên mẫu.",
  },
  {
    key: "động từ nguyên mẫu",
    role: "verb",
    name: "Động từ nguyên mẫu",
    hint: "Động từ chưa chia, không thêm -s, -ed hay -ing. Ví dụ: go, watch, study.",
  },
  {
    key: "am/is/are",
    role: "helper",
    name: "am / is / are",
    hint: "Động từ be ở hiện tại. I đi với am, he/she/it đi với is, you/we/they đi với are.",
  },
  {
    key: "was/were",
    role: "helper",
    name: "was / were",
    hint: "Động từ be ở quá khứ. I, he, she, it đi với was. You, we, they đi với were.",
  },
  {
    key: "have/has",
    role: "helper",
    name: "have / has",
    hint: "Trợ động từ của hiện tại hoàn thành. has đi với he, she, it. have đi với các ngôi còn lại. Phía sau là V3.",
  },
  {
    key: "going to",
    role: "helper",
    name: "going to",
    hint: "Dự định đã có từ trước hoặc kết quả nhìn thấy trước. Phía sau là động từ nguyên mẫu: is going to rain.",
  },
  {
    key: "động từ",
    role: "verb",
    name: "Động từ",
    hint: "Verb: từ chỉ hành động hoặc trạng thái. Trong công thức, đây là vị trí cần chia đúng thì.",
  },
  {
    key: "danh từ",
    role: "subject",
    name: "Danh từ",
    hint: "Noun: từ chỉ người, vật, nơi chốn hoặc ý tưởng. Có thể đếm được hoặc không đếm được.",
  },
  {
    key: "cannot",
    role: "negation",
    name: "cannot",
    hint: "Phủ định của can, viết liền. Phía sau là động từ nguyên mẫu.",
  },
  {
    key: "could",
    role: "helper",
    name: "could",
    hint: "Quá khứ hoặc dạng lịch sự của can. Phía sau là động từ nguyên mẫu.",
  },
  {
    key: "should",
    role: "helper",
    name: "should",
    hint: "Lời khuyên. Phía sau là động từ nguyên mẫu, không thêm to.",
  },
  {
    key: "have to",
    role: "helper",
    name: "have to",
    hint: "Bắt buộc do hoàn cảnh. have to chia thành has to với he, she, it. Phủ định do not have to nghĩa là không cần thiết.",
  },
  {
    key: "v2",
    role: "verb",
    name: "V2",
    hint: "Cột quá khứ đơn trong bảng động từ. Động từ có quy tắc trùng với V-ed. Động từ bất quy tắc có dạng riêng.",
  },
  {
    key: "v3",
    role: "verb",
    name: "V3",
    hint: "Quá khứ phân từ, cột thứ ba trong bảng động từ. Dùng sau have, has, had hoặc trong câu bị động.",
  },
  {
    key: "does",
    role: "helper",
    name: "does",
    hint: "Trợ động từ hiện tại đơn cho he, she, it. Động từ chính phía sau giữ nguyên mẫu.",
  },
  {
    key: "were",
    role: "helper",
    name: "were",
    hint: "Dạng quá khứ của be cho you, we, they. Trong câu điều kiện loại 2, If I were dùng were cho mọi ngôi.",
  },
  {
    key: "was",
    role: "helper",
    name: "was",
    hint: "Dạng quá khứ của be cho I, he, she, it.",
  },
  {
    key: "are",
    role: "helper",
    name: "are",
    hint: "Dạng hiện tại của be cho you, we, they.",
  },
  {
    key: "is",
    role: "helper",
    name: "is",
    hint: "Dạng hiện tại của be cho he, she, it.",
  },
  {
    key: "am",
    role: "helper",
    name: "am",
    hint: "Dạng hiện tại của be cho I.",
  },
  {
    key: "do",
    role: "helper",
    name: "do",
    hint: "Trợ động từ hiện tại đơn cho I, you, we, they. Khi đã có do, động từ chính về dạng nguyên mẫu.",
  },
  {
    key: "did",
    role: "helper",
    name: "did",
    hint: "Trợ động từ của quá khứ đơn, dùng trong câu phủ định và câu hỏi. Động từ chính phía sau về nguyên mẫu.",
  },
  {
    key: "had",
    role: "helper",
    name: "had",
    hint: "Trợ động từ của quá khứ hoàn thành, đi với mọi ngôi. Phía sau là V3.",
  },
  {
    key: "would",
    role: "helper",
    name: "would",
    hint: "Động từ khuyết thiếu, thường là kết quả của câu điều kiện loại 2. Phía sau là động từ nguyên mẫu.",
  },
  {
    key: "will",
    role: "helper",
    name: "will",
    hint: "Trợ động từ tương lai. Phía sau là động từ nguyên mẫu, không thêm -s.",
  },
  {
    key: "must",
    role: "helper",
    name: "must",
    hint: "Động từ khuyết thiếu chỉ việc bắt buộc hoặc suy đoán chắc. Phía sau là động từ nguyên mẫu.",
  },
  {
    key: "might",
    role: "helper",
    name: "might",
    hint: "Động từ khuyết thiếu chỉ khả năng không chắc. Phía sau là động từ nguyên mẫu.",
  },
  {
    key: "not",
    role: "negation",
    name: "not",
    hint: "Từ phủ định. Đứng sau trợ động từ hoặc sau be, không đứng ngay sau động từ thường.",
  },
  {
    key: "be",
    role: "helper",
    name: "be",
    hint: "Động từ be ở dạng nguyên mẫu. Trong câu bị động, be được chia theo thì rồi cộng V3.",
  },
  {
    key: "if",
    role: "helper",
    name: "if",
    hint: "Từ mở mệnh đề điều kiện. Loại 1 dùng hiện tại đơn sau if. Loại 2 dùng dạng quá khứ sau if.",
  },
  {
    key: "v",
    role: "verb",
    name: "V",
    hint: "V là viết tắt của verb, động từ nguyên mẫu. Không thêm -s, -ed hay -ing. Ví dụ: go, watch, study.",
  },
  {
    key: "s",
    role: "subject",
    name: "S",
    hint: "S là viết tắt của subject, tức chủ ngữ: người hoặc vật được nói tới trong câu.",
  },
];

export type PatternPiece = {
  text: string;
  term: GrammarTerm | null;
};

const orderedTerms = [...grammarTerms].sort((left, right) => right.key.length - left.key.length);

function boundaryAllows(input: string, start: number, length: number, key: string) {
  if (/[à-ỹ]/i.test(key)) return true;
  const before = start === 0 ? "" : input[start - 1];
  const after = input[start + length] ?? "";
  const letter = /[A-Za-z]/;
  if (before && letter.test(before)) return false;
  if (after && letter.test(after)) return false;
  if (after === "-" && (key === "v" || key === "s")) return false;
  return true;
}

export function tokenizePattern(input: string): PatternPiece[] {
  const pieces: PatternPiece[] = [];
  let plain = "";
  let index = 0;

  while (index < input.length) {
    const match = orderedTerms.find((term) => {
      const slice = input.slice(index, index + term.key.length);
      return slice.toLowerCase() === term.key && boundaryAllows(input, index, term.key.length, term.key);
    });

    if (!match) {
      plain += input[index];
      index += 1;
      continue;
    }

    if (plain) {
      pieces.push({ text: plain, term: null });
      plain = "";
    }
    pieces.push({ text: input.slice(index, index + match.key.length), term: match });
    index += match.key.length;
  }

  if (plain) pieces.push({ text: plain, term: null });
  return pieces;
}

export function patternHasVerbS(patterns: string[]) {
  return patterns.some((pattern) =>
    tokenizePattern(pattern).some((piece) => piece.term?.key === "v-s"),
  );
}
