import { mcq } from "../helpers";
import type { TopicSeed } from "../types";

export const presentSimple: TopicSeed = {
  id: "topic-present-simple",
  slug: "present-simple",
  name: "Present Simple",
  gradeFrom: 6,
  gradeTo: 12,
  summary: "Thói quen, lịch cố định và sự thật luôn đúng.",
  purpose:
    "Diễn tả việc lặp lại, lịch trình ổn định, hoặc một sự thật không phụ thuộc lúc nói.",
  usage: [
    "Thói quen: việc lặp lại hằng ngày, hằng tuần.",
    "Lịch trình: giờ tàu xe, giờ học đã cố định.",
    "Sự thật, quy luật tự nhiên: điều đúng không phụ thuộc lúc nói.",
    "Không dùng: cho việc đang xảy ra đúng lúc nói.",
  ].join("\n"),
  structure: [
    "I, you, we, they: giữ động từ nguyên mẫu.",
    "He, she, it: thêm -s vào động từ.",
    "- -es: khi động từ tận cùng s, x, z, ch, sh, o.",
    "- y → ies: khi trước y là phụ âm.",
    "Phủ định và câu hỏi: dùng do / does, động từ chính trở về nguyên mẫu.",
  ].join("\n"),
  affirmativePattern: "Chủ ngữ + V / V-s.",
  negativePattern: "Chủ ngữ + do/does not + V.",
  questionPattern: "Do/Does + chủ ngữ + V?",
  signalWords: [
    "always",
    "usually",
    "often",
    "sometimes",
    "never",
    "every day",
    "every weekday",
  ],
  examples: [
    {
      sentence: "She walks to school every morning.",
      note: "Thói quen, ngôi she nên walks.",
    },
    {
      sentence: "The train leaves at 6:15.",
      note: "Lịch cố định vẫn dùng hiện tại đơn.",
    },
    {
      sentence: "Water boils at 100 degrees Celsius.",
      note: "Sự thật luôn đúng.",
    },
  ],
  commonMistakes: [
    {
      wrong: "She go to school.",
      right: "She goes to school.",
      why: "Ngôi thứ ba số ít phải chia động từ.",
    },
    {
      wrong: "He doesn't watches the news.",
      right: "He doesn't watch the news.",
      why: "Sau doesn't, động từ về nguyên mẫu.",
    },
    {
      wrong: "Do he live here?",
      right: "Does he live here?",
      why: "He đi với does, không đi với do.",
    },
  ],
  comparisons: [
    {
      with: "Present continuous",
      note: "Hiện tại đơn là thói quen. Hiện tại tiếp diễn là việc đang xảy ra lúc nói: I study every night / I am studying now.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "ps-1",
      difficulty: "easy",
      stem: "She ___ to school by bus every morning.",
      choices: { a: "go", b: "goes", c: "going", d: "went" },
      answer: "b",
      explanation:
        "She là ngôi thứ ba số ít và every morning chỉ thói quen, nên dùng goes.",
      whyWrong: {
        a: "go chưa chia cho she.",
        c: "going cần be đứng trước, và không phải thì của thói quen này.",
        d: "went là quá khứ, trong khi every morning là việc lặp lại.",
      },
    }),
    mcq({
      id: "ps-2",
      difficulty: "easy",
      stem: "My friends ___ football after school on Fridays.",
      choices: { a: "plays", b: "play", c: "played", d: "are playing" },
      answer: "b",
      explanation:
        "My friends là số nhiều, on Fridays là thói quen, nên giữ play.",
      whyWrong: {
        a: "plays chỉ dành cho ngôi thứ ba số ít.",
        c: "played kể việc đã xong, không phải lịch mỗi thứ Sáu.",
        d: "are playing nói việc đang diễn ra, câu này nói thói quen.",
      },
    }),
    mcq({
      id: "ps-3",
      difficulty: "medium",
      stem: "Water ___ at 100 degrees Celsius.",
      choices: { a: "boil", b: "boils", c: "is boiling", d: "boiled" },
      answer: "b",
      explanation: "Đây là sự thật luôn đúng, chủ ngữ water đi với boils.",
      whyWrong: {
        a: "boil thiếu -s cho ngôi thứ ba số ít.",
        c: "is boiling chỉ nước đang sôi lúc nói, không phải quy luật.",
        d: "boiled đẩy việc về quá khứ.",
      },
    }),
    mcq({
      id: "ps-4",
      difficulty: "medium",
      stem: "___ your brother live in Hue?",
      choices: { a: "Do", b: "Does", c: "Is", d: "Are" },
      answer: "b",
      explanation:
        "Câu hỏi hiện tại đơn với brother dùng Does, động từ live giữ nguyên.",
      whyWrong: {
        a: "Do đi với I, you, we, they, không đi với brother.",
        c: "Is không tạo câu hỏi với động từ thường live.",
        d: "Are dùng cho số nhiều hoặc you, không dùng cho brother.",
      },
    }),
    mcq({
      id: "ps-5",
      difficulty: "hard",
      stem: "He doesn't ___ the news before breakfast.",
      choices: { a: "watches", b: "watch", c: "watching", d: "watched" },
      answer: "b",
      explanation: "Sau doesn't, động từ chính về nguyên mẫu: watch.",
      whyWrong: {
        a: "watches đã chia, không đứng sau doesn't.",
        c: "watching là dạng tiếp diễn, không đi với doesn't trong câu này.",
        d: "watched là quá khứ, doesn't đã mang thì hiện tại.",
      },
    }),
    mcq({
      id: "ps-6",
      difficulty: "hard",
      stem: "The train to Hanoi ___ at 6:15 every weekday.",
      choices: { a: "leave", b: "leaves", c: "is leaving", d: "left" },
      answer: "b",
      explanation:
        "Giờ tàu cố định dùng hiện tại đơn. The train đi với leaves.",
      whyWrong: {
        a: "leave chưa chia cho the train.",
        c: "is leaving hợp với một chuyến đang diễn ra, không phải lịch every weekday.",
        d: "left là một lần đã chạy trong quá khứ.",
      },
    }),
    mcq({
      id: "ps-7",
      difficulty: "easy",
      stem: "We ___ English on Monday mornings.",
      choices: { a: "studies", b: "study", c: "studied", d: "are studying" },
      answer: "b",
      explanation:
        "We là số nhiều và on Monday mornings là thói quen, nên giữ study.",
      whyWrong: {
        a: "studies chỉ dùng với he, she, it.",
        c: "studied là quá khứ, câu này nói lịch lặp lại.",
        d: "are studying nói việc đang học lúc nói, không phải thói quen.",
      },
    }),
    mcq({
      id: "ps-8",
      difficulty: "easy",
      stem: "My father ___ dinner at 7 p.m. every day.",
      choices: { a: "cook", b: "cooks", c: "cooking", d: "cooked" },
      answer: "b",
      explanation:
        "My father là ngôi thứ ba số ít và every day chỉ thói quen, nên dùng cooks.",
      whyWrong: {
        a: "cook chưa chia cho my father.",
        c: "cooking cần be đứng trước, không phải thì thói quen này.",
        d: "cooked đẩy việc về quá khứ.",
      },
    }),
    mcq({
      id: "ps-9",
      difficulty: "medium",
      stem: "___ they visit their grandparents on Sundays?",
      choices: { a: "Do", b: "Does", c: "Is", d: "Are" },
      answer: "a",
      explanation:
        "Câu hỏi hiện tại đơn với they dùng Do, động từ visit giữ nguyên.",
      whyWrong: {
        b: "Does chỉ đi với he, she, it, không đi với they.",
        c: "Is không tạo câu hỏi với động từ thường visit.",
        d: "Are không đứng trước chủ ngữ rồi tới động từ thường theo cách này.",
      },
    }),
    mcq({
      id: "ps-10",
      difficulty: "medium",
      stem: "He ___ TV for an hour every evening.",
      choices: { a: "watch", b: "watches", c: "watching", d: "watched" },
      answer: "b",
      explanation:
        "He là ngôi thứ ba số ít; watch kết thúc bằng -ch nên thêm -es: watches.",
      whyWrong: {
        a: "watch thiếu -es cho he.",
        c: "watching là dạng tiếp diễn, không đi một mình trong câu thói quen này.",
        d: "watched là quá khứ, every evening nói việc lặp lại.",
      },
    }),
    mcq({
      id: "ps-11",
      difficulty: "hard",
      stem: "How often ___ your sister practice the piano?",
      choices: { a: "do", b: "does", c: "is", d: "are" },
      answer: "b",
      explanation:
        "Trong câu hỏi với how often, your sister đi với does; practice giữ nguyên mẫu.",
      whyWrong: {
        a: "do không đi với your sister.",
        c: "is không tạo câu hỏi với động từ thường practice.",
        d: "are dùng cho số nhiều hoặc you, không dùng cho your sister.",
      },
    }),
    mcq({
      id: "ps-12",
      difficulty: "hard",
      stem: "Nobody ___ the answer to this question.",
      choices: { a: "know", b: "knows", c: "knowing", d: "knew" },
      answer: "b",
      explanation:
        "Nobody mang nghĩa số ít trong ngữ pháp, nên động từ chia knows.",
      whyWrong: {
        a: "know thiếu -s sau nobody.",
        c: "knowing cần be đứng trước và không phải thì câu này.",
        d: "knew là quá khứ, câu này nói sự thật hiện tại.",
      },
    }),
  ],
};
