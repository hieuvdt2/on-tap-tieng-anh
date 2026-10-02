import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const technology: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-technology",
  slug: "technology",
  name: "Technology",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về công nghệ, thiết bị số và internet giúp thảo luận đời sống số ở cấp trung học.",
  overview:
    "Chủ đề bao gồm thiết bị, phần mềm, dữ liệu và thói quen dùng mạng an toàn. Bạn học phân biệt các từ gần nghĩa và chọn từ khớp ngữ cảnh câu. Các câu luyện tập kiểm tra khả năng dùng từ trong tình huống thực tế thay vì học thuộc danh sách.",
  items: [
    {
      word: "device",
      meaningVi: "thiết bị (điện tử)",
      wordClass: "noun",
      example: "Keep your device charged before the online exam.",
      note: "Chỉ máy móc nói chung: phone, tablet, laptop; cụ thể hơn thì gọi tên máy.",
    },
    {
      word: "software",
      meaningVi: "phần mềm",
      wordClass: "noun",
      example: "The school installed new software for language practice.",
      note: "Không đếm được; đối lập với “hardware” (phần cứng).",
    },
    {
      word: "update",
      meaningVi: "cập nhật",
      wordClass: "verb / noun",
      example: "Please update the app to fix security problems.",
      note: "Vừa là động từ vừa là danh từ: “download an update”.",
    },
    {
      word: "password",
      meaningVi: "mật khẩu",
      wordClass: "noun",
      example: "Never share your password with classmates.",
      note: "Đi với “strong”, “reset”, “enter a password”.",
    },
    {
      word: "download",
      meaningVi: "tải xuống",
      wordClass: "verb / noun",
      example: "Students can download the worksheet from the class website.",
      note: "Đối lập “upload” (tải lên).",
    },
    {
      word: "artificial intelligence",
      meaningVi: "trí tuệ nhân tạo",
      wordClass: "noun",
      example: "Artificial intelligence can check grammar in student essays.",
      note: "Thường viết tắt “AI”; dùng như danh từ không đếm được trong nghĩa tổng quát.",
    },
    {
      word: "cyberbullying",
      meaningVi: "bắt nạt trên mạng",
      wordClass: "noun",
      example: "Schools run workshops to prevent cyberbullying.",
      note: "Không đếm được; liên quan “online harassment”.",
    },
    {
      word: "innovate",
      meaningVi: "đổi mới / sáng tạo cái mới",
      wordClass: "verb",
      example: "Local start-ups innovate to solve traffic problems.",
      note: "Danh từ: “innovation”; người: “innovator”.",
    },
  ],
  collocations: [
    {
      phrase: "log in",
      meaningVi: "đăng nhập",
      example: "Log in with your school email to join the meeting.",
    },
    {
      phrase: "run out of battery",
      meaningVi: "hết pin",
      example: "My phone ran out of battery during the presentation.",
    },
    {
      phrase: "browse the internet",
      meaningVi: "lướt / duyệt internet",
      example: "She browses the internet for science videos after dinner.",
    },
    {
      phrase: "store data",
      meaningVi: "lưu dữ liệu",
      example: "Cloud services store data on remote servers.",
    },
    {
      phrase: "protect privacy",
      meaningVi: "bảo vệ quyền riêng tư",
      example: "Turning off location tracking helps protect privacy.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I need to install a new softwares.",
      right: "I need to install new software.",
      why: "“Software” là danh từ không đếm được, không thêm -s và thường không dùng “a”.",
    },
    {
      wrong: "Please open the internet.",
      right: "Please go online. / Please browse the internet.",
      why: "Không nói “open the internet”; dùng “go online”, “browse the internet”, hoặc “open a browser”.",
    },
    {
      wrong: "He downloaded the file into the website.",
      right: "He uploaded the file to the website. / He downloaded the file from the website.",
      why: "“Download” là tải từ mạng về máy; đưa file lên mạng là “upload”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "tech-1",
      difficulty: "easy",
      stem: "___ to the learning platform before the live lesson starts.",
      choices: {
        a: "Log in",
        b: "Run out",
        c: "Throw away",
        d: "Fall behind",
      },
      answer: "a",
      explanation:
        "Vào tài khoản trước buổi học trực tuyến → “Log in”. Ví dụ: “Log in with your student ID.”",
      whyWrong: {
        b: "“Run out” đúng khi hết pin hoặc hết thời gian, ví dụ: “We ran out of battery mid-call.”",
        c: "“Throw away” đúng khi vứt đồ, ví dụ: “Do not throw away old cables carelessly.”",
        d: "“Fall behind” đúng khi bị tụt tiến độ học, ví dụ: “He fell behind in programming class.”",
      },
    }),
    mcq({
      id: "tech-2",
      difficulty: "easy",
      stem: "Choose a strong ___ that mixes letters, numbers, and symbols.",
      choices: {
        a: "device",
        b: "password",
        c: "software",
        d: "update",
      },
      answer: "b",
      explanation:
        "Chuỗi ký tự bảo vệ tài khoản là “password”. Ví dụ: “Reset your password every few months.”",
      whyWrong: {
        a: "“Device” đúng khi nói thiết bị điện tử, ví dụ: “Leave your device on the desk.”",
        c: "“Software” đúng khi nói chương trình máy tính, ví dụ: “The software translates text.”",
        d: "“Update” đúng khi nói bản cập nhật hoặc hành động cập nhật, ví dụ: “Install the latest update.”",
      },
    }),
    mcq({
      id: "tech-3",
      difficulty: "easy",
      stem: "You can ___ the listening file and practise offline on the bus.",
      choices: {
        a: "upload",
        b: "download",
        c: "delete",
        d: "print",
      },
      answer: "b",
      explanation:
        "Lấy file từ mạng về máy để nghe offline → “download”. Ví dụ: “Download the map before the trip.”",
      whyWrong: {
        a: "“Upload” đúng khi đưa file từ máy lên mạng, ví dụ: “Upload your video to the drive.”",
        c: "“Delete” đúng khi xóa file, ví dụ: “Delete old drafts to free space.”",
        d: "“Print” đúng khi in ra giấy, ví dụ: “Print the ticket at home.”",
      },
    }),
    mcq({
      id: "tech-4",
      difficulty: "easy",
      stem: "My tablet ___ during the quiz, so I could not submit answers.",
      choices: {
        a: "stored data",
        b: "ran out of battery",
        c: "browsed the internet",
        d: "protected privacy",
      },
      answer: "b",
      explanation:
        "Máy hết pin giữa bài kiểm tra → “ran out of battery”. Ví dụ: “Her laptop ran out of battery in class.”",
      whyWrong: {
        a: "“Store data” đúng khi lưu thông tin, ví dụ: “Servers store data securely.”",
        c: "“Browse the internet” đúng khi lướt web, ví dụ: “He browses the internet for news.”",
        d: "“Protect privacy” đúng khi giữ thông tin cá nhân an toàn, ví dụ: “Settings help protect privacy.”",
      },
    }),
    mcq({
      id: "tech-5",
      difficulty: "medium",
      stem: "Teachers use educational ___ to create quizzes and track scores.",
      choices: {
        a: "hardware",
        b: "software",
        c: "batteries",
        d: "keyboards",
      },
      answer: "b",
      explanation:
        "Chương trình tạo quiz và theo dõi điểm là “software”. Ví dụ: “Anti-virus software scans files.”",
      whyWrong: {
        a: "“Hardware” đúng khi nói phần cứng như màn hình, chip, ví dụ: “The lab needs new hardware.”",
        c: "“Batteries” đúng khi nói pin, ví dụ: “Spare batteries keep cameras working.”",
        d: "“Keyboards” đúng khi nói bàn phím, ví dụ: “Broken keyboards slow typing.”",
      },
    }),
    mcq({
      id: "tech-6",
      difficulty: "medium",
      stem: "Always ___ your messaging app so it receives the newest security fixes.",
      choices: {
        a: "ignore",
        b: "update",
        c: "borrow",
        d: "unplug",
      },
      answer: "b",
      explanation:
        "Cài bản mới để vá lỗi bảo mật → “update”. Ví dụ: “Update your phone overnight.”",
      whyWrong: {
        a: "“Ignore” đúng khi bỏ qua thông báo, ví dụ: “Do not ignore warning messages.”",
        c: "“Borrow” đúng khi mượn thiết bị, ví dụ: “You may borrow a charger from the office.”",
        d: "“Unplug” đúng khi rút dây nguồn, ví dụ: “Unplug the router during storms.”",
      },
    }),
    mcq({
      id: "tech-7",
      difficulty: "medium",
      stem: "Cloud services can ___ photos so you open them from any computer.",
      choices: {
        a: "store data",
        b: "run out of battery",
        c: "log in",
        d: "cut down trees",
      },
      answer: "a",
      explanation:
        "Giữ ảnh trên máy chủ để mở ở nhiều nơi → “store data”. Ví dụ: “Hospitals store data carefully.”",
      whyWrong: {
        b: "“Run out of battery” đúng khi hết pin, ví dụ: “The drone ran out of battery outdoors.”",
        c: "“Log in” đúng khi đăng nhập, ví dụ: “Log in before editing the document.”",
        d: "“Cut down trees” thuộc chủ đề môi trường, ví dụ: “Builders cut down trees for roads.”",
      },
    }),
    mcq({
      id: "tech-8",
      difficulty: "medium",
      stem: "Reading privacy settings carefully is a simple way to ___.",
      choices: {
        a: "browse the internet",
        b: "protect privacy",
        c: "run out of battery",
        d: "throw away devices",
      },
      answer: "b",
      explanation:
        "Điều chỉnh cài đặt để giữ thông tin cá nhân → “protect privacy”. Ví dụ: “Strong passwords protect privacy.”",
      whyWrong: {
        a: "“Browse the internet” đúng khi tìm thông tin trên mạng, ví dụ: “Students browse the internet for sources.”",
        c: "“Run out of battery” đúng khi hết pin, ví dụ: “Earbuds ran out of battery quickly.”",
        d: "“Throw away devices” đúng khi vứt thiết bị, ví dụ: “Do not throw away devices with household trash.”",
      },
    }),
    mcq({
      id: "tech-9",
      difficulty: "hard",
      stem: "___ can suggest answers, but students should still check facts themselves.",
      choices: {
        a: "Cyberbullying",
        b: "Artificial intelligence",
        c: "A password",
        d: "A battery",
      },
      answer: "b",
      explanation:
        "Hệ thống gợi ý câu trả lời tự động thuộc “artificial intelligence”. Ví dụ: “Artificial intelligence powers translation tools.”",
      whyWrong: {
        a: "“Cyberbullying” đúng khi nói bắt nạt trực tuyến, ví dụ: “Cyberbullying harms mental health.”",
        c: "“A password” đúng khi nói mật khẩu đăng nhập, ví dụ: “A password keeps accounts safe.”",
        d: "“A battery” đúng khi nói nguồn pin, ví dụ: “A battery powers the wireless mouse.”",
      },
    }),
    mcq({
      id: "tech-10",
      difficulty: "hard",
      stem: "Reporting mean comments and blocking senders can reduce ___ at school.",
      choices: {
        a: "cyberbullying",
        b: "innovation",
        c: "software",
        d: "bandwidth",
      },
      answer: "a",
      explanation:
        "Bình luận độc hại trên mạng là “cyberbullying”. Ví dụ: “Clear rules discourage cyberbullying.”",
      whyWrong: {
        b: "“Innovation” đúng khi nói sự đổi mới, ví dụ: “Innovation drives the tech industry.”",
        c: "“Software” đúng khi nói phần mềm, ví dụ: “The software crashed during class.”",
        d: "“Bandwidth” đúng khi nói băng thông mạng, ví dụ: “Limited bandwidth slows video calls.”",
      },
    }),
    mcq({
      id: "tech-11",
      difficulty: "hard",
      stem: "Young engineers ___ when they design tools that solve real community problems.",
      choices: {
        a: "innovate",
        b: "pollute",
        c: "enrol",
        d: "revise",
      },
      answer: "a",
      explanation:
        "Thiết kế công cụ mới giải quyết vấn đề thực tế → “innovate”. Ví dụ: “Teams innovate at the weekend hackathon.”",
      whyWrong: {
        b: "“Pollute” đúng trong chủ đề môi trường, ví dụ: “Old factories pollute rivers.”",
        c: "“Enrol” đúng khi đăng ký học, ví dụ: “Students enrol in coding clubs.”",
        d: "“Revise” đúng khi ôn bài, ví dụ: “Candidates revise before oral tests.”",
      },
    }),
    mcq({
      id: "tech-12",
      difficulty: "hard",
      stem: "Bring only one personal ___ into the exam room: a simple calculator without internet.",
      choices: {
        a: "device",
        b: "curriculum",
        c: "emission",
        d: "scholarship",
      },
      answer: "a",
      explanation:
        "Máy tính bỏ túi là một “device” được phép mang vào. Ví dụ: “Turn off every device during takeoff.”",
      whyWrong: {
        b: "“Curriculum” đúng khi nói chương trình học, ví dụ: “The curriculum includes digital skills.”",
        c: "“Emission” đúng khi nói khí thải, ví dụ: “Lower emissions improve city air.”",
        d: "“Scholarship” đúng khi nói học bổng, ví dụ: “A scholarship funded her laptop.”",
      },
    }),
  ],
};
