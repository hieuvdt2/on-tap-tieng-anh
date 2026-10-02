import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const community: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-community",
  slug: "community",
  name: "Community",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về cộng đồng, tình nguyện và hoạt động địa phương giúp bạn nói về đời sống chung quanh mình.",
  overview:
    "Chủ đề này tập trung vào các từ và cụm từ khi nói về hàng xóm, tình nguyện, gây quỹ và trách nhiệm công dân. Bạn sẽ học chọn từ đúng theo ngữ cảnh thay vì dịch từng chữ. Các câu luyện tập yêu cầu điền từ vào câu hoàn chỉnh để củng cố nghĩa và cách dùng.",
  items: [
    {
      word: "volunteer",
      meaningVi: "tình nguyện viên / tình nguyện",
      wordClass: "noun / verb",
      example: "Many students volunteer at the local library on weekends.",
      note: "Danh từ chỉ người; động từ nghĩa là tình nguyện làm việc không lấy lương.",
    },
    {
      word: "resident",
      meaningVi: "cư dân",
      wordClass: "noun",
      example: "Local residents asked the council for better street lighting.",
      note: "Người sống ổn định ở một khu vực; khác “visitor” (khách).",
    },
    {
      word: "charity",
      meaningVi: "tổ chức từ thiện / việc làm từ thiện",
      wordClass: "noun",
      example: "The charity provides warm meals for people in need.",
      note: "Có thể chỉ tổ chức hoặc hành động giúp đỡ; hay đi với “donate to charity”.",
    },
    {
      word: "donate",
      meaningVi: "quyên góp / tặng",
      wordClass: "verb",
      example: "Neighbours donated clothes and books after the flood.",
      note: "Đối tượng thường là tiền, đồ dùng hoặc máu: donate blood.",
    },
    {
      word: "campaign",
      meaningVi: "chiến dịch (vận động)",
      wordClass: "noun / verb",
      example: "The youth group launched a campaign against littering.",
      note: "Một nỗ lực có tổ chức nhằm thay đổi thái độ hoặc hành vi công chúng.",
    },
    {
      word: "neighbourhood",
      meaningVi: "khu phố / vùng lân cận",
      wordClass: "noun",
      example: "Our neighbourhood organises a clean-up every spring.",
      note: "Anh-Anh viết “neighbourhood”; Mỹ thường viết “neighborhood”.",
    },
    {
      word: "fundraising",
      meaningVi: "gây quỹ",
      wordClass: "noun",
      example: "The school’s fundraising event raised money for new sports equipment.",
      note: "Hoạt động thu tiền cho mục đích chung; động từ liên quan là “raise funds”.",
    },
    {
      word: "civic",
      meaningVi: "thuộc về công dân / công cộng",
      wordClass: "adjective",
      example: "Voting is an important civic duty in a democracy.",
      note: "Thường đứng trước danh từ: civic duty, civic centre, civic pride.",
    },
  ],
  collocations: [
    {
      phrase: "lend a hand",
      meaningVi: "giúp một tay",
      example: "Could you lend a hand with carrying these boxes?",
    },
    {
      phrase: "take part in",
      meaningVi: "tham gia",
      example: "Hundreds of families take part in the annual street festival.",
    },
    {
      phrase: "raise funds",
      meaningVi: "gây quỹ / quyên góp tiền",
      example: "The club raises funds by selling homemade cakes.",
    },
    {
      phrase: "community service",
      meaningVi: "lao động công ích / phục vụ cộng đồng",
      example: "Students complete community service at the elderly centre.",
    },
    {
      phrase: "look out for",
      meaningVi: "để ý / trông chừng (người khác)",
      example: "Good neighbours look out for one another during storms.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I want to voluntary at the animal shelter.",
      right: "I want to volunteer at the animal shelter.",
      why: "“Voluntary” là tính từ; động từ cần dùng là “volunteer”.",
    },
    {
      wrong: "They donated the charity a lot of money.",
      right: "They donated a lot of money to the charity.",
      why: "Cấu trúc chuẩn là “donate something to someone/something”, không đặt tổ chức ngay sau “donate”.",
    },
    {
      wrong: "She joined in a campaign of recycling.",
      right: "She joined a recycling campaign. / She took part in a recycling campaign.",
      why: "Nói tham gia chiến dịch dùng “join a campaign” hoặc “take part in a campaign”; “campaign of recycling” nghe không tự nhiên.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "com-1",
      difficulty: "easy",
      stem: "Every Saturday, Hoa works as a ___ at the food bank without getting paid.",
      choices: {
        a: "resident",
        b: "volunteer",
        c: "campaign",
        d: "neighbourhood",
      },
      answer: "b",
      explanation:
        "Người làm việc không lương để giúp người khác là “volunteer”. Ví dụ: “He is a volunteer at the youth centre.”",
      whyWrong: {
        a: "“Resident” đúng khi nói cư dân sống ở đó, ví dụ: “Residents complained about noise.”",
        c: "“Campaign” đúng khi nói chiến dịch vận động, ví dụ: “The campaign lasted three months.”",
        d: "“Neighbourhood” đúng khi nói khu phố, ví dụ: “This neighbourhood feels safe at night.”",
      },
    }),
    mcq({
      id: "com-2",
      difficulty: "easy",
      stem: "Please ___ old textbooks to the library so other students can use them.",
      choices: {
        a: "donate",
        b: "campaign",
        c: "reside",
        d: "attend",
      },
      answer: "a",
      explanation:
        "Đưa sách cũ cho thư viện để người khác dùng khớp với “donate”. Ví dụ: “Families donate warm coats each winter.”",
      whyWrong: {
        b: "“Campaign” đúng khi tổ chức hoặc tham gia chiến dịch, ví dụ: “They campaigned for cleaner parks.”",
        c: "“Reside” đúng khi nói sống ở một nơi, ví dụ: “She resides near the market.”",
        d: "“Attend” đúng khi đến một sự kiện hoặc lớp, ví dụ: “Please attend the town meeting.”",
      },
    }),
    mcq({
      id: "com-3",
      difficulty: "easy",
      stem: "If you have free time, please ___ a hand with painting the playground fence.",
      choices: {
        a: "raise",
        b: "lend",
        c: "take",
        d: "look",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “lend a hand” nghĩa giúp một tay. Ví dụ: “Neighbours lent a hand after the storm.”",
      whyWrong: {
        a: "“Raise” đúng trong “raise funds”, ví dụ: “We raised funds for the shelter.”",
        c: "“Take” đúng trong “take part in”, ví dụ: “They took part in the parade.”",
        d: "“Look” đúng trong “look out for”, ví dụ: “Please look out for elderly neighbours.”",
      },
    }),
    mcq({
      id: "com-4",
      difficulty: "easy",
      stem: "The local ___ provides free English classes for newcomers to the city.",
      choices: {
        a: "deadline",
        b: "charity",
        c: "headline",
        d: "tuition",
      },
      answer: "b",
      explanation:
        "Tổ chức giúp người mới đến bằng lớp học miễn phí là “charity”. Ví dụ: “The charity supports homeless families.”",
      whyWrong: {
        a: "“Deadline” đúng khi nói hạn chót, ví dụ: “The deadline is next Friday.”",
        c: "“Headline” đúng khi nói tiêu đề báo, ví dụ: “The headline shocked readers.”",
        d: "“Tuition” đúng khi nói học phí, ví dụ: “Tuition rose this year.”",
      },
    }),
    mcq({
      id: "com-5",
      difficulty: "medium",
      stem: "___ of this block signed a letter asking for a safer pedestrian crossing.",
      choices: {
        a: "Volunteers",
        b: "Campaigns",
        c: "Residents",
        d: "Charities",
      },
      answer: "c",
      explanation:
        "Người sống trong khu nhà ký thư kiến nghị → “residents”. Ví dụ: “Residents want quieter nights.”",
      whyWrong: {
        a: "“Volunteers” đúng khi nói người tình nguyện giúp việc, ví dụ: “Volunteers cleaned the riverbank.”",
        b: "“Campaigns” đúng khi nói các chiến dịch, ví dụ: “Two campaigns started last month.”",
        d: "“Charities” đúng khi nói tổ chức từ thiện, ví dụ: “Several charities shared the donations.”",
      },
    }),
    mcq({
      id: "com-6",
      difficulty: "medium",
      stem: "The youth club hopes to ___ funds for a new community garden this summer.",
      choices: {
        a: "lend",
        b: "raise",
        c: "look",
        d: "serve",
      },
      answer: "b",
      explanation:
        "Cụm chuẩn là “raise funds” nghĩa gây quỹ. Ví dụ: “They raise funds through a charity run.”",
      whyWrong: {
        a: "“Lend” đúng trong “lend a hand”, ví dụ: “Can you lend a hand tomorrow?”",
        c: "“Look” đúng trong “look out for”, ví dụ: “We look out for children near the road.”",
        d: "“Serve” đúng khi nói phục vụ cộng đồng, ví dụ: “She serves on the neighbourhood council.”",
      },
    }),
    mcq({
      id: "com-7",
      difficulty: "medium",
      stem: "More than two hundred people will ___ part in the river clean-up on Sunday.",
      choices: {
        a: "make",
        b: "do",
        c: "take",
        d: "give",
      },
      answer: "c",
      explanation:
        "Cụm cố định là “take part in” nghĩa tham gia. Ví dụ: “Families take part in the festival every year.”",
      whyWrong: {
        a: "“Make” đúng với cụm như “make a decision”, không đi với “part in”.",
        b: "“Do” đúng với “do community service”, ví dụ: “Students do community service each term.”",
        d: "“Give” đúng với “give support” hoặc “give a hand” (ít phổ biến hơn “lend a hand”).",
      },
    }),
    mcq({
      id: "com-8",
      difficulty: "medium",
      stem: "Their anti-plastic ___ used posters, school talks, and a weekend market stall.",
      choices: {
        a: "resident",
        b: "neighbourhood",
        c: "campaign",
        d: "volunteer",
      },
      answer: "c",
      explanation:
        "Chuỗi hoạt động có tổ chức nhằm giảm nhựa là “campaign”. Ví dụ: “The campaign reached every school.”",
      whyWrong: {
        a: "“Resident” đúng khi nói một cư dân, ví dụ: “A resident reported the broken light.”",
        b: "“Neighbourhood” đúng khi nói khu vực sống, ví dụ: “The neighbourhood feels friendlier now.”",
        d: "“Volunteer” đúng khi nói người hoặc hành động tình nguyện, ví dụ: “She volunteered as a guide.”",
      },
    }),
    mcq({
      id: "com-9",
      difficulty: "hard",
      stem: "After school, students complete ___ service at the elderly day-care centre.",
      choices: {
        a: "civic",
        b: "community",
        c: "resident",
        d: "charity",
      },
      answer: "b",
      explanation:
        "Cụm chuẩn là “community service” nghĩa phục vụ cộng đồng. Ví dụ: “Community service teaches teamwork.”",
      whyWrong: {
        a: "“Civic” đúng trước danh từ như “civic duty”, ví dụ: “Voting is a civic duty.” Không nói “civic service” theo nghĩa này.",
        c: "“Resident” là danh từ chỉ người, không tạo cụm “resident service” ở đây.",
        d: "“Charity” đúng khi nói tổ chức hoặc việc từ thiện, ví dụ: “She works for a charity.” Không thay cho “community service”.",
      },
    }),
    mcq({
      id: "com-10",
      difficulty: "hard",
      stem: "The school’s ___ evening featured a concert and a raffle to pay for library repairs.",
      choices: {
        a: "fundraising",
        b: "volunteer",
        c: "resident",
        d: "neighbourhood",
      },
      answer: "a",
      explanation:
        "Buổi tối tổ chức để thu tiền sửa thư viện là hoạt động “fundraising”. Ví dụ: “Fundraising evenings need many helpers.”",
      whyWrong: {
        b: "“Volunteer” đúng khi nói người tình nguyện, ví dụ: “Volunteer training starts at six.”",
        c: "“Resident” đúng khi nói cư dân, ví dụ: “Resident parking is limited.”",
        d: "“Neighbourhood” đúng khi nói khu phố, ví dụ: “Neighbourhood watch meetings are monthly.”",
      },
    }),
    mcq({
      id: "com-11",
      difficulty: "hard",
      stem: "In a healthy democracy, voting is seen as a basic ___ responsibility.",
      choices: {
        a: "charity",
        b: "civic",
        c: "fundraising",
        d: "voluntary",
      },
      answer: "b",
      explanation:
        "Trách nhiệm của công dân gắn với từ “civic”: “civic responsibility”. Ví dụ: “Civic responsibility includes caring for public spaces.”",
      whyWrong: {
        a: "“Charity” là danh từ; không đứng trước “responsibility” theo nghĩa này.",
        c: "“Fundraising” đúng khi nói gây quỹ, ví dụ: “Fundraising targets were met early.”",
        d: "“Voluntary” đúng khi nói việc không bắt buộc, ví dụ: “Voluntary work looks good on a CV.” Không thay “civic” ở đây.",
      },
    }),
    mcq({
      id: "com-12",
      difficulty: "hard",
      stem: "During heavy rain, people in this ___ look out for elderly neighbours who live alone.",
      choices: {
        a: "campaign",
        b: "charity",
        c: "neighbourhood",
        d: "deadline",
      },
      answer: "c",
      explanation:
        "Khu vực nơi mọi người sống gần nhau và giúp đỡ nhau là “neighbourhood”. Ví dụ: “Our neighbourhood holds a picnic each autumn.”",
      whyWrong: {
        a: "“Campaign” đúng khi nói chiến dịch vận động, ví dụ: “The campaign ended in May.”",
        b: "“Charity” đúng khi nói tổ chức từ thiện, ví dụ: “The charity opened a new shelter.”",
        d: "“Deadline” đúng khi nói hạn chót, ví dụ: “Meet the deadline for applications.”",
      },
    }),
  ],
};
