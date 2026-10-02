import { mcq } from "../helpers";
import type { TopicSeed } from "../types";

export const pastSimple: TopicSeed = {
  id: "topic-past-simple",
  slug: "past-simple",
  name: "Past Simple",
  gradeFrom: 6,
  gradeTo: 12,
  summary: "Việc đã xảy ra và đã kết thúc ở một thời điểm trong quá khứ.",
  purpose:
    "Kể một việc xong rồi, thường có mốc thời gian như yesterday hoặc last week.",
  usage: [
    "Thời điểm đã khép lại: việc xảy ra và kết thúc trong quá khứ.",
    "Không dùng: khi khoảng thời gian còn kéo dài tới hiện tại.",
  ].join("\n"),
  structure: [
    "Động từ có quy tắc: thêm -ed.",
    "Động từ bất quy tắc: dùng cột quá khứ (V2).",
    "Phủ định và câu hỏi: did + động từ nguyên mẫu.",
  ].join("\n"),
  affirmativePattern: "Chủ ngữ + V-ed / V quá khứ.",
  negativePattern: "Chủ ngữ + did not + V.",
  questionPattern: "Did + chủ ngữ + V?",
  signalWords: [
    "yesterday",
    "last night",
    "last week",
    "ago",
    "in 2018",
    "then",
  ],
  examples: [
    {
      sentence: "I saw him at the market yesterday.",
      note: "yesterday khóa việc trong quá khứ.",
    },
    {
      sentence: "She didn't go to the meeting.",
      note: "didn't giữ go ở dạng nguyên mẫu.",
    },
    {
      sentence: "Did you finish the essay last week?",
      note: "Did đứng đầu câu hỏi quá khứ.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I have seen him yesterday.",
      right: "I saw him yesterday.",
      why: "yesterday là thời điểm đã xong, dùng quá khứ đơn.",
    },
    {
      wrong: "She didn't went.",
      right: "She didn't go.",
      why: "did đã mang thì quá khứ, động từ chính không chia thêm.",
    },
    {
      wrong: "They was at home.",
      right: "They were at home.",
      why: "they đi với were.",
    },
  ],
  comparisons: [
    {
      with: "Present perfect",
      note: "Quá khứ đơn có mốc đã kết thúc. Hiện tại hoàn thành nối tới hiện tại hoặc không nêu mốc đã khép.",
    },
  ],
  prerequisiteSlugs: ["present-simple"],
  questions: [
    mcq({
      id: "pt-1",
      difficulty: "easy",
      stem: "I ___ him at the market yesterday.",
      choices: { a: "see", b: "saw", c: "have seen", d: "seen" },
      answer: "b",
      explanation: "yesterday là thời điểm đã kết thúc, see chuyển thành saw.",
      whyWrong: {
        a: "see là hiện tại.",
        c: "have seen không đi với yesterday.",
        d: "seen phải có have hoặc has đứng trước.",
      },
    }),
    mcq({
      id: "pt-2",
      difficulty: "easy",
      stem: "The children ___ at home last night.",
      choices: { a: "are", b: "was", c: "were", d: "been" },
      answer: "c",
      explanation:
        "last night đưa câu về quá khứ, children số nhiều đi với were.",
      whyWrong: {
        a: "are là hiện tại.",
        b: "was chỉ đi với ngôi số ít.",
        d: "been cần have hoặc has.",
      },
    }),
    mcq({
      id: "pt-3",
      difficulty: "medium",
      stem: "She didn't ___ to the meeting on Monday.",
      choices: { a: "went", b: "go", c: "gone", d: "going" },
      answer: "b",
      explanation: "didn't đã chỉ quá khứ, động từ phía sau là go.",
      whyWrong: {
        a: "went không đứng sau didn't.",
        c: "gone là phân từ, không dùng sau didn't.",
        d: "going không phải dạng sau didn't.",
      },
    }),
    mcq({
      id: "pt-4",
      difficulty: "medium",
      stem: "___ you finish the essay last week?",
      choices: { a: "Do", b: "Did", c: "Have", d: "Were" },
      answer: "b",
      explanation:
        "last week yêu cầu Did, rồi tới chủ ngữ và động từ nguyên mẫu finish.",
      whyWrong: {
        a: "Do là câu hỏi hiện tại.",
        c: "Have you finish thiếu phân từ và cũng không hợp last week.",
        d: "Were không hỏi với động từ thường finish theo cách này.",
      },
    }),
    mcq({
      id: "pt-5",
      difficulty: "hard",
      stem: "We ___ in Da Nang for three years, then we moved to Hue in 2018.",
      choices: { a: "live", b: "lived", c: "have lived", d: "are living" },
      answer: "b",
      explanation:
        "Việc ở Đà Nẵng đã khép lại trước khi chuyển đi năm 2018, nên dùng lived.",
      whyWrong: {
        a: "live là hiện tại, trong khi việc đã kết thúc.",
        c: "have lived hợp khi khoảng thời gian còn kéo tới nay. Câu này đã có mốc chuyển đi.",
        d: "are living nói việc đang ở, không phải một giai đoạn đã xong.",
      },
    }),
    mcq({
      id: "pt-6",
      difficulty: "hard",
      stem: "He ___ the door quietly and left the room.",
      choices: { a: "shuts", b: "shut", c: "has shut", d: "is shutting" },
      answer: "b",
      explanation:
        "Hai việc nối tiếp đã xong. shut ở quá khứ vẫn là shut, đi cùng left.",
      whyWrong: {
        a: "shuts là hiện tại đơn.",
        c: "has shut không song song với left trong chuỗi việc đã xong này.",
        d: "is shutting là việc đang diễn ra.",
      },
    }),
    mcq({
      id: "pt-7",
      difficulty: "easy",
      stem: "She ___ a letter to her aunt last night.",
      choices: { a: "write", b: "wrote", c: "written", d: "writes" },
      answer: "b",
      explanation:
        "last night khóa việc trong quá khứ, write chuyển thành wrote.",
      whyWrong: {
        a: "write là hiện tại.",
        c: "written cần have hoặc has đứng trước.",
        d: "writes là hiện tại đơn ngôi thứ ba.",
      },
    }),
    mcq({
      id: "pt-8",
      difficulty: "easy",
      stem: "They ___ to the cinema two days ago.",
      choices: { a: "go", b: "went", c: "gone", d: "goes" },
      answer: "b",
      explanation:
        "two days ago là thời điểm đã kết thúc, go chuyển thành went.",
      whyWrong: {
        a: "go là hiện tại.",
        c: "gone phải có have hoặc has đứng trước.",
        d: "goes là hiện tại đơn ngôi thứ ba số ít.",
      },
    }),
    mcq({
      id: "pt-9",
      difficulty: "medium",
      stem: "___ he call you yesterday evening?",
      choices: { a: "Do", b: "Did", c: "Does", d: "Has" },
      answer: "b",
      explanation:
        "yesterday evening yêu cầu Did, rồi tới chủ ngữ và động từ nguyên mẫu call.",
      whyWrong: {
        a: "Do là câu hỏi hiện tại với I, you, we, they.",
        c: "Does là câu hỏi hiện tại, không hợp yesterday.",
        d: "Has không tạo câu hỏi quá khứ đơn với call theo cách này.",
      },
    }),
    mcq({
      id: "pt-10",
      difficulty: "medium",
      stem: "We ___ dinner at a small restaurant last Friday.",
      choices: { a: "have", b: "had", c: "has", d: "having" },
      answer: "b",
      explanation: "last Friday đưa câu về quá khứ, have chuyển thành had.",
      whyWrong: {
        a: "have là hiện tại.",
        c: "has là hiện tại ngôi thứ ba số ít.",
        d: "having cần be đứng trước và không phải thì quá khứ đơn này.",
      },
    }),
    mcq({
      id: "pt-11",
      difficulty: "hard",
      stem: "When I ___ a child, I lived in Can Tho.",
      choices: { a: "am", b: "was", c: "were", d: "been" },
      answer: "b",
      explanation: "Mệnh đề when nói về tuổi thơ đã qua; I đi với was.",
      whyWrong: {
        a: "am là hiện tại.",
        c: "were không đi với I trong câu khẳng định này.",
        d: "been cần have hoặc has đứng trước.",
      },
    }),
    mcq({
      id: "pt-12",
      difficulty: "hard",
      stem: "She ___ her keys, so she couldn't open the door.",
      choices: { a: "lose", b: "lost", c: "loses", d: "has lost" },
      answer: "b",
      explanation:
        "Việc mất chìa khóa đã xảy ra trước couldn't open, nên dùng lost.",
      whyWrong: {
        a: "lose là hiện tại.",
        c: "loses là hiện tại đơn, không khớp chuỗi việc đã xong.",
        d: "has lost nhấn kết quả tới nay; câu này kể chuỗi sự kiện đã khép với couldn't.",
      },
    }),
  ],
};
