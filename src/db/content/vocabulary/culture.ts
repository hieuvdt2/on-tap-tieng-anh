import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const culture: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-culture",
  slug: "culture",
  name: "Culture",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về văn hóa: truyền thống, tập quán, di sản, lễ hội và cách ứng xử trong môi trường đa văn hóa.",
  overview:
    "Bài này giúp bạn phân biệt “tradition”, “custom”, “heritage”, “etiquette” và dùng chúng đúng trong câu nói về lễ hội, nghi thức và giao tiếp giữa các nền văn hóa. Học kèm cụm như “pass down a tradition”, “cultural diversity” để viết và nói tự nhiên hơn ở cấp THPT.",
  items: [
    {
      word: "tradition",
      meaningVi: "truyền thống",
      wordClass: "noun",
      example: "Sharing sticky rice cakes is a New Year tradition in many families.",
      note: "Tính từ: “traditional”; trạng từ: “traditionally”.",
    },
    {
      word: "custom",
      meaningVi: "phong tục; tập quán",
      wordClass: "noun",
      example: "It is a local custom to remove shoes before entering a home.",
      note: "Gần “tradition”, nhưng “custom” nhấn hành vi thường làm trong cộng đồng.",
    },
    {
      word: "heritage",
      meaningVi: "di sản (văn hóa, lịch sử)",
      wordClass: "noun",
      example: "Ancient temples are part of the country’s cultural heritage.",
      note: "Thường không đếm được khi nói chung: “world heritage”.",
    },
    {
      word: "ritual",
      meaningVi: "nghi thức; nghi lễ",
      wordClass: "noun",
      example: "The tea ritual slows the meal and shows respect to guests.",
      note: "Có thể dùng ẩn dụ cho thói quen trang trọng lặp lại.",
    },
    {
      word: "etiquette",
      meaningVi: "phép lịch sự; quy tắc ứng xử",
      wordClass: "noun",
      example: "Business etiquette differs from country to country.",
      note: "Không đếm được; nói “rules of etiquette”.",
    },
    {
      word: "multicultural",
      meaningVi: "đa văn hóa",
      wordClass: "adjective",
      example: "The neighborhood is multicultural, with food from many regions.",
      note: "Danh từ liên quan: “multiculturalism”.",
    },
    {
      word: "folklore",
      meaningVi: "văn học dân gian; truyền thuyết dân gian",
      wordClass: "noun",
      example: "Village folklore explains why the mountain has that name.",
      note: "Không đếm được; gồm chuyện cổ, bài hát, tín ngưỡng dân gian.",
    },
    {
      word: "festival",
      meaningVi: "lễ hội",
      wordClass: "noun",
      example: "The lantern festival lights up the river every autumn.",
      note: "Có thể đếm được: “two festivals this month”.",
    },
  ],
  collocations: [
    {
      phrase: "pass down a tradition",
      meaningVi: "truyền lại một truyền thống",
      example: "Grandparents pass down traditions through stories and cooking.",
    },
    {
      phrase: "cultural diversity",
      meaningVi: "sự đa dạng văn hóa",
      example: "The school celebrates cultural diversity every spring.",
    },
    {
      phrase: "preserve heritage",
      meaningVi: "bảo tồn di sản",
      example: "Museums help communities preserve heritage for the next generation.",
    },
    {
      phrase: "observe a custom",
      meaningVi: "tuân theo/thực hành một phong tục",
      example: "Visitors should observe local customs during ceremonies.",
    },
    {
      phrase: "cultural exchange",
      meaningVi: "giao lưu văn hóa",
      example: "The exchange program promotes cultural exchange between schools.",
    },
  ],
  commonMistakes: [
    {
      wrong: "We should preserve our heritages carefully.",
      right: "We should preserve our heritage carefully.",
      why: "“heritage” thường không đếm được khi nói di sản văn hóa nói chung.",
    },
    {
      wrong: "It is a traditional to bow when greeting elders.",
      right: "It is a tradition to bow when greeting elders. / It is traditional to bow…",
      why: "“traditional” là tính từ; danh từ cần “tradition”.",
    },
    {
      wrong: "Good etiquettes are important in meetings.",
      right: "Good etiquette is important in meetings.",
      why: "“etiquette” không đếm được; không thêm -s.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "cul-1",
      difficulty: "easy",
      stem: "Making moon cakes together is a Mid-Autumn ___ in her family.",
      choices: {
        a: "tradition",
        b: "device",
        c: "salary",
        d: "traffic",
      },
      answer: "a",
      explanation:
        "Việc làm bánh trung thu cùng nhau là thói quen được giữ qua các năm → “tradition”. Ví dụ: “Lighting incense is a family tradition.”",
      whyWrong: {
        b: "“device” đúng khi nói thiết bị: “This device records folk songs.”",
        c: "“salary” đúng khi nói lương: “Her salary covers festival travel.”",
        d: "“traffic” đúng khi nói giao thông: “Festival traffic fills the streets.”",
      },
    }),
    mcq({
      id: "cul-2",
      difficulty: "easy",
      stem: "In that village, it is a ___ to greet neighbors before starting work.",
      choices: {
        a: "custom",
        b: "battery",
        c: "password",
        d: "receipt",
      },
      answer: "a",
      explanation:
        "Hành vi chào hàng xóm trước khi làm việc là tập quán địa phương → “custom”. Ví dụ: “Removing shoes indoors is a common custom.”",
      whyWrong: {
        b: "“battery” đúng khi nói pin: “The camera battery died during the parade.”",
        c: "“password” đúng khi nói mật khẩu: “Change your password after the trip.”",
        d: "“receipt” đúng khi nói hóa đơn: “Keep the receipt from the craft market.”",
      },
    }),
    mcq({
      id: "cul-3",
      difficulty: "easy",
      stem: "The old bridge is listed as national ___ and cannot be rebuilt freely.",
      choices: {
        a: "heritage",
        b: "homework",
        c: "luggage",
        d: "furniture",
      },
      answer: "a",
      explanation:
        "Cầu cổ được xếp hạng bảo vệ → “heritage” (di sản). Ví dụ: “Folk music is living cultural heritage.”",
      whyWrong: {
        b: "“homework” đúng khi nói bài tập: “Students finished their homework before the show.”",
        c: "“luggage” đúng khi nói hành lý: “Leave luggage outside the temple gate.”",
        d: "“furniture” đúng khi nói đồ nội thất: “Temple furniture is simple and dark wood.”",
      },
    }),
    mcq({
      id: "cul-4",
      difficulty: "easy",
      stem: "Thousands join the river ___ to watch floating lanterns at night.",
      choices: {
        a: "festival",
        b: "invoice",
        c: "deadline",
        d: "vaccine",
      },
      answer: "a",
      explanation:
        "Hàng nghìn người tụ họp xem đèn hoa đăng → “festival”. Ví dụ: “The harvest festival lasts three days.”",
      whyWrong: {
        b: "“invoice” đúng khi nói hóa đơn thanh toán: “The museum sent an invoice for the tour.”",
        c: "“deadline” đúng khi nói hạn chót: “The essay deadline is Friday.”",
        d: "“vaccine” đúng khi nói vắc-xin: “Travelers asked about the vaccine.”",
      },
    }),
    mcq({
      id: "cul-5",
      difficulty: "medium",
      stem: "Before the ceremony, elders perform a short ___ with incense and quiet bows.",
      choices: {
        a: "ritual",
        b: "gadget",
        c: "budget",
        d: "interview",
      },
      answer: "a",
      explanation:
        "Nghi thức với hương và cúi chào trang trọng → “ritual”. Ví dụ: “A welcome ritual opens the cultural night.”",
      whyWrong: {
        b: "“gadget” đúng khi nói đồ điện tử nhỏ: “The guide used a gadget to translate signs.”",
        c: "“budget” đúng khi nói ngân sách: “The festival budget covers lights and food.”",
        d: "“interview” đúng khi nói buổi phỏng vấn: “The artist gave an interview after the show.”",
      },
    }),
    mcq({
      id: "cul-6",
      difficulty: "medium",
      stem: "Table ___ in that country means waiting until the oldest person starts eating.",
      choices: {
        a: "etiquette",
        b: "engine",
        c: "allergy",
        d: "password",
      },
      answer: "a",
      explanation:
        "Quy tắc ứng xử khi ăn (chờ người lớn tuổi) → “etiquette”. Ví dụ: “Phone etiquette differs across cultures.”",
      whyWrong: {
        b: "“engine” đúng khi nói động cơ: “The boat engine stopped near the pier.”",
        c: "“allergy” đúng khi dị ứng: “Check food labels if you have an allergy.”",
        d: "“password” đúng khi nói mật khẩu: “Do not share your password with tourists.”",
      },
    }),
    mcq({
      id: "cul-7",
      difficulty: "medium",
      stem: "Their ___ city mixes languages, cuisines, and festivals from many regions.",
      choices: {
        a: "multicultural",
        b: "identical",
        c: "silent",
        d: "empty",
      },
      answer: "a",
      explanation:
        "Thành phố có nhiều ngôn ngữ, ẩm thực, lễ hội → “multicultural”. Ví dụ: “A multicultural classroom shares many viewpoints.”",
      whyWrong: {
        b: "“identical” đúng khi giống hệt: “The twin masks look identical.”",
        c: "“silent” đúng khi im lặng: “The hall was silent during the prayer.”",
        d: "“empty” đúng khi trống: “The square looked empty after midnight.”",
      },
    }),
    mcq({
      id: "cul-8",
      difficulty: "medium",
      stem: "Local ___ tells how the lake was formed by a giant’s footprint.",
      choices: {
        a: "folklore",
        b: "software",
        c: "furniture",
        d: "nutrition",
      },
      answer: "a",
      explanation:
        "Câu chuyện dân gian giải thích nguồn gốc hồ → “folklore”. Ví dụ: “Coastal folklore is full of storm legends.”",
      whyWrong: {
        b: "“software” đúng khi nói phần mềm: “The museum uses software to map artifacts.”",
        c: "“furniture” đúng khi nói nội thất: “Hand-carved furniture fills the hall.”",
        d: "“nutrition” đúng khi nói dinh dưỡng: “Festival food still needs good nutrition.”",
      },
    }),
    mcq({
      id: "cul-9",
      difficulty: "hard",
      stem: "Grandparents ___ the New Year tradition by teaching children how to prepare offerings.",
      choices: {
        a: "pass down",
        b: "pass out",
        c: "pass away",
        d: "pass up",
      },
      answer: "a",
      explanation:
        "Ông bà truyền lại truyền thống Tết bằng cách dạy chuẩn bị lễ → “pass down”. Ví dụ: “Songs are passed down through generations.”",
      whyWrong: {
        b: "“pass out” đúng khi ngất hoặc phát tài liệu: “He passed out from the heat.” / “Please pass out the leaflets.”",
        c: "“pass away” đúng khi nói ai đó qua đời: “Her great-uncle passed away last spring.”",
        d: "“pass up” đúng khi bỏ lỡ cơ hội: “Don’t pass up a chance to join the exchange.”",
      },
    }),
    mcq({
      id: "cul-10",
      difficulty: "hard",
      stem: "Tour guides ask visitors to ___ the custom of speaking softly inside the shrine.",
      choices: {
        a: "observe",
        b: "ignore",
        c: "delete",
        d: "borrow",
      },
      answer: "a",
      explanation:
        "Hướng dẫn viên yêu cầu tuân theo phong tục nói nhỏ trong đền → “observe a custom”. Ví dụ: “Travelers should observe local dress customs.”",
      whyWrong: {
        b: "“ignore” đúng khi cố tình bỏ qua: “Do not ignore temple rules about photos.”",
        c: "“delete” đúng khi xóa dữ liệu: “Delete the draft before printing the program.”",
        d: "“borrow” đúng khi mượn: “You may borrow a scarf at the entrance.”",
      },
    }),
    mcq({
      id: "cul-11",
      difficulty: "hard",
      stem: "The museum project aims to ___ fragile heritage before coastal storms damage it.",
      choices: {
        a: "preserve",
        b: "replace",
        c: "postpone",
        d: "export",
      },
      answer: "a",
      explanation:
        "Dự án bảo vệ di sản mỏng manh trước bão → “preserve”. Ví dụ: “Communities preserve heritage through careful restoration.”",
      whyWrong: {
        b: "“replace” đúng khi thay thế: “They replaced the broken gate with a copy.”",
        c: "“postpone” đúng khi hoãn: “Organizers postponed the outdoor festival.”",
        d: "“export” đúng khi xuất khẩu: “Craft villages export handmade textiles.”",
      },
    }),
    mcq({
      id: "cul-12",
      difficulty: "hard",
      stem: "Student clubs organize food nights to encourage ___ between international classmates.",
      choices: {
        a: "cultural exchange",
        b: "cultural silence",
        c: "cultural delay",
        d: "cultural debt",
      },
      answer: "a",
      explanation:
        "Đêm ẩm thực giúp học sinh quốc tế chia sẻ và học hỏi lẫn nhau → “cultural exchange”. Ví dụ: “Pen-pal letters support cultural exchange.”",
      whyWrong: {
        b: "“cultural silence” không phải cụm chuẩn; nếu muốn nói im lặng trang trọng dùng “a moment of silence”.",
        c: "“cultural delay” không dùng để nói giao lưu; “delay” đúng khi trì hoãn sự kiện: “Rain caused a delay.”",
        d: "“cultural debt” không phải cụm học thuật phổ biến ở cấp này; “debt” đúng khi nói nợ tiền: “He paid off his debt.”",
      },
    }),
  ],
};
