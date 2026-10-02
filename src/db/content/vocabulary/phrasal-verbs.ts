import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const phrasalVerbs: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-phrasal-verbs",
  slug: "phrasal-verbs",
  name: "Phrasal Verbs",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Động từ kèm tiểu từ (up, off, out, down…) tạo nghĩa mới; chọn đúng cụm hoặc tiểu từ khớp ngữ cảnh câu.",
  overview:
    "Phrasal verb = động từ + tiểu từ (và đôi khi giới từ). Nghĩa thường không suy ra từ từng từ riêng: “give up” là bỏ cuộc, không phải “đưa lên”. Một số cụm tách được (“put the meeting off” / “put off the meeting”); một số không tách (“look after the kids”). Khi làm bài, đọc cả câu: dấu hiệu thời gian, mục đích và tân ngữ giúp chọn đúng particle hoặc đúng cụm.",
  items: [
    {
      word: "look up",
      meaningVi: "tra cứu (từ, thông tin)",
      wordClass: "phrasal verb",
      example: "I looked up the new word in the dictionary.",
      note: "Tách được: look it up. Tân ngữ là thông tin cần tra.",
    },
    {
      word: "give up",
      meaningVi: "bỏ cuộc; từ bỏ thói quen",
      wordClass: "phrasal verb",
      example: "She gave up sugar last month.",
      note: "give up + danh từ/gerund: give up smoking.",
    },
    {
      word: "put off",
      meaningVi: "hoãn lại",
      wordClass: "phrasal verb",
      example: "They put off the trip because of the rain.",
      note: "Tách được: put it off. Khác put on (mặc/bật).",
    },
    {
      word: "turn down",
      meaningVi: "từ chối; vặn nhỏ (âm lượng)",
      wordClass: "phrasal verb",
      example: "He turned down the job offer.",
      note: "Nghĩa “từ chối” thường đi với offer, invitation, request.",
    },
    {
      word: "run out of",
      meaningVi: "hết (cái gì đó)",
      wordClass: "phrasal verb",
      example: "We have run out of milk.",
      note: "run out of + danh từ. Chủ ngữ thường là người/chúng ta đang hết thứ gì.",
    },
    {
      word: "get along with",
      meaningVi: "hòa hợp, hợp nhau với ai",
      wordClass: "phrasal verb",
      example: "She gets along with her classmates well.",
      note: "with + người. Không tách “along” khỏi “get” theo kiểu get with along.",
    },
    {
      word: "bring up",
      meaningVi: "nuôi dạy; nêu ra (chủ đề)",
      wordClass: "phrasal verb",
      example: "Please don’t bring up that argument again.",
      note: "Trong ngữ cảnh họp/thảo luận thường nghĩa “nêu ra”.",
    },
    {
      word: "take after",
      meaningVi: "giống (bố/mẹ…) về tính cách hoặc ngoại hình",
      wordClass: "phrasal verb",
      example: "He takes after his father.",
      note: "Không tách. Khác take over (tiếp quản).",
    },
  ],
  collocations: [
    {
      phrase: "look up a word",
      meaningVi: "tra một từ",
      example: "If you forget the spelling, look up the word online.",
    },
    {
      phrase: "give up smoking",
      meaningVi: "bỏ hút thuốc",
      example: "His doctor advised him to give up smoking.",
    },
    {
      phrase: "put off a meeting",
      meaningVi: "hoãn cuộc họp",
      example: "We had to put off the meeting until Friday.",
    },
    {
      phrase: "turn down an offer",
      meaningVi: "từ chối một lời đề nghị",
      example: "She turned down the offer to work abroad.",
    },
    {
      phrase: "run out of time",
      meaningVi: "hết thời gian",
      example: "I ran out of time before finishing the last question.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I looked the word in the dictionary.",
      right: "I looked up the word in the dictionary.",
      why: "Thiếu tiểu từ “up”. “look” một mình không mang nghĩa “tra cứu”.",
    },
    {
      wrong: "They put the meeting on because of the storm.",
      right: "They put the meeting off because of the storm.",
      why: "Hoãn lại dùng “put off”. “put on” nghĩa mặc/bật, không phải hoãn.",
    },
    {
      wrong: "We ran out milk this morning.",
      right: "We ran out of milk this morning.",
      why: "Cụm đầy đủ là “run out of” + danh từ; thiếu “of” là sai.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "phv-1",
      difficulty: "easy",
      stem: "I don’t know this word. Can you help me look it ___?",
      choices: { a: "up", b: "after", c: "down", d: "over" },
      answer: "a",
      explanation:
        "“look up” nghĩa tra cứu. Tân ngữ “it” đứng giữa: “look it up”. Ví dụ: “She looked up the address on her phone.”",
      whyWrong: {
        b: "“look after” nghĩa chăm sóc, đúng khi nói “look after the baby”, không phải tra từ.",
        c: "“look down” thường là nhìn xuống hoặc coi thường (“look down on”), không phải tra cứu.",
        d: "“look over” nghĩa xem qua nhanh, đúng kiểu “look over the essay”, không khớp nghĩa tra từ điển.",
      },
    }),
    mcq({
      id: "phv-2",
      difficulty: "easy",
      stem: "Don’t ___ now. You have almost finished the puzzle.",
      choices: {
        a: "give up",
        b: "give in to",
        c: "take after",
        d: "turn down",
      },
      answer: "a",
      explanation:
        "Ngữ cảnh “almost finished” gợi ý đừng bỏ cuộc → “give up”. Ví dụ: “He refused to give up, even when the task was hard.”",
      whyWrong: {
        b: "“give in to” nghĩa nhượng bộ trước áp lực, đúng kiểu “give in to pressure”, không phải bỏ dở việc đang làm.",
        c: "“take after” nghĩa giống bố/mẹ, đúng kiểu “She takes after her mother.”",
        d: "“turn down” nghĩa từ chối hoặc vặn nhỏ, đúng kiểu “turn down an offer”.",
      },
    }),
    mcq({
      id: "phv-3",
      difficulty: "easy",
      stem: "We had to ___ the picnic because of heavy rain.",
      choices: { a: "put off", b: "put on", c: "put up", d: "put out" },
      answer: "a",
      explanation:
        "Hoãn sự kiện vì mưa → “put off”. Ví dụ: “They put off the concert until next week.”",
      whyWrong: {
        b: "“put on” nghĩa mặc hoặc bật (đèn/nhạc), đúng kiểu “put on a jacket”.",
        c: "“put up” có thể nghĩa treo hoặc cho ở nhờ, đúng kiểu “put up a poster” hoặc “put someone up”.",
        d: "“put out” nghĩa dập tắt hoặc làm phiền, đúng kiểu “put out the fire”.",
      },
    }),
    mcq({
      id: "phv-4",
      difficulty: "easy",
      stem: "She ___ the invitation because she was busy that weekend.",
      choices: {
        a: "turned down",
        b: "turned up",
        c: "turned on",
        d: "turned into",
      },
      answer: "a",
      explanation:
        "Từ chối lời mời → “turn down”. Ví dụ: “He turned down the scholarship for personal reasons.”",
      whyWrong: {
        b: "“turn up” nghĩa xuất hiện hoặc tăng (âm lượng), đúng kiểu “He turned up late.”",
        c: "“turn on” nghĩa bật thiết bị, đúng kiểu “turn on the light”.",
        d: "“turn into” nghĩa biến thành, đúng kiểu “The discussion turned into an argument.”",
      },
    }),
    mcq({
      id: "phv-5",
      difficulty: "medium",
      stem: "Hurry up! We are ___ of time before the exam ends.",
      choices: {
        a: "running out",
        b: "giving up",
        c: "putting off",
        d: "looking after",
      },
      answer: "a",
      explanation:
        "“run out of time” = hết thời gian. Ở đây chỗ trống cần “running out” để khớp “of time”. Ví dụ: “They ran out of ideas during the debate.”",
      whyWrong: {
        b: "“giving up of time” không tồn tại; “give up” nghĩa bỏ cuộc, đúng kiểu “give up the race”.",
        c: "“putting off of time” sai cụm; “put off” nghĩa hoãn, đúng kiểu “put off a deadline”.",
        d: "“looking after of time” sai; “look after” nghĩa chăm sóc người/vật.",
      },
    }),
    mcq({
      id: "phv-6",
      difficulty: "medium",
      stem: "My little brother ___ my father: both are calm and patient.",
      choices: {
        a: "takes after",
        b: "takes over",
        c: "takes off",
        d: "takes up",
      },
      answer: "a",
      explanation:
        "Giống bố về tính cách → “take after”. Ví dụ: “Mia takes after her grandmother in her love of music.”",
      whyWrong: {
        b: "“take over” nghĩa tiếp quản, đúng kiểu “She took over the family business.”",
        c: "“take off” nghĩa cất cánh hoặc cởi ra, đúng kiểu “The plane took off” hoặc “take off your coat”.",
        d: "“take up” nghĩa bắt đầu sở thích/chiếm thời gian, đúng kiểu “He took up tennis last year.”",
      },
    }),
    mcq({
      id: "phv-7",
      difficulty: "medium",
      stem: "Please don’t ___ that old argument again during dinner.",
      choices: {
        a: "bring up",
        b: "bring about",
        c: "bring down",
        d: "bring in",
      },
      answer: "a",
      explanation:
        "Nêu lại chủ đề cũ → “bring up”. Ví dụ: “Who brought up the budget problem in the meeting?”",
      whyWrong: {
        b: "“bring about” nghĩa gây ra kết quả, đúng kiểu “The reform brought about big changes.”",
        c: "“bring down” nghĩa hạ xuống hoặc làm sụp đổ, đúng kiểu “bring down prices”.",
        d: "“bring in” nghĩa đưa vào/thu về, đúng kiểu “bring in new rules” hoặc “bring in profits”.",
      },
    }),
    mcq({
      id: "phv-8",
      difficulty: "medium",
      stem: "Do you ___ your new roommate? You two seem friendly.",
      choices: {
        a: "get along with",
        b: "get over with",
        c: "get away with",
        d: "get through with",
      },
      answer: "a",
      explanation:
        "Hòa hợp với ai → “get along with”. Ví dụ: “I get along with my teammates very well.”",
      whyWrong: {
        b: "Không có cụm chuẩn “get over with” theo nghĩa hòa hợp; “get over” nghĩa vượt qua (bệnh/buồn).",
        c: "“get away with” nghĩa thoát tội/không bị phạt, đúng kiểu “He got away with cheating.”",
        d: "“get through with” gần nghĩa hoàn tất việc gì, đúng kiểu “get through with homework”, không phải hòa hợp.",
      },
    }),
    mcq({
      id: "phv-9",
      difficulty: "hard",
      stem: "The manager asked us to ___ the report until we had clearer data.",
      choices: { a: "hold off on", b: "hold on to", c: "hold up with", d: "hold out for" },
      answer: "a",
      explanation:
        "Hoãn/chờ chưa làm việc gì → “hold off on”. Ví dụ: “Let’s hold off on buying tickets until prices drop.”",
      whyWrong: {
        b: "“hold on to” nghĩa giữ chặt/không buông, đúng kiểu “Hold on to the railing.”",
        c: "“hold up with” không phải cụm chuẩn; “hold up” thường nghĩa làm chậm hoặc cướp.",
        d: "“hold out for” nghĩa khăng khăng đòi điều kiện tốt hơn, đúng kiểu “hold out for a higher salary”.",
      },
    }),
    mcq({
      id: "phv-10",
      difficulty: "hard",
      stem: "After weeks of training, her hard work finally ___.",
      choices: {
        a: "paid off",
        b: "paid up",
        c: "paid back",
        d: "paid into",
      },
      answer: "a",
      explanation:
        "Nỗ lực mang lại kết quả tốt → “pay off”. Ví dụ: “All those late nights paid off when she passed the exam.”",
      whyWrong: {
        b: "“pay up” nghĩa trả hết số tiền nợ, đúng kiểu “He finally paid up.”",
        c: "“pay back” nghĩa trả lại tiền đã mượn, đúng kiểu “I’ll pay you back tomorrow.”",
        d: "“pay into” nghĩa chuyển tiền vào tài khoản, đúng kiểu “pay into a savings account”.",
      },
    }),
    mcq({
      id: "phv-11",
      difficulty: "hard",
      stem: "The company decided to ___ production of the old model.",
      choices: {
        a: "phase out",
        b: "phase in",
        c: "phase over",
        d: "phase through",
      },
      answer: "a",
      explanation:
        "Ngừng dần sản xuất mẫu cũ → “phase out”. Ví dụ: “Schools will phase out paper textbooks over five years.”",
      whyWrong: {
        b: "“phase in” nghĩa đưa vào dần, đúng kiểu “phase in a new policy”, ngược với dừng dần.",
        c: "Không có cụm chuẩn “phase over” trong nghĩa sản xuất.",
        d: "Không có cụm chuẩn “phase through”; thường nhầm với “go through” (trải qua).",
      },
    }),
    mcq({
      id: "phv-12",
      difficulty: "hard",
      stem: "I’m sorry I’m late. My car ___ on the way here.",
      choices: {
        a: "broke down",
        b: "broke up",
        c: "broke into",
        d: "broke out",
      },
      answer: "a",
      explanation:
        "Xe hỏng giữa đường → “break down”. Ví dụ: “The bus broke down, so we walked the last kilometre.”",
      whyWrong: {
        b: "“break up” nghĩa chia tay hoặc giải tán, đúng kiểu “They broke up last year.”",
        c: "“break into” nghĩa đột nhập, đúng kiểu “Someone broke into the office.”",
        d: "“break out” nghĩa bùng phát (hỏa hoạn/dịch/chiến tranh), đúng kiểu “A fire broke out.”",
      },
    }),
  ],
};
