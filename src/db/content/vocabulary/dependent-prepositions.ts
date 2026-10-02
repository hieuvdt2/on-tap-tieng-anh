import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const dependentPrepositions: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-dependent-prepositions",
  slug: "dependent-prepositions",
  name: "Dependent Prepositions",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Giới từ cố định đi sau tính từ hoặc động từ (interested in, depend on, good at); chọn giới từ khớp cụm, không dịch từng từ.",
  overview:
    "Nhiều tính từ và động từ “kéo” theo một giới từ nhất định. Học theo cụm: “interested in”, “afraid of”, “responsible for”, “apologize for”, “succeed in”. Sai giới từ thường làm câu nghe không tự nhiên dù nghĩa gần đúng. Khi làm bài, nhìn từ đứng trước chỗ trống (tính từ/động từ) rồi chọn giới từ thuộc cụm đó; đừng chọn theo nghĩa tiếng Việt từng chữ.",
  items: [
    {
      word: "interested in",
      meaningVi: "quan tâm tới, thích",
      wordClass: "adjective + preposition",
      example: "She is interested in marine biology.",
      note: "interested in + danh từ/gerund. Không dùng “interested on”.",
    },
    {
      word: "depend on",
      meaningVi: "phụ thuộc vào; tin vào",
      wordClass: "verb + preposition",
      example: "Success depends on regular practice.",
      note: "Cũng viết “depend upon” (trang trọng hơn). Không dùng “depend of”.",
    },
    {
      word: "good at",
      meaningVi: "giỏi về",
      wordClass: "adjective + preposition",
      example: "He is good at solving puzzles.",
      note: "good at + danh từ/gerund. “good in” ít chuẩn hơn trong nghĩa kỹ năng.",
    },
    {
      word: "afraid of",
      meaningVi: "sợ",
      wordClass: "adjective + preposition",
      example: "Many children are afraid of the dark.",
      note: "afraid of + danh từ/gerund. Khác “afraid to” + động từ nguyên mẫu khi nói không dám làm.",
    },
    {
      word: "responsible for",
      meaningVi: "chịu trách nhiệm về",
      wordClass: "adjective + preposition",
      example: "Who is responsible for locking the lab?",
      note: "responsible for + danh từ/gerund. “responsible of” là sai.",
    },
    {
      word: "apologize for",
      meaningVi: "xin lỗi vì",
      wordClass: "verb + preposition",
      example: "He apologized for being late.",
      note: "apologize for + danh từ/gerund. apologize to + người.",
    },
    {
      word: "similar to",
      meaningVi: "tương tự với",
      wordClass: "adjective + preposition",
      example: "This design is similar to the old one.",
      note: "Đối lập với “different from” (hoặc “different to” ở một số biến thể Anh).",
    },
    {
      word: "insist on",
      meaningVi: "khăng khăng đòi / nhất quyết",
      wordClass: "verb + preposition",
      example: "She insisted on paying for lunch.",
      note: "insist on + danh từ/gerund. Không dùng “insist to”.",
    },
  ],
  collocations: [
    {
      phrase: "interested in + gerund",
      meaningVi: "thích / quan tâm đến việc gì",
      example: "Are you interested in joining the club?",
    },
    {
      phrase: "depend on someone/something",
      meaningVi: "phụ thuộc vào ai/cái gì",
      example: "We depend on public transport to get to school.",
    },
    {
      phrase: "good at + skill",
      meaningVi: "giỏi một kỹ năng",
      example: "Linh is good at public speaking.",
    },
    {
      phrase: "responsible for + duty",
      meaningVi: "chịu trách nhiệm một nhiệm vụ",
      example: "The monitor is responsible for collecting homework.",
    },
    {
      phrase: "apologize for + mistake",
      meaningVi: "xin lỗi vì lỗi gì",
      example: "She apologized for the delay.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I am interested on history.",
      right: "I am interested in history.",
      why: "Cụm cố định là “interested in”, không phải “interested on”.",
    },
    {
      wrong: "The result depends of the weather.",
      right: "The result depends on the weather.",
      why: "Sau “depend” dùng “on” (hoặc “upon”), không dùng “of”.",
    },
    {
      wrong: "He apologized to being late.",
      right: "He apologized for being late.",
      why: "Xin lỗi vì việc gì dùng “for”; “to” đi với người: “apologize to the teacher”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "dpr-1",
      difficulty: "easy",
      stem: "My sister is very interested ___ photography.",
      choices: { a: "in", b: "on", c: "at", d: "for" },
      answer: "a",
      explanation:
        "Cụm cố định là “interested in”. Ví dụ: “He is interested in ancient history.”",
      whyWrong: {
        b: "“interested on” sai; “on” đúng với cụm khác như “keen on” hoặc “depend on”.",
        c: "“interested at” sai; “at” đúng với “good at” hoặc “angry at”.",
        d: "“interested for” sai; “for” đúng với “responsible for” hoặc “sorry for”.",
      },
    }),
    mcq({
      id: "dpr-2",
      difficulty: "easy",
      stem: "Whether we go hiking will depend ___ the weather.",
      choices: { a: "on", b: "of", c: "in", d: "at" },
      answer: "a",
      explanation:
        "“depend on” = phụ thuộc vào. Ví dụ: “Your grade depends on consistent revision.”",
      whyWrong: {
        b: "“depend of” sai; “of” đúng với cụm như “afraid of” hoặc “proud of”.",
        c: "“depend in” sai; “in” đúng với “interested in” hoặc “succeed in”.",
        d: "“depend at” sai; “at” đúng với “good at” hoặc “surprised at”.",
      },
    }),
    mcq({
      id: "dpr-3",
      difficulty: "easy",
      stem: "Nam is good ___ maths, especially geometry.",
      choices: { a: "at", b: "in", c: "on", d: "with" },
      answer: "a",
      explanation:
        "Giỏi về kỹ năng/môn học → “good at”. Ví dụ: “She is good at explaining ideas clearly.”",
      whyWrong: {
        b: "“good in” ít chuẩn khi nói kỹ năng; “in” đúng hơn với “interested in” hoặc “succeed in”.",
        c: "“good on” không phải cụm chuẩn cho kỹ năng; “on” đúng với “keen on” hoặc “depend on”.",
        d: "“good with” dùng khi nói khéo với người/công cụ, đúng kiểu “good with children”, không phải môn học ở đây.",
      },
    }),
    mcq({
      id: "dpr-4",
      difficulty: "easy",
      stem: "Many people are afraid ___ speaking in public.",
      choices: { a: "of", b: "from", c: "to", d: "about" },
      answer: "a",
      explanation:
        "“afraid of” + gerund/danh từ. Ví dụ: “He is afraid of flying.”",
      whyWrong: {
        b: "“afraid from” sai; “from” đúng với “different from” hoặc “suffer from”.",
        c: "“afraid to” đi với động từ nguyên mẫu khi nói không dám làm: “afraid to ask”, không khớp gerund “speaking” ở đây.",
        d: "“afraid about” không chuẩn; “about” đúng với “worried about” hoặc “excited about”.",
      },
    }),
    mcq({
      id: "dpr-5",
      difficulty: "medium",
      stem: "Who is responsible ___ preparing the slides?",
      choices: { a: "for", b: "of", c: "to", d: "with" },
      answer: "a",
      explanation:
        "“responsible for” + việc phải làm. Ví dụ: “She is responsible for checking attendance.”",
      whyWrong: {
        b: "“responsible of” sai; “of” đúng với “proud of” hoặc “capable of”.",
        c: "“responsible to” dùng khi nói chịu trách nhiệm trước ai (cấp trên), đúng kiểu “responsible to the board”, không phải trước gerund nhiệm vụ.",
        d: "“responsible with” không chuẩn; “with” đúng với “satisfied with” hoặc “busy with”.",
      },
    }),
    mcq({
      id: "dpr-6",
      difficulty: "medium",
      stem: "He apologized ___ interrupting the speaker.",
      choices: { a: "for", b: "to", c: "about", d: "on" },
      answer: "a",
      explanation:
        "Xin lỗi vì hành động → “apologize for”. Ví dụ: “They apologized for the mistake in the report.”",
      whyWrong: {
        b: "“apologize to” đi với người nhận lời xin lỗi: “apologize to the speaker”, không đứng trước gerund việc đã làm.",
        c: "“apologize about” kém chuẩn; “about” đúng hơn với “complain about” hoặc “talk about”.",
        d: "“apologize on” sai; “on” đúng với “insist on” hoặc “depend on”.",
      },
    }),
    mcq({
      id: "dpr-7",
      difficulty: "medium",
      stem: "This new logo is quite similar ___ the previous one.",
      choices: { a: "to", b: "with", c: "from", d: "as" },
      answer: "a",
      explanation:
        "“similar to” = tương tự với. Ví dụ: “Her answer was similar to mine.”",
      whyWrong: {
        b: "“similar with” sai; “with” đúng với “compare with” hoặc “satisfied with”.",
        c: "“similar from” sai; “from” đúng với “different from”.",
        d: "“similar as” sai; “as” đúng trong so sánh “as ... as” hoặc “the same as”.",
      },
    }),
    mcq({
      id: "dpr-8",
      difficulty: "medium",
      stem: "The coach insisted ___ starting practice on time.",
      choices: { a: "on", b: "in", c: "to", d: "for" },
      answer: "a",
      explanation:
        "“insist on” + gerund = nhất quyết đòi. Ví dụ: “Mum insisted on driving us to school.”",
      whyWrong: {
        b: "“insist in” sai; “in” đúng với “succeed in” hoặc “believe in”.",
        c: "“insist to” sai; sau “insist” không dùng “to + V” theo kiểu này.",
        d: "“insist for” sai; “for” đúng với “apologize for” hoặc “wait for”.",
      },
    }),
    mcq({
      id: "dpr-9",
      difficulty: "hard",
      stem: "The two plans differ ___ several important details.",
      choices: { a: "in", b: "from", c: "with", d: "on" },
      answer: "a",
      explanation:
        "“differ in” + khía cạnh khác nhau. Ví dụ: “The twins differ in personality.” Cặp “differ from” dùng khi nói A khác B: “This plan differs from that one.”",
      whyWrong: {
        b: "“differ from” đúng khi theo sau là đối tượng bị so sánh (“differs from the old plan”), không phải danh sách chi tiết khác nhau.",
        c: "“differ with” đôi khi dùng cho bất đồng ý kiến với người, đúng kiểu “differ with a colleague”, không khớp “details”.",
        d: "“differ on” có thể dùng với chủ đề tranh luận (“differ on policy”), kém tự nhiên với “details” hơn “differ in”.",
      },
    }),
    mcq({
      id: "dpr-10",
      difficulty: "hard",
      stem: "She congratulated him ___ winning the debate contest.",
      choices: { a: "on", b: "for", c: "about", d: "with" },
      answer: "a",
      explanation:
        "“congratulate someone on” + thành tích. Ví dụ: “We congratulated her on her promotion.”",
      whyWrong: {
        b: "“congratulate for” kém chuẩn trong tiếng Anh học thuật/thi; “for” đúng với “thank for” hoặc “apologize for”.",
        c: "“congratulate about” sai; “about” đúng với “excited about” hoặc “ask about”.",
        d: "“congratulate with” sai; “with” đúng với “provide with” hoặc “agree with”.",
      },
    }),
    mcq({
      id: "dpr-11",
      difficulty: "hard",
      stem: "The committee objected ___ changing the schedule without notice.",
      choices: { a: "to", b: "against", c: "for", d: "at" },
      answer: "a",
      explanation:
        "“object to” + danh từ/gerund = phản đối. Ví dụ: “Parents objected to the fee increase.”",
      whyWrong: {
        b: "“object against” sai vì “object” đã mang nghĩa phản đối; “against” đúng với “fight against” hoặc “protect against”.",
        c: "“object for” sai; “for” đúng với “vote for” hoặc “apply for”.",
        d: "“object at” sai; “at” đúng với “surprised at” hoặc “laugh at”.",
      },
    }),
    mcq({
      id: "dpr-12",
      difficulty: "hard",
      stem: "I am not accustomed ___ waking up before dawn.",
      choices: { a: "to", b: "with", c: "at", d: "for" },
      answer: "a",
      explanation:
        "“accustomed to” + danh từ/gerund = quen với. Ví dụ: “He is accustomed to working night shifts.”",
      whyWrong: {
        b: "“accustomed with” sai; “with” đúng với “familiar with” (gần nghĩa nhưng cụm khác).",
        c: "“accustomed at” sai; “at” đúng với “good at” hoặc “amazed at”.",
        d: "“accustomed for” sai; “for” đúng với “ready for” hoặc “famous for”.",
      },
    }),
  ],
};
