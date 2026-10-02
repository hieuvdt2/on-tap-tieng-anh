import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const collocations: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-collocations",
  slug: "collocations",
  name: "Collocations",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Cụm từ cố định động từ–danh từ và tính từ–danh từ giúp câu tiếng Anh nghe tự nhiên hơn khi nói và viết.",
  overview:
    "Chủ đề này tập trung vào các “mảnh” ngôn ngữ hay đi cùng nhau, ví dụ “make a decision”, “do homework”, “heavy rain”. Bạn học chọn đúng động từ hoặc tính từ khớp với danh từ, không dịch từng chữ từ tiếng Việt. Các câu luyện tập yêu cầu hoàn thiện cụm cố định trong ngữ cảnh đầy đủ.",
  items: [
    {
      word: "make",
      meaningVi: "tạo ra / đưa ra (trong cụm cố định)",
      wordClass: "verb",
      example: "We need to make a decision before Friday.",
      note: "Hay đi với decision, mistake, effort, progress — không dùng “do a decision”.",
    },
    {
      word: "do",
      meaningVi: "làm (công việc, bài tập)",
      wordClass: "verb",
      example: "Have you done your homework yet?",
      note: "Hay đi với homework, housework, a favour, business — khác phạm vi với “make”.",
    },
    {
      word: "take",
      meaningVi: "thực hiện / dành (thời gian, ảnh, nghỉ)",
      wordClass: "verb",
      example: "Let’s take a break after this exercise.",
      note: "Hay đi với a break, a photo, notes, a risk, responsibility.",
    },
    {
      word: "heavy",
      meaningVi: "nặng / lớn (mưa, giao thông)",
      wordClass: "adjective",
      example: "Heavy rain flooded the school playground.",
      note: "Đi với rain, traffic, workload; không nói “strong rain”.",
    },
    {
      word: "strong",
      meaningVi: "mạnh (cà phê, gió, ý kiến)",
      wordClass: "adjective",
      example: "He prefers strong coffee in the morning.",
      note: "Đi với coffee, wind, opinion, accent; khác “heavy” theo danh từ đi kèm.",
    },
    {
      word: "pay",
      meaningVi: "chú ý / trả (trong cụm)",
      wordClass: "verb",
      example: "Please pay attention to the safety instructions.",
      note: "Cụm quan trọng: pay attention, pay a visit, pay the price — không “give attention” trong tiếng Anh chuẩn lớp.",
    },
    {
      word: "catch",
      meaningVi: "bắt kịp / bắt (xe, cảm lạnh)",
      wordClass: "verb",
      example: "Hurry or we will not catch the bus.",
      note: "Hay đi với bus, train, a cold, someone’s attention.",
    },
    {
      word: "keep",
      meaningVi: "giữ / duy trì",
      wordClass: "verb",
      example: "Try to keep a promise once you make it.",
      note: "Hay đi với a promise, a secret, in touch, calm.",
    },
  ],
  collocations: [
    {
      phrase: "make a decision",
      meaningVi: "đưa ra quyết định",
      example: "After a long discussion, they made a decision to move.",
    },
    {
      phrase: "do homework",
      meaningVi: "làm bài tập về nhà",
      example: "She does her homework before watching television.",
    },
    {
      phrase: "heavy rain",
      meaningVi: "mưa lớn",
      example: "Heavy rain delayed the outdoor match.",
    },
    {
      phrase: "take a break",
      meaningVi: "nghỉ giải lao",
      example: "Take a break if your eyes feel tired.",
    },
    {
      phrase: "pay attention",
      meaningVi: "chú ý",
      example: "Drivers must pay attention near school gates.",
    },
    {
      phrase: "strong coffee",
      meaningVi: "cà phê đặc / đậm",
      example: "I cannot sleep after drinking strong coffee.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I need to do a decision today.",
      right: "I need to make a decision today.",
      why: "Với “decision” dùng “make”, không dùng “do”.",
    },
    {
      wrong: "There was a strong rain last night.",
      right: "There was heavy rain last night.",
      why: "Mưa lớn là “heavy rain”; “strong” thường đi với wind hoặc coffee.",
    },
    {
      wrong: "Please give attention to this diagram.",
      right: "Please pay attention to this diagram.",
      why: "Cụm chuẩn là “pay attention to”, không dịch sát “give attention”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "col-1",
      difficulty: "easy",
      stem: "Before choosing a university, you should ___ a careful decision.",
      choices: {
        a: "do",
        b: "make",
        c: "take",
        d: "pay",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “make a decision”. Ví dụ: “They made a decision to stay.”",
      whyWrong: {
        a: "“Do” đúng với “do homework” hoặc “do a favour”, ví dụ: “Please do me a favour.”",
        c: "“Take” đúng với “take a break” hoặc “take notes”, ví dụ: “Take notes during the talk.”",
        d: "“Pay” đúng với “pay attention”, ví dụ: “Pay attention to the map.”",
      },
    }),
    mcq({
      id: "col-2",
      difficulty: "easy",
      stem: "Lan usually ___ her homework at the kitchen table after dinner.",
      choices: {
        a: "makes",
        b: "does",
        c: "takes",
        d: "keeps",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “do homework”. Ví dụ: “He does his homework before eight.”",
      whyWrong: {
        a: "“Make” đúng với “make a decision” hoặc “make a mistake”, ví dụ: “Don’t make the same mistake.”",
        c: "“Take” đúng với “take a break” hoặc “take a photo”, ví dụ: “Take a photo of the board.”",
        d: "“Keep” đúng với “keep a promise” hoặc “keep a secret”, ví dụ: “Can you keep a secret?”",
      },
    }),
    mcq({
      id: "col-3",
      difficulty: "easy",
      stem: "___ rain forced the school to cancel the outdoor sports day.",
      choices: {
        a: "Strong",
        b: "Heavy",
        c: "Hard",
        d: "Big",
      },
      answer: "b",
      explanation:
        "Cụm chuẩn là “heavy rain”. Ví dụ: “Heavy rain flooded the street.”",
      whyWrong: {
        a: "“Strong” đúng với “strong coffee” hoặc “strong wind”, ví dụ: “A strong wind blew the signs down.”",
        c: "“Hard” đúng với “hard work” hoặc “rain hard” (động từ), không tạo tính từ–danh từ “hard rain” phổ biến ở cấp này.",
        d: "“Big” đúng với một số danh từ như “big problem”, không thay “heavy” trước “rain”.",
      },
    }),
    mcq({
      id: "col-4",
      difficulty: "easy",
      stem: "After two hours of revision, the class decided to ___ a short break.",
      choices: {
        a: "make",
        b: "do",
        c: "take",
        d: "pay",
      },
      answer: "c",
      explanation:
        "Cụm cố định là “take a break”. Ví dụ: “Let’s take a break for ten minutes.”",
      whyWrong: {
        a: "“Make” đúng với “make a decision” hoặc “make an effort”, ví dụ: “Make an effort to arrive early.”",
        b: "“Do” đúng với “do homework” hoặc “do housework”, ví dụ: “I do housework on Sundays.”",
        d: "“Pay” đúng với “pay attention”, ví dụ: “Pay attention when crossing.”",
      },
    }),
    mcq({
      id: "col-5",
      difficulty: "medium",
      stem: "Drivers must ___ attention to the temporary speed limit near the roadworks.",
      choices: {
        a: "give",
        b: "make",
        c: "pay",
        d: "keep",
      },
      answer: "c",
      explanation:
        "Cụm cố định là “pay attention”. Ví dụ: “Students should pay attention in labs.”",
      whyWrong: {
        a: "“Give” nghe giống dịch từ tiếng Việt nhưng không tạo cụm chuẩn; dùng “pay attention”.",
        b: "“Make” đúng với “make a decision”, ví dụ: “Make a decision quickly.”",
        d: "“Keep” đúng với “keep calm” hoặc “keep a promise”, ví dụ: “Keep calm during drills.”",
      },
    }),
    mcq({
      id: "col-6",
      difficulty: "medium",
      stem: "I cannot drink ___ coffee late at night or I stay awake for hours.",
      choices: {
        a: "heavy",
        b: "strong",
        c: "hard",
        d: "loud",
      },
      answer: "b",
      explanation:
        "Cụm chuẩn là “strong coffee”. Ví dụ: “She ordered a strong coffee before the exam.”",
      whyWrong: {
        a: "“Heavy” đúng với “heavy rain” hoặc “heavy traffic”, ví dụ: “Heavy traffic delayed the bus.”",
        c: "“Hard” đúng với “hard work”, ví dụ: “Hard work brings results.” Không đi với “coffee”.",
        d: "“Loud” đúng với “loud music” hoặc “loud noise”, ví dụ: “Loud music annoyed the neighbours.”",
      },
    }),
    mcq({
      id: "col-7",
      difficulty: "medium",
      stem: "If we leave now, we can still ___ the last train to the city centre.",
      choices: {
        a: "take",
        b: "catch",
        c: "keep",
        d: "make",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “catch the train/bus” nghĩa kịp chuyến. Ví dụ: “Run or you won’t catch the bus.”",
      whyWrong: {
        a: "“Take the train” đúng khi nói chọn đi tàu nói chung, ví dụ: “I take the train to work.” Ở đây nhấn mạnh kịp chuyến cuối → “catch”.",
        c: "“Keep” đúng với “keep a promise”, ví dụ: “He kept his promise.”",
        d: "“Make” đúng với “make a decision”, không đi với “the last train” theo nghĩa kịp giờ.",
      },
    }),
    mcq({
      id: "col-8",
      difficulty: "medium",
      stem: "Trust grows when people ___ their promises instead of breaking them.",
      choices: {
        a: "do",
        b: "pay",
        c: "keep",
        d: "catch",
      },
      answer: "c",
      explanation:
        "Cụm “keep a promise / keep their promises” nghĩa giữ lời hứa. Ví dụ: “She always keeps her promises.”",
      whyWrong: {
        a: "“Do” đúng với “do homework”, ví dụ: “Do your homework first.” Không nói “do a promise”.",
        b: "“Pay” đúng với “pay attention” hoặc “pay a visit”, ví dụ: “Pay a visit to your grandparents.”",
        d: "“Catch” đúng với “catch a cold” hoặc “catch the bus”, ví dụ: “I caught a cold last week.”",
      },
    }),
    mcq({
      id: "col-9",
      difficulty: "hard",
      stem: "Even careful writers sometimes ___ mistakes when they rush.",
      choices: {
        a: "do",
        b: "make",
        c: "take",
        d: "pay",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “make a mistake / make mistakes”. Ví dụ: “Don’t make the same mistake twice.”",
      whyWrong: {
        a: "“Do” đúng với bài tập hoặc việc nhà, ví dụ: “Do the washing-up.” Không đi với “mistakes”.",
        c: "“Take” đúng với “take a risk” hoặc “take notes”, ví dụ: “Take a risk carefully.”",
        d: "“Pay” đúng với “pay attention”, ví dụ: “Pay attention to spelling.”",
      },
    }),
    mcq({
      id: "col-10",
      difficulty: "hard",
      stem: "___ traffic on the highway made everyone late for the morning assembly.",
      choices: {
        a: "Strong",
        b: "Heavy",
        c: "Hard",
        d: "Thick",
      },
      answer: "b",
      explanation:
        "Cụm chuẩn là “heavy traffic”. Ví dụ: “Heavy traffic builds up after 7 a.m.”",
      whyWrong: {
        a: "“Strong” đúng với “strong wind” hoặc “strong coffee”, ví dụ: “Strong wind closed the ferry.”",
        c: "“Hard” đúng với “hard work”, không tạo “hard traffic”.",
        d: "“Thick” đúng với “thick fog” hoặc “thick smoke”, ví dụ: “Thick fog delayed flights.”",
      },
    }),
    mcq({
      id: "col-11",
      difficulty: "hard",
      stem: "Good friends ___ in touch even when they study in different cities.",
      choices: {
        a: "make",
        b: "take",
        c: "keep",
        d: "catch",
      },
      answer: "c",
      explanation:
        "Cụm cố định là “keep in touch”. Ví dụ: “Let’s keep in touch after graduation.”",
      whyWrong: {
        a: "“Make” đúng với “make progress” hoặc “make a decision”, ví dụ: “Make progress every week.”",
        b: "“Take” đúng với “take a break”, ví dụ: “Take a break between chapters.”",
        d: "“Catch” đúng với “catch someone’s attention”, ví dụ: “The poster caught my attention.”",
      },
    }),
    mcq({
      id: "col-12",
      difficulty: "hard",
      stem: "Could you ___ me a favour and print two more copies of the worksheet?",
      choices: {
        a: "make",
        b: "do",
        c: "take",
        d: "pay",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “do someone a favour”. Ví dụ: “Can you do me a favour?”",
      whyWrong: {
        a: "“Make” đúng với “make an effort” hoặc “make a decision”, ví dụ: “Make an effort to listen.”",
        c: "“Take” đúng với “take responsibility” hoặc “take a break”, ví dụ: “Take responsibility for the error.”",
        d: "“Pay” đúng với “pay attention” hoặc “pay the bill”, ví dụ: “Who will pay the bill?”",
      },
    }),
  ],
};
