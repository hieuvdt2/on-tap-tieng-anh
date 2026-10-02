import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const careers: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-careers",
  slug: "careers",
  name: "Careers",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về nghề nghiệp: ứng tuyển, thực tập, đồng nghiệp, thăng tiến và môi trường làm việc.",
  overview:
    "Bài này giúp bạn dùng đúng các từ như “internship”, “resign”, “promote”, “vacancy”, “deadline” khi nói về việc làm và lộ trình nghề nghiệp. Chú trọng nghĩa trong ngữ cảnh câu và các cụm thường gặp như “apply for a job”, “meet a deadline”, “gain experience”.",
  items: [
    {
      word: "internship",
      meaningVi: "kỳ thực tập",
      wordClass: "noun",
      example: "She completed a summer internship at a design studio.",
      note: "Người thực tập: “intern”.",
    },
    {
      word: "resign",
      meaningVi: "xin nghỉ việc; từ chức",
      wordClass: "verb",
      example: "He plans to resign after finding a better role.",
      note: "Danh từ: “resignation”. Khác “retire” (về hưu).",
    },
    {
      word: "promote",
      meaningVi: "thăng chức; đề bạt",
      wordClass: "verb",
      example: "The company promoted her to team leader last year.",
      note: "Danh từ: “promotion”. Cũng có nghĩa quảng bá sản phẩm tùy ngữ cảnh.",
    },
    {
      word: "vacancy",
      meaningVi: "vị trí trống; chỗ tuyển",
      wordClass: "noun",
      example: "The hospital announced a vacancy for a night nurse.",
      note: "Tính từ: “vacant”.",
    },
    {
      word: "colleague",
      meaningVi: "đồng nghiệp",
      wordClass: "noun",
      example: "My colleague helped me prepare the presentation.",
      note: "Trang trọng hơn “coworker” một chút trong văn viết.",
    },
    {
      word: "deadline",
      meaningVi: "hạn chót",
      wordClass: "noun",
      example: "We moved the project deadline to Friday afternoon.",
      note: "Cụm: “meet / miss a deadline”.",
    },
    {
      word: "qualification",
      meaningVi: "bằng cấp; trình độ chuyên môn",
      wordClass: "noun",
      example: "Teaching jobs usually require a formal qualification.",
      note: "Số nhiều “qualifications” khi liệt kê chứng chỉ.",
    },
    {
      word: "overtime",
      meaningVi: "làm thêm giờ; giờ làm thêm",
      wordClass: "noun / adverb",
      example: "Staff worked overtime to finish the inventory count.",
      note: "Có thể dùng như trạng từ: “work overtime”.",
    },
  ],
  collocations: [
    {
      phrase: "apply for a job",
      meaningVi: "nộp đơn xin việc",
      example: "Hundreds of graduates apply for a job at the firm each year.",
    },
    {
      phrase: "meet a deadline",
      meaningVi: "hoàn thành đúng hạn",
      example: "Good planning helps teams meet a deadline without stress.",
    },
    {
      phrase: "gain experience",
      meaningVi: "tích lũy kinh nghiệm",
      example: "Internships help students gain experience before graduation.",
    },
    {
      phrase: "work overtime",
      meaningVi: "làm thêm giờ",
      example: "Nurses sometimes work overtime during busy seasons.",
    },
    {
      phrase: "climb the career ladder",
      meaningVi: "thăng tiến trên lộ trình nghề nghiệp",
      example: "Mentors can help young staff climb the career ladder.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I want to resign my job next month.",
      right: "I want to resign (from my job) next month. / I want to quit my job next month.",
      why: "“resign” không đi trực tiếp với “my job”; dùng “resign” hoặc “resign from my position”.",
    },
    {
      wrong: "She got a promotion for a higher salary only.",
      right: "She got a promotion and a higher salary. / She was promoted to a higher-paid role.",
      why: "“promotion” là sự thăng chức; lương tăng thường là hệ quả, không nói “promotion for a salary” theo cách đó.",
    },
    {
      wrong: "There is a vacant for an accountant.",
      right: "There is a vacancy for an accountant. / The accountant position is vacant.",
      why: "“vacant” là tính từ; danh từ cần “vacancy”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "car-1",
      difficulty: "easy",
      stem: "Many students take a summer ___ to learn how offices really work.",
      choices: {
        a: "internship",
        b: "illness",
        c: "festival",
        d: "luggage",
      },
      answer: "a",
      explanation:
        "Sinh viên làm việc tạm thời để học cách văn phòng vận hành → “internship”. Ví dụ: “A paid internship looks strong on a CV.”",
      whyWrong: {
        b: "“illness” đúng khi nói bệnh: “He missed work because of illness.”",
        c: "“festival” đúng khi nói lễ hội: “The city hosts a music festival.”",
        d: "“luggage” đúng khi nói hành lý: “Pack light luggage for the trip.”",
      },
    }),
    mcq({
      id: "car-2",
      difficulty: "easy",
      stem: "Please send your CV if you are interested in the ___ for a junior designer.",
      choices: {
        a: "vacancy",
        b: "vaccine",
        c: "village",
        d: "voyage",
      },
      answer: "a",
      explanation:
        "Cần gửi CV cho vị trí đang tuyển → “vacancy”. Ví dụ: “Check the board for new vacancies.”",
      whyWrong: {
        b: "“vaccine” đúng khi nói vắc-xin: “Staff received a free vaccine.”",
        c: "“village” đúng khi nói làng: “She grew up in a mountain village.”",
        d: "“voyage” đúng khi nói chuyến đi dài (thường bằng tàu): “The voyage across the sea took weeks.”",
      },
    }),
    mcq({
      id: "car-3",
      difficulty: "easy",
      stem: "My ___ shared notes from yesterday’s client meeting.",
      choices: {
        a: "colleague",
        b: "customer only",
        c: "stranger",
        d: "passenger",
      },
      answer: "a",
      explanation:
        "Người cùng nơi làm việc chia sẻ ghi chú họp → “colleague”. Ví dụ: “Ask a colleague if the file is ready.”",
      whyWrong: {
        b: "“customer” đúng khi nói khách hàng: “A customer asked about delivery times.”",
        c: "“stranger” đúng khi nói người lạ: “Never share passwords with a stranger.”",
        d: "“passenger” đúng khi nói hành khách: “Passengers must keep seat belts on.”",
      },
    }),
    mcq({
      id: "car-4",
      difficulty: "easy",
      stem: "The report must be ready by Friday; that is a hard ___.",
      choices: {
        a: "deadline",
        b: "dessert",
        c: "decoration",
        d: "diameter",
      },
      answer: "a",
      explanation:
        "Báo cáo phải xong vào thứ Sáu → “deadline”. Ví dụ: “Missing a deadline can delay the launch.”",
      whyWrong: {
        b: "“dessert” đúng khi nói món tráng miệng: “Fruit is a light dessert.”",
        c: "“decoration” đúng khi nói đồ trang trí: “Office decorations went up in December.”",
        d: "“diameter” đúng khi nói đường kính: “Measure the diameter of the pipe.”",
      },
    }),
    mcq({
      id: "car-5",
      difficulty: "medium",
      stem: "After five strong years, the firm decided to ___ him to project manager.",
      choices: {
        a: "promote",
        b: "postpone",
        c: "prevent",
        d: "protest",
      },
      answer: "a",
      explanation:
        "Công ty đưa anh lên vị trí quản lý dự án → “promote”. Ví dụ: “Hard work helped her get promoted quickly.”",
      whyWrong: {
        b: "“postpone” đúng khi hoãn việc: “They postponed the interview until Monday.”",
        c: "“prevent” đúng khi ngăn chặn: “Training can prevent costly mistakes.”",
        d: "“protest” đúng khi phản đối: “Workers protested unfair schedules.”",
      },
    }),
    mcq({
      id: "car-6",
      difficulty: "medium",
      stem: "She chose to ___ rather than accept a transfer to another city.",
      choices: {
        a: "resign",
        b: "remain silent forever",
        c: "recycle paper",
        d: "repair the printer",
      },
      answer: "a",
      explanation:
        "Không nhận chuyển công tác nên xin nghỉ → “resign”. Ví dụ: “He resigned after the merger was announced.”",
      whyWrong: {
        b: "“remain silent” đúng khi giữ im lặng: “Witnesses may remain silent in court.”",
        c: "“recycle” đúng khi tái chế: “Offices recycle paper every week.”",
        d: "“repair” đúng khi sửa chữa: “IT will repair the printer this afternoon.”",
      },
    }),
    mcq({
      id: "car-7",
      difficulty: "medium",
      stem: "For this lab role, a science degree is the main ___ employers look for.",
      choices: {
        a: "qualification",
        b: "conversation",
        c: "decoration",
        d: "invitation",
      },
      answer: "a",
      explanation:
        "Bằng khoa học là điều kiện chuyên môn nhà tuyển dụng cần → “qualification”. Ví dụ: “List your qualifications near the top of the CV.”",
      whyWrong: {
        b: "“conversation” đúng khi nói cuộc trò chuyện: “The interview felt like a natural conversation.”",
        c: "“decoration” đúng khi trang trí: “Wall decoration is not part of the job test.”",
        d: "“invitation” đúng khi lời mời: “She received an invitation to the career fair.”",
      },
    }),
    mcq({
      id: "car-8",
      difficulty: "medium",
      stem: "Warehouse staff earned extra pay because they worked ___ during the sale.",
      choices: {
        a: "overtime",
        b: "overseas only",
        c: "overnight silence",
        d: "outline notes",
      },
      answer: "a",
      explanation:
        "Làm thêm trong đợt giảm giá và được trả thêm → “overtime”. Ví dụ: “Managers try to reduce unpaid overtime.”",
      whyWrong: {
        b: "“overseas” đúng khi nói ở nước ngoài: “She took an overseas assignment.”",
        c: "“overnight” đúng khi qua đêm: “The package ships overnight.” — không khớp nghĩa làm thêm giờ có lương.",
        d: "“outline” đúng khi phác thảo: “Write an outline before the report.”",
      },
    }),
    mcq({
      id: "car-9",
      difficulty: "hard",
      stem: "Graduates should ___ several jobs at once instead of waiting for one reply.",
      choices: {
        a: "apply for",
        b: "apply to silence",
        c: "reply for",
        d: "rely for",
      },
      answer: "a",
      explanation:
        "Nộp đơn xin nhiều việc cùng lúc → “apply for (a job)”. Ví dụ: “She applied for three roles last week.”",
      whyWrong: {
        b: "Không có cụm “apply to silence”; “apply to” đúng với tổ chức/trường: “Apply to the university online.”",
        c: "“reply” đúng khi trả lời thư/tin: “Please reply to the email today.” — không đi với “for a job”.",
        d: "“rely on” đúng khi dựa vào: “Teams rely on clear schedules.” — không phải “rely for”.",
      },
    }),
    mcq({
      id: "car-10",
      difficulty: "hard",
      stem: "If the team cannot ___ the Friday deadline, the client launch will slip.",
      choices: {
        a: "meet",
        b: "miss only on purpose",
        c: "make up for silence",
        d: "move into",
      },
      answer: "a",
      explanation:
        "Hoàn thành đúng hạn chót thứ Sáu → “meet a deadline”. Ví dụ: “Clear roles help departments meet deadlines.”",
      whyWrong: {
        b: "“miss a deadline” đúng khi trễ hạn: “They missed the deadline and paid a fee.” — câu này cần ý “đúng hạn”.",
        c: "“make up for” đúng khi bù đắp: “Extra shifts make up for lost time.” — không thay “meet a deadline”.",
        d: "“move into” đúng khi chuyển vào chỗ mới: “The firm will move into a larger office.”",
      },
    }),
    mcq({
      id: "car-11",
      difficulty: "hard",
      stem: "Weekend shifts helped the intern ___ experience with real customers.",
      choices: {
        a: "gain",
        b: "waste",
        c: "hide",
        d: "forget",
      },
      answer: "a",
      explanation:
        "Ca cuối tuần giúp thực tập sinh có thêm kinh nghiệm thật → “gain experience”. Ví dụ: “Volunteering helps teenagers gain experience.”",
      whyWrong: {
        b: "“waste” đúng khi lãng phí: “Do not waste experience by skipping feedback.”",
        c: "“hide” đúng khi giấu: “Never hide mistakes from your supervisor.”",
        d: "“forget” đúng khi quên: “Don’t forget to log your hours.”",
      },
    }),
    mcq({
      id: "car-12",
      difficulty: "hard",
      stem: "With mentoring and tough projects, she began to ___ the career ladder faster than peers.",
      choices: {
        a: "climb",
        b: "break",
        c: "paint",
        d: "lend",
      },
      answer: "a",
      explanation:
        "Cụm cố định “climb the career ladder” nghĩa thăng tiến nghề nghiệp. Ví dụ: “Networking can help you climb the career ladder.”",
      whyWrong: {
        b: "“break” đúng trong “break the ice” hoặc “break a record”, không đi với “career ladder”: “Ice-breakers break the ice in meetings.”",
        c: "“paint” đúng khi sơn/vẽ: “They paint the office every five years.”",
        d: "“lend” đúng khi cho mượn: “Banks lend money to small firms.”",
      },
    }),
  ],
};
