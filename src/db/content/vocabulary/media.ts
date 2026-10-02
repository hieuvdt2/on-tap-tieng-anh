import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const media: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-media",
  slug: "media",
  name: "Media",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về báo chí, truyền hình và mạng xã hội giúp bạn nói về tin tức và cách thông tin lan truyền.",
  overview:
    "Chủ đề này tập trung vào các từ và cụm từ khi nói về tiêu đề, phóng viên, khán giả và độ phủ tin. Bạn sẽ học phân biệt từ gần nghĩa theo ngữ cảnh thực tế. Các câu luyện tập yêu cầu điền từ vào câu hoàn chỉnh để củng cố nghĩa và cách dùng.",
  items: [
    {
      word: "headline",
      meaningVi: "tiêu đề (bài báo / tin)",
      wordClass: "noun",
      example: "The headline on the front page caught everyone’s attention.",
      note: "Dòng chữ lớn trên đầu bài; khác “title” mang tính chung hơn.",
    },
    {
      word: "journalist",
      meaningVi: "nhà báo",
      wordClass: "noun",
      example: "The journalist interviewed witnesses after the accident.",
      note: "Người viết hoặc đưa tin chuyên nghiệp; gần nghĩa “reporter” nhưng rộng hơn.",
    },
    {
      word: "broadcast",
      meaningVi: "phát sóng",
      wordClass: "verb / noun",
      example: "The channel will broadcast the debate live tonight.",
      note: "Thường dùng cho TV hoặc radio; danh từ chỉ chương trình được phát.",
    },
    {
      word: "audience",
      meaningVi: "khán giả / độc giả (người tiếp nhận)",
      wordClass: "noun",
      example: "The show’s audience has grown since it moved online.",
      note: "Nhóm người xem, nghe hoặc đọc; số ít tập hợp: the audience is...",
    },
    {
      word: "editor",
      meaningVi: "biên tập viên",
      wordClass: "noun",
      example: "The editor cut several paragraphs to fit the page.",
      note: "Người duyệt và chỉnh nội dung trước khi xuất bản hoặc phát sóng.",
    },
    {
      word: "coverage",
      meaningVi: "độ phủ tin / cách đưa tin",
      wordClass: "noun",
      example: "Local coverage of the festival was detailed and fair.",
      note: "Hay đi với “media coverage”, “news coverage”; không nhầm với “cover” (bìa).",
    },
    {
      word: "reporter",
      meaningVi: "phóng viên",
      wordClass: "noun",
      example: "A reporter from the evening news waited outside the courtroom.",
      note: "Thường có mặt tại hiện trường để thu thập tin; hẹp hơn “journalist” một chút.",
    },
    {
      word: "podcast",
      meaningVi: "chương trình âm thanh trực tuyến",
      wordClass: "noun",
      example: "She listens to a science podcast on her way to school.",
      note: "Chuỗi tập âm thanh có thể tải hoặc nghe trực tuyến; không phải video.",
    },
  ],
  collocations: [
    {
      phrase: "break the news",
      meaningVi: "loan tin / đưa tin đầu tiên",
      example: "Local radio broke the news about the bridge closure.",
    },
    {
      phrase: "go viral",
      meaningVi: "lan truyền mạnh trên mạng",
      example: "The short video went viral within a few hours.",
    },
    {
      phrase: "mass media",
      meaningVi: "truyền thông đại chúng",
      example: "Mass media still shape how many people see world events.",
    },
    {
      phrase: "front page",
      meaningVi: "trang nhất",
      example: "The investigation made the front page of every newspaper.",
    },
    {
      phrase: "live stream",
      meaningVi: "phát trực tiếp (trên mạng)",
      example: "The school will live stream the graduation ceremony.",
    },
  ],
  commonMistakes: [
    {
      wrong: "I saw the news on social medium this morning.",
      right: "I saw the news on social media this morning.",
      why: "Dạng số nhiều “media” được dùng cố định trong “social media”; không nói “social medium” theo nghĩa này.",
    },
    {
      wrong: "The journalist wrote a very interesting headlines.",
      right: "The journalist wrote a very interesting headline.",
      why: "Sau “a” cần danh từ số ít “headline”; “headlines” là số nhiều.",
    },
    {
      wrong: "This channel audiences millions of viewers.",
      right: "This channel reaches / has an audience of millions of viewers.",
      why: "“Audience” là danh từ, không dùng như động từ; cần “reach” hoặc “have an audience”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "med-1",
      difficulty: "easy",
      stem: "The bold ___ at the top of the article made the story sound urgent.",
      choices: {
        a: "editor",
        b: "headline",
        c: "audience",
        d: "podcast",
      },
      answer: "b",
      explanation:
        "Dòng chữ lớn trên đầu bài báo là “headline”. Ví dụ: “A shocking headline filled the front page.”",
      whyWrong: {
        a: "“Editor” đúng khi nói biên tập viên, ví dụ: “The editor approved the story.”",
        c: "“Audience” đúng khi nói người xem hoặc nghe, ví dụ: “The audience clapped loudly.”",
        d: "“Podcast” đúng khi nói chương trình âm thanh trực tuyến, ví dụ: “This podcast has fifty episodes.”",
      },
    }),
    mcq({
      id: "med-2",
      difficulty: "easy",
      stem: "The evening channel will ___ the football final live from the stadium.",
      choices: {
        a: "broadcast",
        b: "donate",
        c: "enrol",
        d: "revise",
      },
      answer: "a",
      explanation:
        "Phát trận đấu trực tiếp trên TV khớp với “broadcast”. Ví dụ: “They broadcast the speech nationwide.”",
      whyWrong: {
        b: "“Donate” đúng khi quyên góp, ví dụ: “Fans donated money after the match.”",
        c: "“Enrol” đúng khi đăng ký khóa học, ví dụ: “She enrolled in media studies.”",
        d: "“Revise” đúng khi ôn tập, ví dụ: “He revised notes before the quiz.”",
      },
    }),
    mcq({
      id: "med-3",
      difficulty: "easy",
      stem: "A ___ from the daily paper asked shop owners about rising prices.",
      choices: {
        a: "coverage",
        b: "headline",
        c: "reporter",
        d: "media",
      },
      answer: "c",
      explanation:
        "Người đến hỏi và thu thập tin tại chỗ là “reporter”. Ví dụ: “Reporters waited outside the hospital.”",
      whyWrong: {
        a: "“Coverage” đúng khi nói cách đưa tin, ví dụ: “Coverage of the election was intense.”",
        b: "“Headline” đúng khi nói tiêu đề, ví dụ: “The headline was misleading.”",
        d: "“Media” đúng khi nói các kênh truyền thông nói chung, ví dụ: “The media reported the vote.”",
      },
    }),
    mcq({
      id: "med-4",
      difficulty: "easy",
      stem: "Within one day, the dance clip ___ viral and reached millions of users.",
      choices: {
        a: "went",
        b: "made",
        c: "took",
        d: "gave",
      },
      answer: "a",
      explanation:
        "Cụm cố định là “go viral” nghĩa lan truyền mạnh trên mạng. Ví dụ: “The meme went viral overnight.”",
      whyWrong: {
        b: "“Make” đúng với cụm như “make the front page”, ví dụ: “The story made the front page.”",
        c: "“Take” không đi với “viral” trong cụm chuẩn này.",
        d: "“Give” không tạo cụm “give viral”; dùng “go viral”.",
      },
    }),
    mcq({
      id: "med-5",
      difficulty: "medium",
      stem: "Before printing, the ___ checked every quotation for accuracy.",
      choices: {
        a: "audience",
        b: "editor",
        c: "podcast",
        d: "headline",
      },
      answer: "b",
      explanation:
        "Người duyệt nội dung trước khi in là “editor”. Ví dụ: “The editor shortened the interview.”",
      whyWrong: {
        a: "“Audience” đúng khi nói người tiếp nhận tin, ví dụ: “The audience preferred shorter clips.”",
        c: "“Podcast” đúng khi nói chương trình nghe online, ví dụ: “Their podcast discusses films.”",
        d: "“Headline” đúng khi nói tiêu đề bài, ví dụ: “Rewrite the headline more clearly.”",
      },
    }),
    mcq({
      id: "med-6",
      difficulty: "medium",
      stem: "Radio stations ___ the news about the sudden road closure this morning.",
      choices: {
        a: "broke",
        b: "raised",
        c: "lent",
        d: "sat",
      },
      answer: "a",
      explanation:
        "Cụm “break the news” nghĩa loan tin (thường là tin quan trọng hoặc mới). Ví dụ: “TV broke the news first.”",
      whyWrong: {
        b: "“Raise” đúng trong “raise funds”, ví dụ: “They raised funds for new cameras.”",
        c: "“Lend” đúng trong “lend a hand”, ví dụ: “Please lend a hand with the set.”",
        d: "“Sit” đúng trong “sit an exam”, không đi với “the news”.",
      },
    }),
    mcq({
      id: "med-7",
      difficulty: "medium",
      stem: "Fair news ___ should present facts from more than one side of a story.",
      choices: {
        a: "coverage",
        b: "volunteer",
        c: "neighbourhood",
        d: "deadline",
      },
      answer: "a",
      explanation:
        "Cách đưa tin về một sự kiện là “coverage”. Ví dụ: “Balanced coverage builds public trust.”",
      whyWrong: {
        b: "“Volunteer” đúng khi nói tình nguyện viên, ví dụ: “A volunteer answered phones.”",
        c: "“Neighbourhood” đúng khi nói khu phố, ví dụ: “The neighbourhood newsletter is weekly.”",
        d: "“Deadline” đúng khi nói hạn nộp bài, ví dụ: “Journalists work to tight deadlines.”",
      },
    }),
    mcq({
      id: "med-8",
      difficulty: "medium",
      stem: "The studio’s ___ laughed at the jokes and then asked thoughtful questions.",
      choices: {
        a: "coverage",
        b: "headline",
        c: "audience",
        d: "editor",
      },
      answer: "c",
      explanation:
        "Nhóm người xem/nghe trong studio là “audience”. Ví dụ: “The audience stayed until the end.”",
      whyWrong: {
        a: "“Coverage” đúng khi nói độ phủ tin, ví dụ: “Online coverage was faster.”",
        b: "“Headline” đúng khi nói tiêu đề, ví dụ: “Change the headline to match the facts.”",
        d: "“Editor” đúng khi nói biên tập viên, ví dụ: “The editor chose a calmer tone.”",
      },
    }),
    mcq({
      id: "med-9",
      difficulty: "hard",
      stem: "___ media such as television and national newspapers still influence elections.",
      choices: {
        a: "Mass",
        b: "Heavy",
        c: "Strong",
        d: "Civic",
      },
      answer: "a",
      explanation:
        "Cụm cố định là “mass media” nghĩa truyền thông đại chúng. Ví dụ: “Mass media can amplify rumours.”",
      whyWrong: {
        b: "“Heavy” đúng trong cụm như “heavy rain”, không đi với “media” theo nghĩa này.",
        c: "“Strong” đúng trong cụm như “strong coffee” hoặc “strong opinions”, không tạo “strong media”.",
        d: "“Civic” đúng trước “duty” hoặc “responsibility”, ví dụ: “civic duty”. Không nói “civic media” ở đây.",
      },
    }),
    mcq({
      id: "med-10",
      difficulty: "hard",
      stem: "An experienced ___ spent months investigating how the company hid its losses.",
      choices: {
        a: "podcast",
        b: "journalist",
        c: "audience",
        d: "headline",
      },
      answer: "b",
      explanation:
        "Người điều tra và viết tin chuyên nghiệp là “journalist”. Ví dụ: “Journalists protect their sources carefully.”",
      whyWrong: {
        a: "“Podcast” đúng khi nói chương trình âm thanh, ví dụ: “The podcast interviewed the CEO.”",
        c: "“Audience” đúng khi nói người nghe/xem, ví dụ: “The audience trusted the report.”",
        d: "“Headline” đúng khi nói tiêu đề, ví dụ: “The headline summarised the findings.”",
      },
    }),
    mcq({
      id: "med-11",
      difficulty: "hard",
      stem: "Because tickets sold out, the theatre decided to ___ stream opening night for free.",
      choices: {
        a: "go",
        b: "live",
        c: "break",
        d: "mass",
      },
      answer: "b",
      explanation:
        "Cụm “live stream” nghĩa phát trực tiếp trên mạng. Ví dụ: “They will live stream the concert.”",
      whyWrong: {
        a: "“Go” đúng trong “go viral”, ví dụ: “The trailer went viral.” Không tạo “go stream”.",
        c: "“Break” đúng trong “break the news”, ví dụ: “They broke the news at noon.”",
        d: "“Mass” đúng trong “mass media”, ví dụ: “Mass media covered the speech.”",
      },
    }),
    mcq({
      id: "med-12",
      difficulty: "hard",
      stem: "On her commute, Mai listens to a weekly history ___ instead of reading the paper.",
      choices: {
        a: "editor",
        b: "coverage",
        c: "podcast",
        d: "reporter",
      },
      answer: "c",
      explanation:
        "Chương trình nghe định kỳ trên đường đi học/làm là “podcast”. Ví dụ: “A language podcast helped her listening.”",
      whyWrong: {
        a: "“Editor” đúng khi nói biên tập viên, ví dụ: “The editor works late on Fridays.”",
        b: "“Coverage” đúng khi nói cách đưa tin, ví dụ: “Sport coverage filled the evening slot.”",
        d: "“Reporter” đúng khi nói phóng viên, ví dụ: “The reporter filed her story at midnight.”",
      },
    }),
  ],
};
