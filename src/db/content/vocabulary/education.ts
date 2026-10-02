import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const education: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-education",
  slug: "education",
  name: "Education",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về trường học, học tập và kỳ thi giúp bạn nói về trải nghiệm giáo dục ở cấp trung học.",
  overview:
    "Chủ đề này tập trung vào các từ và cụm từ thường gặp khi nói về lớp học, bài tập, kỳ thi và lộ trình học. Bạn sẽ học cách chọn từ đúng theo ngữ cảnh thay vì dịch từng chữ. Các câu luyện tập yêu cầu điền từ vào câu hoàn chỉnh để củng cố nghĩa và cách dùng.",
  items: [
    {
      word: "curriculum",
      meaningVi: "chương trình học",
      wordClass: "noun",
      example: "Our school updated the curriculum to include more project work.",
      note: "Chỉ toàn bộ nội dung được dạy trong khóa học hoặc cấp học, không phải một bài riêng lẻ.",
    },
    {
      word: "assignment",
      meaningVi: "bài tập được giao",
      wordClass: "noun",
      example: "Please submit the assignment before Friday afternoon.",
      note: "Thường do giáo viên giao; khác với “homework” mang tính hàng ngày hơn.",
    },
    {
      word: "deadline",
      meaningVi: "hạn nộp bài / thời hạn",
      wordClass: "noun",
      example: "The deadline for the research paper is next Monday.",
      note: "Hay đi với “meet”, “miss”, “extend”: meet the deadline.",
    },
    {
      word: "revise",
      meaningVi: "ôn tập",
      wordClass: "verb",
      example: "She plans to revise biology for two hours every evening.",
      note: "Ở Anh-Anh, “revise” = ôn trước kỳ thi; ở Mỹ thường nói “review”.",
    },
    {
      word: "scholarship",
      meaningVi: "học bổng",
      wordClass: "noun",
      example: "He received a scholarship to study engineering abroad.",
      note: "Thường đi với “apply for”, “win”, “award a scholarship”.",
    },
    {
      word: "tuition",
      meaningVi: "học phí",
      wordClass: "noun",
      example: "Tuition at that private college is quite expensive.",
      note: "Ở nhiều nơi nói “tuition fees”; không nhầm với “tutor” (gia sư).",
    },
    {
      word: "enrol",
      meaningVi: "đăng ký học",
      wordClass: "verb",
      example: "More than two hundred students enrol in the coding club each year.",
      note: "Anh-Anh viết “enrol”; Mỹ thường viết “enroll”.",
    },
    {
      word: "attendance",
      meaningVi: "sự chuyên cần / việc đi học",
      wordClass: "noun",
      example: "Regular attendance is required to pass this course.",
      note: "Khác “attention” (sự chú ý). “Take attendance” = điểm danh.",
    },
  ],
  collocations: [
    {
      phrase: "sit an exam",
      meaningVi: "dự / làm một kỳ thi",
      example: "All final-year students will sit an exam in June.",
    },
    {
      phrase: "fall behind",
      meaningVi: "bị tụt lại phía sau (trong học tập)",
      example: "If you miss too many lessons, you may fall behind.",
    },
    {
      phrase: "hand in",
      meaningVi: "nộp (bài)",
      example: "Remember to hand in your essay before the bell rings.",
    },
    {
      phrase: "make progress",
      meaningVi: "tiến bộ",
      example: "With daily practice, she began to make progress in English.",
    },
    {
      phrase: "take notes",
      meaningVi: "ghi chép",
      example: "Good students take notes during every lecture.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I need to learn for the test tomorrow.",
      right: "I need to revise / study for the test tomorrow.",
      why: "“Learn” nhấn mạnh kết quả tiếp thu kiến thức; trước kỳ thi người ta thường nói “revise” hoặc “study for”.",
    },
    {
      wrong: "She gave me many homeworks.",
      right: "She gave me a lot of homework.",
      why: "“Homework” là danh từ không đếm được, không thêm -s và không dùng “many”.",
    },
    {
      wrong: "He got a high note on the exam.",
      right: "He got a high mark / score on the exam.",
      why: "Điểm số là “mark” hoặc “score”; “note” là ghi chú hoặc nốt nhạc.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "edu-1",
      difficulty: "easy",
      stem: "Please ___ your essay to the teacher before the end of class.",
      choices: {
        a: "hand in",
        b: "fall behind",
        c: "sit an exam",
        d: "make progress",
      },
      answer: "a",
      explanation:
        "Câu nói về nộp bài trước khi hết giờ, nên cần “hand in”. Ví dụ: “Students must hand in their worksheets today.”",
      whyWrong: {
        b: "“Fall behind” đúng khi nói bị tụt lại so với lớp, ví dụ: “He fell behind after missing two weeks.”",
        c: "“Sit an exam” đúng khi nói dự kỳ thi, ví dụ: “They will sit an exam next Friday.”",
        d: "“Make progress” đúng khi nói tiến bộ dần, ví dụ: “She is making progress in maths.”",
      },
    }),
    mcq({
      id: "edu-2",
      difficulty: "easy",
      stem: "The ___ for this project is Friday, so do not leave it until Thursday night.",
      choices: {
        a: "curriculum",
        b: "deadline",
        c: "scholarship",
        d: "attendance",
      },
      answer: "b",
      explanation:
        "Câu nhắc ngày phải hoàn thành, nên từ phù hợp là “deadline”. Ví dụ: “Our deadline is next Tuesday.”",
      whyWrong: {
        a: "“Curriculum” đúng khi nói chương trình học tổng thể, ví dụ: “The new curriculum includes coding.”",
        c: "“Scholarship” đúng khi nói học bổng, ví dụ: “She won a scholarship for university.”",
        d: "“Attendance” đúng khi nói việc đi học đều, ví dụ: “Attendance is checked every morning.”",
      },
    }),
    mcq({
      id: "edu-3",
      difficulty: "easy",
      stem: "Before the final test, Lan will ___ all her history notes carefully.",
      choices: {
        a: "enrol",
        b: "revise",
        c: "award",
        d: "attend",
      },
      answer: "b",
      explanation:
        "Hành động ôn lại kiến thức trước kỳ thi khớp với “revise”. Ví dụ: “I revise vocabulary every night.”",
      whyWrong: {
        a: "“Enrol” đúng khi đăng ký vào khóa học, ví dụ: “He enrolled in a summer course.”",
        c: "“Award” đúng khi trao giải hoặc học bổng, ví dụ: “The school awarded her a prize.”",
        d: "“Attend” đúng khi đến lớp hoặc buổi học, ví dụ: “Please attend every workshop.”",
      },
    }),
    mcq({
      id: "edu-4",
      difficulty: "easy",
      stem: "Good ___ means coming to class on time almost every day.",
      choices: {
        a: "tuition",
        b: "assignment",
        c: "attendance",
        d: "attention",
      },
      answer: "c",
      explanation:
        "Câu mô tả việc đi học đều đặn, nên dùng “attendance”. Ví dụ: “Poor attendance can lower your grade.”",
      whyWrong: {
        a: "“Tuition” đúng khi nói học phí, ví dụ: “Tuition rose by ten percent this year.”",
        b: "“Assignment” đúng khi nói bài được giao, ví dụ: “This assignment is due tomorrow.”",
        d: "“Attention” đúng khi nói sự chú ý, ví dụ: “Pay attention to the instructions.”",
      },
    }),
    mcq({
      id: "edu-5",
      difficulty: "medium",
      stem: "After missing three weeks of school, Minh began to ___ in mathematics.",
      choices: {
        a: "hand in",
        b: "fall behind",
        c: "take notes",
        d: "sit an exam",
      },
      answer: "b",
      explanation:
        "Nghỉ học lâu khiến kiến thức bị lệch so với lớp → “fall behind”. Ví dụ: “Without practice, learners fall behind quickly.”",
      whyWrong: {
        a: "“Hand in” đúng khi nộp bài, ví dụ: “Please hand in your report now.”",
        c: "“Take notes” đúng khi ghi chép bài, ví dụ: “She takes notes during every lecture.”",
        d: "“Sit an exam” đúng khi dự thi, ví dụ: “Candidates sit an exam in May.”",
      },
    }),
    mcq({
      id: "edu-6",
      difficulty: "medium",
      stem: "The university offers a full ___ to students with excellent grades and financial need.",
      choices: {
        a: "scholarship",
        b: "curriculum",
        c: "deadline",
        d: "tuition",
      },
      answer: "a",
      explanation:
        "Hỗ trợ tài chính dựa trên thành tích và hoàn cảnh là “scholarship”. Ví dụ: “He applied for a scholarship last month.”",
      whyWrong: {
        b: "“Curriculum” đúng khi nói nội dung chương trình, ví dụ: “They redesigned the science curriculum.”",
        c: "“Deadline” đúng khi nói hạn chót, ví dụ: “The application deadline is in March.”",
        d: "“Tuition” đúng khi nói số tiền phải đóng để học, ví dụ: “Tuition must be paid each semester.”",
      },
    }),
    mcq({
      id: "edu-7",
      difficulty: "medium",
      stem: "Next September, over fifty teenagers will ___ in the new design course.",
      choices: {
        a: "revise",
        b: "enrol",
        c: "graduate",
        d: "assess",
      },
      answer: "b",
      explanation:
        "Câu nói đăng ký tham gia khóa học mới → “enrol”. Ví dụ: “You can enrol online before August.”",
      whyWrong: {
        a: "“Revise” đúng khi ôn thi, ví dụ: “We revise chemistry before quizzes.”",
        c: "“Graduate” đúng khi hoàn thành khóa và nhận bằng, ví dụ: “She will graduate next year.”",
        d: "“Assess” đúng khi đánh giá năng lực hoặc bài làm, ví dụ: “Teachers assess speaking skills orally.”",
      },
    }),
    mcq({
      id: "edu-8",
      difficulty: "medium",
      stem: "Parents worry about rising ___, which makes private schools harder to afford.",
      choices: {
        a: "attendance",
        b: "assignments",
        c: "tuition",
        d: "marks",
      },
      answer: "c",
      explanation:
        "Chi phí học tăng khiến trường tư đắt hơn → “tuition”. Ví dụ: “Tuition covers classes but not books.”",
      whyWrong: {
        a: "“Attendance” đúng khi nói mức độ đi học, ví dụ: “Attendance improved after the new rule.”",
        b: "“Assignments” đúng khi nói các bài được giao, ví dụ: “Weekend assignments take two hours.”",
        d: "“Marks” đúng khi nói điểm số, ví dụ: “Her marks in physics are excellent.”",
      },
    }),
    mcq({
      id: "edu-9",
      difficulty: "hard",
      stem: "The national ___ now requires every student to complete a community project before graduation.",
      choices: {
        a: "assignment",
        b: "curriculum",
        c: "scholarship",
        d: "deadline",
      },
      answer: "b",
      explanation:
        "Yêu cầu bắt buộc trong toàn bộ chương trình học thuộc “curriculum”. Ví dụ: “The curriculum balances theory and practice.”",
      whyWrong: {
        a: "“Assignment” đúng khi nói một bài cụ thể được giao, ví dụ: “This week’s assignment is a poster.”",
        c: "“Scholarship” đúng khi nói học bổng, ví dụ: “The scholarship covers housing costs.”",
        d: "“Deadline” đúng khi nói hạn nộp, ví dụ: “Extend the deadline by two days.”",
      },
    }),
    mcq({
      id: "edu-10",
      difficulty: "hard",
      stem: "Even busy students can ___ if they review a little material each day instead of cramming.",
      choices: {
        a: "fall behind",
        b: "make progress",
        c: "hand in",
        d: "sit an exam",
      },
      answer: "b",
      explanation:
        "Ôn đều đặn giúp tiến bộ dần → “make progress”. Ví dụ: “Daily reading helps learners make progress.”",
      whyWrong: {
        a: "“Fall behind” đúng khi bị tụt lại, ví dụ: “Sick students often fall behind.”",
        c: "“Hand in” đúng khi nộp sản phẩm học tập, ví dụ: “Hand in the form at the office.”",
        d: "“Sit an exam” đúng khi tham dự kỳ thi, ví dụ: “International students sit an exam in English.”",
      },
    }),
    mcq({
      id: "edu-11",
      difficulty: "hard",
      stem: "In the UK, candidates usually ___ a written exam at the end of the academic year.",
      choices: {
        a: "sit",
        b: "win",
        c: "pay",
        d: "miss",
      },
      answer: "a",
      explanation:
        "Cụm chuẩn là “sit an exam” nghĩa dự kỳ thi viết. Ví dụ: “Thousands of pupils sit an exam every summer.”",
      whyWrong: {
        b: "“Win” đúng với giải thưởng hoặc học bổng, ví dụ: “She won a scholarship.”",
        c: "“Pay” đúng với học phí, ví dụ: “Families pay tuition each term.”",
        d: "“Miss” đúng khi bỏ lỡ hạn hoặc buổi học, ví dụ: “Do not miss the deadline.”",
      },
    }),
    mcq({
      id: "edu-12",
      difficulty: "hard",
      stem: "The teacher gave us a challenging ___ that combines research, writing, and a short presentation.",
      choices: {
        a: "tuition",
        b: "attendance",
        c: "assignment",
        d: "curriculum",
      },
      answer: "c",
      explanation:
        "Một nhiệm vụ học tập cụ thể gồm nhiều phần là “assignment”. Ví dụ: “The group assignment lasts two weeks.”",
      whyWrong: {
        a: "“Tuition” đúng khi nói học phí, ví dụ: “Scholarships can reduce tuition.”",
        b: "“Attendance” đúng khi nói việc có mặt ở lớp, ví dụ: “Attendance is recorded digitally.”",
        d: "“Curriculum” đúng khi nói toàn bộ chương trình, ví dụ: “The curriculum spans three years.”",
      },
    }),
  ],
};
