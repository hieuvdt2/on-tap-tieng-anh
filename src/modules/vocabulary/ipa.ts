// Đổi phiên âm ARPAbet của từ điển CMU (Mỹ) sang IPA kiểu từ điển Oxford/Cambridge bản Mỹ, có dấu
// trọng âm ˈ ˌ đặt trước âm tiết. Âm tiết chia theo quy tắc "phụ âm đầu dài nhất hợp lệ".
const VOWELS = new Set(["AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY", "OW", "OY", "UH", "UW"]);

const CONSONANTS: Record<string, string> = {
  B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "ɡ", HH: "h", JH: "dʒ", K: "k", L: "l", M: "m", N: "n",
  NG: "ŋ", P: "p", R: "r", S: "s", SH: "ʃ", T: "t", TH: "θ", V: "v", W: "w", Y: "j", Z: "z", ZH: "ʒ",
};

function vowelIpa(phone: string, stress: number): string {
  switch (phone) {
    case "AA": return "ɑː";
    case "AE": return "æ";
    case "AH": return stress === 0 ? "ə" : "ʌ";
    case "AO": return "ɔː";
    case "AW": return "aʊ";
    case "AY": return "aɪ";
    case "EH": return "e";
    case "ER": return stress === 0 ? "ər" : "ɜːr";
    case "EY": return "eɪ";
    case "IH": return "ɪ";
    case "IY": return stress === 0 ? "i" : "iː";
    case "OW": return "oʊ";
    case "OY": return "ɔɪ";
    case "UH": return "ʊ";
    case "UW": return "uː";
    default: return phone.toLowerCase();
  }
}

const ONSETS_2 = new Set([
  "P R", "P L", "B R", "B L", "T R", "D R", "K R", "K L", "G R", "G L", "F R", "F L", "TH R", "SH R",
  "S P", "S T", "S K", "S M", "S N", "S L", "S W", "T W", "K W", "P Y", "B Y", "T Y", "D Y", "K Y", "G Y",
  "F Y", "V Y", "M Y", "N Y", "L Y", "HH Y", "S Y", "Z Y", "TH Y",
]);
const ONSETS_3 = new Set(["S P R", "S P L", "S T R", "S K R", "S K W", "S P Y", "S T Y", "S K Y"]);

function validOnset(cluster: string[]): boolean {
  if (cluster.length === 0) return true;
  if (cluster.length === 1) return cluster[0] !== "NG";
  if (cluster.length === 2) return ONSETS_2.has(cluster.join(" "));
  if (cluster.length === 3) return ONSETS_3.has(cluster.join(" "));
  return false;
}

type Phone = { symbol: string; stress: number; vowel: boolean };

export function arpabetToIpa(arpabet: string): string {
  const phones: Phone[] = arpabet.split(/\s+/).map((token) => {
    const match = /^([A-Z]+)([012])?$/.exec(token);
    const symbol = match?.[1] ?? token;
    return { symbol, stress: match?.[2] ? Number(match[2]) : 0, vowel: VOWELS.has(symbol) };
  });
  const nuclei = phones.flatMap((phone, index) => (phone.vowel ? [index] : []));
  if (nuclei.length === 0) return phones.map((p) => CONSONANTS[p.symbol] ?? "").join("");

  // Ranh giới âm tiết: với cụm phụ âm giữa hai nguyên âm, phần đuôi hợp lệ dài nhất làm phụ âm đầu của âm tiết sau.
  const starts: number[] = [0];
  for (let i = 0; i < nuclei.length - 1; i += 1) {
    const cluster = phones.slice(nuclei[i] + 1, nuclei[i + 1]).map((p) => p.symbol);
    let take = Math.min(3, cluster.length);
    while (take > 0 && !validOnset(cluster.slice(cluster.length - take))) take -= 1;
    starts.push(nuclei[i + 1] - take);
  }
  const syllables = starts.map((start, i) => phones.slice(start, i + 1 < starts.length ? starts[i + 1] : phones.length));
  const multi = syllables.length > 1;

  return syllables
    .map((syllable) => {
      const nucleus = syllable.find((p) => p.vowel);
      const mark = multi && nucleus ? (nucleus.stress === 1 ? "ˈ" : nucleus.stress === 2 ? "ˌ" : "") : "";
      const body = syllable.map((p) => (p.vowel ? vowelIpa(p.symbol, p.stress) : (CONSONANTS[p.symbol] ?? ""))).join("");
      return mark + body;
    })
    .join("");
}
