import { mcq } from "../helpers";
import type { TopicSeed } from "../types";

export const wishIfOnly: TopicSeed = {
  id: "topic-wish-if-only",
  slug: "wish-if-only",
  name: "Wish and If Only",
  gradeFrom: 10,
  gradeTo: 12,
  summary: "Diễn đạt ước muốn trái với hiện tại, tiếc về quá khứ, hoặc muốn ai đó thay đổi thói quen.",
  purpose: "Nói điều mình muốn khác đi so với sự thật hiện tại hoặc quá khứ; if only nhấn mạnh tiếc nuối mạnh hơn wish.",
  usage: [
    "Ước hiện tại: wish / if only + quá khứ đơn (be thường dùng were).",
    "Tiếc quá khứ: wish / if only + quá khứ hoàn thành.",
    "Muốn người khác đổi hành vi: wish + would (+ not) + V.",
    "Không dùng: wish + will cho ước hiện tại.",
  ].join("\n"),
  structure: [
    "wish: S + wish(es) + (that) + mệnh đề giả định.",
    "If only: + mệnh đề giả định, thường đứng đầu câu cảm thán.",
  ].join("\n"),
  affirmativePattern: "I wish + S + V2 / had + V3 / would + V.",
  negativePattern: "I wish + S + did not + V / had not + V3 / would not + V.",
  questionPattern: "Do you wish + S + V2? / What do you wish ___?",
  signalWords: ["wish", "if only", "were", "had", "would"],
  examples: [
    {
      sentence: "I wish I were taller.",
      note: "Thực tế hiện tại tôi không cao hơn; dùng were giả định.",
    },
    {
      sentence: "If only I had checked the answer carefully.",
      note: "Tiếc việc đã không kiểm tra trong quá khứ; past perfect.",
    },
    {
      sentence: "I wish you would stop making noise.",
      note: "Muốn người nghe thay đổi thói quen gây phiền; wish + would.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I wish I am rich.",
      right: "I wish I were rich.",
      why: "Ước trái hiện tại dùng dạng quá khứ giả định, không dùng am.",
    },
    {
      wrong: "I wish I studied harder yesterday.",
      right: "I wish I had studied harder yesterday.",
      why: "Tiếc quá khứ cần past perfect, không chỉ past simple.",
    },
    {
      wrong: "I wish it will stop raining.",
      right: "I wish it would stop raining.",
      why: "Sau wish không dùng will; dùng would khi muốn tình huống đổi.",
    },
  ],
  comparisons: [
    {
      with: "Conditional type 2",
      note: "If I were taller, I would join the team nêu điều kiện và kết quả. I wish I were taller chỉ nêu ước, không buộc có mệnh đề would...",
    },
  ],
  prerequisiteSlugs: ["conditional-type-1", "conditional-type-2", "past-simple"],
  questions: [
    mcq({
      id: "wish-1",
      difficulty: "easy",
      stem: "I wish I ___ enough time for the project now.",
      choices: { a: "have", b: "had", c: "will have", d: "have had" },
      answer: "b",
      explanation: "Ước trái hiện tại dùng past simple: had.",
      translationVi: "Tôi ước gì bây giờ mình có đủ thời gian cho dự án.",
      whyWrong: {
        a: "have là sự thật hiện tại, không phải dạng sau wish.",
        c: "will have là tương lai, không dùng sau wish cho ước hiện tại.",
        d: "have had là hiện tại hoàn thành, không phải mẫu wish hiện tại.",
      },
    }),
    mcq({
      id: "wish-2",
      difficulty: "easy",
      stem: "She wishes she ___ better at English.",
      choices: { a: "is", b: "was", c: "were", d: "has been" },
      answer: "c",
      explanation: "Với be sau wish, bài thi thường dùng were cho mọi ngôi.",
      translationVi: "Cô ấy ước mình giỏi tiếng Anh hơn.",
      whyWrong: {
        a: "is là hiện tại thật, không đi sau wish.",
        b: "was đôi khi gặp trong văn nói, nhưng dạng chuẩn thi là were.",
        d: "has been không phải dạng giả định hiện tại sau wish.",
      },
    }),
    mcq({
      id: "wish-3",
      difficulty: "easy",
      stem: "If only we ___ the map with us today.",
      choices: { a: "have", b: "had", c: "will have", d: "are having" },
      answer: "b",
      explanation: "If only ước hiện tại dùng past simple: had.",
      translationVi: "Giá mà hôm nay chúng tôi mang theo bản đồ.",
      whyWrong: {
        a: "have mô tả sự thật, không phải cấu trúc if only giả định.",
        c: "will have không đứng sau if only theo mẫu này.",
        d: "are having là hiện tại tiếp diễn, sai mẫu.",
      },
    }),
    mcq({
      id: "wish-4",
      difficulty: "easy",
      stem: "I wish it ___ raining so that we could go out.",
      choices: { a: "stops", b: "stopped", c: "will stop", d: "has stopped" },
      answer: "b",
      explanation: "Ước tình huống hiện tại khác đi: wish + past simple stopped.",
      translationVi: "Tôi ước trời tạnh mưa để chúng tôi có thể ra ngoài.",
      whyWrong: {
        a: "stops là hiện tại đơn thật.",
        c: "will stop không dùng trực tiếp sau wish.",
        d: "has stopped nhấn kết quả hoàn thành, không phải mẫu ước hiện tại chuẩn.",
      },
    }),
    mcq({
      id: "wish-5",
      difficulty: "medium",
      stem: "I wish I ___ your advice before I bought that phone.",
      choices: { a: "take", b: "took", c: "had taken", d: "would take" },
      answer: "c",
      explanation: "before I bought chỉ quá khứ đã qua → tiếc quá khứ dùng had taken.",
      translationVi:
        "Tôi ước mình đã nghe lời khuyên của bạn trước khi mua chiếc điện thoại đó.",
      whyWrong: {
        a: "take là hiện tại, không khớp tiếc việc đã xảy ra.",
        b: "took dùng cho ước hiện tại, không đủ cho tiếc quá khứ.",
        d: "would take dùng khi muốn ai/điều gì đổi thói quen, không phải tiếc đã mua.",
      },
    }),
    mcq({
      id: "wish-6",
      difficulty: "medium",
      stem: "If only he ___ harder for the exam last month.",
      choices: { a: "studies", b: "studied", c: "had studied", d: "would study" },
      answer: "c",
      explanation: "last month buộc past perfect: had studied.",
      translationVi: "Giá mà tháng trước anh ấy học hành chăm chỉ hơn cho kỳ thi.",
      whyWrong: {
        a: "studies là hiện tại.",
        b: "studied thiếu bậc hoàn thành cho tiếc quá khứ.",
        d: "would study không dùng để tiếc việc đã không học tháng trước.",
      },
    }),
    mcq({
      id: "wish-7",
      difficulty: "medium",
      stem: "I wish you ___ borrowing my charger without asking; it really annoys me.",
      choices: {
        a: "would have stopped",
        b: "will stop",
        c: "would stop",
        d: "had stopped",
      },
      answer: "c",
      explanation: "Muốn người khác bỏ thói quen gây khó chịu đang tiếp diễn: wish + would stop (không phải would have stopped, vốn chỉ một việc đã xong trong quá khứ, lệch với annoys me ở hiện tại).",
      translationVi:
        "Tôi ước bạn ngừng mượn sạc của tôi mà không hỏi; điều đó thực sự làm tôi khó chịu.",
      whyWrong: {
        a: "would have stopped diễn tả tiếc một việc đã hoàn tất trong quá khứ, không hợp với annoys me (sự khó chịu đang tiếp diễn ở hiện tại).",
        b: "will không đứng sau wish; cần would.",
        d: "had stopped là tiếc quá khứ, không phải yêu cầu đổi hành vi hiện tại.",
      },
    }),
    mcq({
      id: "wish-8",
      difficulty: "medium",
      stem: "Nam wishes he ___ drive a car, but he is only fifteen.",
      choices: { a: "can", b: "could", c: "will", d: "may" },
      answer: "b",
      explanation: "Ước khả năng trái hiện tại: wish + could.",
      translationVi: "Nam ước mình có thể lái ô tô, nhưng cậu ấy mới mười lăm tuổi.",
      whyWrong: {
        a: "can là khả năng thật hiện tại, không dùng sau wish.",
        c: "will không đi sau wish theo mẫu này.",
        d: "may chỉ khả năng/cho phép, không phải dạng giả định chuẩn sau wish.",
      },
    }),
    mcq({
      id: "wish-9",
      difficulty: "hard",
      stem: "I wish I ___ the teacher\'s warning; now I have to rewrite the essay.",
      choices: {
        a: "listen to",
        b: "listened to",
        c: "had listened to",
        d: "would listen to",
      },
      answer: "c",
      explanation: "now I have to rewrite cho thấy hậu quả hiện tại của lỗi quá khứ → had listened to.",
      translationVi:
        "Tôi ước mình đã nghe lời cảnh báo của thầy cô; giờ tôi phải viết lại bài luận.",
      whyWrong: {
        a: "listen to là hiện tại.",
        b: "listened to chỉ ước hiện tại, không khớp việc đã bỏ qua lời cảnh báo.",
        d: "would listen to không diễn tả tiếc việc đã không nghe.",
      },
    }),
    mcq({
      id: "wish-10",
      difficulty: "hard",
      stem: "If only the bus ___ on time for once; I am tired of this delay every day.",
      choices: {
        a: "would not arrive",
        b: "will arrive",
        c: "had arrived",
        d: "would arrive",
      },
      answer: "d",
      explanation: "Phàn nàn và muốn tình huống đổi thói quen: if only + would arrive (không phải would not arrive, vì người nói muốn xe ĐẾN đúng giờ, không phải ngược lại).",
      translationVi:
        "Giá mà chuyến xe buýt đến đúng giờ dù chỉ một lần; tôi phát chán với việc trễ giờ mỗi ngày như thế này.",
      whyWrong: {
        a: "would not arrive đảo thành phủ định, nghĩa là ước xe ĐỪNG đến đúng giờ, trái ngược với việc đang than phiền xe hay trễ.",
        b: "will không đứng sau if only / wish.",
        c: "had arrived là tiếc một lần đã xảy ra trong quá khứ, lệch với every day mang tính lặp lại hiện tại.",
      },
    }),
    mcq({
      id: "wish-11",
      difficulty: "hard",
      stem: "They wish they ___ so much money on clothes last year.",
      choices: {
        a: "did not spend",
        b: "do not spend",
        c: "had not spent",
        d: "would not spend",
      },
      answer: "c",
      explanation: "last year → tiếc quá khứ phủ định: had not spent.",
      translationVi:
        "Họ ước mình đã không tiêu nhiều tiền như vậy vào quần áo năm ngoái.",
      whyWrong: {
        a: "did not spend là quá khứ đơn, chưa đủ cho tiếc quá khứ sau wish.",
        b: "do not spend là hiện tại.",
        d: "would not spend dùng cho mong người khác đừng làm, không phải tiếc chi tiêu năm rồi.",
      },
    }),
    mcq({
      id: "wish-12",
      difficulty: "hard",
      stem: "I wish my brother ___ the volume down when I study; the noise is driving me crazy.",
      choices: {
        a: "would not turn",
        b: "will turn",
        c: "had turned",
        d: "would turn",
      },
      answer: "d",
      explanation: "Muốn anh ấy đổi hành vi gây phiền: wish + would turn (không phải would not turn, vì người nói muốn anh ấy vặn NHỎ âm lượng, không phải ngược lại).",
      translationVi:
        "Tôi ước anh trai tôi vặn nhỏ âm lượng lại khi tôi học bài; tiếng ồn đó làm tôi phát điên.",
      whyWrong: {
        a: "would not turn đảo thành phủ định, nghĩa là ước anh ấy ĐỪNG vặn nhỏ âm lượng, trái ngược với việc đang than phiền tiếng ồn làm phát điên.",
        b: "will không đứng sau wish; cần would.",
        c: "had turned là tiếc một lần đã xảy ra, không khớp thói quen when I study.",
      },
    }),
  ],
};
