import { mcq } from "../helpers";

export const readingTopic = {
  id: "topic-reading",
  slug: "reading",
  name: "Reading",
  skill: "reading",
  gradeFrom: 10,
  gradeTo: 12,
  summary: "Đọc một đoạn ngắn và trả lời câu hỏi về ý chính, chi tiết và từ trong ngữ cảnh.",
};

export const orderingTopic = {
  id: "topic-ordering",
  slug: "ordering",
  name: "Sentence Ordering",
  skill: "ordering",
  gradeFrom: 10,
  gradeTo: 12,
  summary: "Sắp các câu thành một đoạn có mở, phát triển và kết.",
};

export type PassageSeed = {
  id: string;
  title: string;
  body: string;
  questions: ReturnType<typeof mcq>[];
};

export type OrderingSeed = {
  id: string;
  title: string;
  prompt: string;
  sentences: { id: "a" | "b" | "c" | "d"; text: string }[];
  correctAnswer: string;
  explanation: string;
};

export const passages: PassageSeed[] = [
  {
    id: "passage-library",
    title: "The Saturday library desk",
    body: [
      "Every Saturday morning, Minh opens the small school library before his classmates arrive.",
      "He checks the return box, writes each title in a notebook, and puts the books back by subject.",
      "Last week a younger student asked for a story about the sea, but the shelf for fiction was almost empty.",
      "Minh did not send her away. He found a short science book with pictures of waves and sat with her for ten minutes.",
      "By noon, twelve students had borrowed books, and Minh stayed to lock the door.",
    ].join(" "),
    questions: [
      mcq({
        id: "rd-1",
        difficulty: "easy",
        stem: "What does Minh do at the library on Saturday mornings?",
        choices: {
          a: "He teaches a full science class.",
          b: "He helps open the library and sort returned books.",
          c: "He writes stories about the sea.",
          d: "He closes the school for the weekend.",
        },
        answer: "b",
        explanation: "Đoạn nói Minh mở thư viện, ghi tên sách trả và xếp lại theo chủ đề.",
        whyWrong: {
          a: "Minh chỉ ngồi mười phút với một bạn, không dạy cả tiết khoa học.",
          c: "Bạn nhỏ hỏi chuyện biển. Minh không phải người viết truyện đó.",
          d: "Minh khóa cửa thư viện lúc trưa, không đóng cả trường.",
        },
      }),
      mcq({
        id: "rd-2",
        difficulty: "medium",
        stem: "Why was the younger student hard to help at first?",
        choices: {
          a: "She arrived after the library had closed.",
          b: "Minh could not find the notebook.",
          c: "The fiction shelf had very few books left.",
          d: "She wanted a book that was too long.",
        },
        answer: "c",
        explanation: "Kệ truyện gần như trống, nên Minh chưa tìm được đúng loại sách bạn ấy hỏi.",
        whyWrong: {
          a: "Thư viện đang mở. Minh còn làm việc đến trưa.",
          b: "Sổ ghi sách trả được nhắc ở đầu đoạn, không phải chỗ bị thiếu.",
          d: "Đoạn không nói sách quá dài. Vấn đề là kệ truyện gần hết.",
        },
      }),
      mcq({
        id: "rd-3",
        difficulty: "medium",
        stem: "The word \"borrowed\" in the last sentence is closest in meaning to",
        choices: {
          a: "bought and kept",
          b: "took home for a time",
          c: "threw away",
          d: "read aloud to Minh",
        },
        answer: "b",
        explanation: "Borrow là mượn rồi sẽ trả, đúng với việc các bạn lấy sách ở thư viện.",
        whyWrong: {
          a: "Mua rồi giữ là buy, không phải borrow.",
          c: "Vứt đi là throw away.",
          d: "Đọc to cho Minh nghe không phải nghĩa của borrowed.",
        },
      }),
      mcq({
        id: "rd-4",
        difficulty: "hard",
        stem: "What can be inferred about Minh?",
        choices: {
          a: "He only helps students who already know the shelves.",
          b: "He looks for another useful book when the first choice is missing.",
          c: "He prefers to leave the library before noon.",
          d: "He refuses to talk to younger students.",
        },
        answer: "b",
        explanation: "Không có truyện biển, Minh lấy sách khoa học có hình sóng và ngồi cùng bạn.",
        whyWrong: {
          a: "Bạn ấy còn nhỏ và chưa tìm được sách. Minh vẫn giúp.",
          c: "Minh ở lại đến trưa để khóa cửa.",
          d: "Minh ngồi nói chuyện với bạn nhỏ mười phút.",
        },
      }),
    ],
  },
  {
    id: "passage-river",
    title: "A morning by the river",
    body: [
      "Last Sunday, class 11A met at the river behind the market.",
      "Their teacher, Ms Hoa, gave each group gloves, a sack, and one job.",
      "Some students picked up plastic bottles. Others pulled weeds from the path so walkers could pass.",
      "At first the work felt slow because the bank was muddy after the rain.",
      "After two hours the path looked clear, and the class counted forty bottles.",
      "Ms Hoa said the next step was to ask the market to put a bin near the bridge.",
    ].join(" "),
    questions: [
      mcq({
        id: "rd-5",
        difficulty: "easy",
        stem: "Where did class 11A work?",
        choices: {
          a: "Inside the market",
          b: "On the riverbank behind the market",
          c: "In the school garden",
          d: "On a boat in the middle of the river",
        },
        answer: "b",
        explanation: "Câu đầu nói lớp gặp nhau ở con sông phía sau chợ.",
        whyWrong: {
          a: "Chợ chỉ là mốc vị trí. Các bạn làm ở bờ sông.",
          c: "Đoạn không nói vườn trường.",
          d: "Không có thuyền. Các bạn đứng trên bờ.",
        },
      }),
      mcq({
        id: "rd-6",
        difficulty: "medium",
        stem: "What made the work slow at the beginning?",
        choices: {
          a: "The students had no sacks.",
          b: "Ms Hoa changed the jobs many times.",
          c: "The bank was muddy after the rain.",
          d: "The bridge was closed.",
        },
        answer: "c",
        explanation: "Đoạn nói việc chậm lúc đầu vì bờ sông lầy sau mưa.",
        whyWrong: {
          a: "Mỗi nhóm được một bao.",
          b: "Cô Hoa giao việc một lần, không đổi đi đổi lại.",
          d: "Cầu được nhắc ở bước sau, không phải lý do chậm.",
        },
      }),
      mcq({
        id: "rd-7",
        difficulty: "medium",
        stem: "Why did some students pull weeds?",
        choices: {
          a: "To sell them at the market",
          b: "To make the path easier to walk on",
          c: "To feed the fish in the river",
          d: "To fill all forty bottles",
        },
        answer: "b",
        explanation: "Các bạn nhổ cỏ trên lối đi để người đi bộ qua được.",
        whyWrong: {
          a: "Đoạn không nói bán cỏ.",
          c: "Cỏ không được dùng cho cá.",
          d: "Bốn mươi là số chai nhựa, không phải cỏ.",
        },
      }),
      mcq({
        id: "rd-8",
        difficulty: "hard",
        stem: "What does Ms Hoa want to happen next?",
        choices: {
          a: "The class should count the bottles again.",
          b: "The market should place a bin near the bridge.",
          c: "The students should clean the river every morning.",
          d: "The rain should stop before they return.",
        },
        answer: "b",
        explanation: "Cô Hoa nói bước tiếp là nhờ chợ đặt thùng rác gần cầu.",
        whyWrong: {
          a: "Các bạn đã đếm xong bốn mươi chai.",
          c: "Đoạn không hẹn dọn sông mỗi sáng.",
          d: "Mưa là chuyện đã xảy ra, không phải việc cô muốn làm tiếp.",
        },
      }),
    ],
  },
];

export const orderingItems: OrderingSeed[] = [
  {
    id: "ord-1",
    title: "Missing the bus",
    prompt: "Put the sentences in the order of the story.",
    sentences: [
      { id: "a", text: "She ran to the stop, but the bus was already turning the corner." },
      { id: "b", text: "Her alarm did not ring, so Lan woke up twenty minutes late." },
      { id: "c", text: "She sent her teacher a short message and waited for the next bus." },
      { id: "d", text: "She dressed quickly and left the house without breakfast." },
    ],
    correctAnswer: "b,d,a,c",
    explanation: "Lan dậy muộn, mặc đồ rồi đi, ra đến nơi thì xe đã khuất, sau đó nhắn cô và đợi chuyến sau.",
  },
  {
    id: "ord-2",
    title: "Saving water",
    prompt: "Put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "As a result, their monthly bill was lower than the month before." },
      { id: "b", text: "The family decided to use less water at home." },
      { id: "c", text: "They fixed the dripping tap and took shorter showers." },
      { id: "d", text: "First, they wrote down three habits they wanted to change." },
    ],
    correctAnswer: "b,d,c,a",
    explanation: "Quyết định trước, ghi thói quen, rồi làm việc cụ thể, cuối cùng mới có hóa đơn giảm.",
  },
  {
    id: "ord-3",
    title: "The class talk",
    prompt: "Put the sentences in the order of the events.",
    sentences: [
      { id: "a", text: "After the talk, two classmates asked him where he had found the numbers." },
      { id: "b", text: "Nam spent three evenings collecting facts about local jobs." },
      { id: "c", text: "On Friday he spoke for four minutes and showed one chart." },
      { id: "d", text: "He then practised the opening sentence in front of his sister." },
    ],
    correctAnswer: "b,d,c,a",
    explanation: "Nam thu thập số liệu, tập câu mở, trình bày thứ Sáu, rồi bạn hỏi sau bài nói.",
  },
  {
    id: "ord-4",
    title: "The weekend market",
    prompt: "Put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "By late afternoon, most of the fruit boxes were empty." },
      { id: "b", text: "Vendors set up their tables before the market opened." },
      { id: "c", text: "Shoppers arrived soon after eight and began choosing vegetables." },
      { id: "d", text: "The market only opens on Sunday morning." },
    ],
    correctAnswer: "d,b,c,a",
    explanation: "Nói thời điểm mở cửa, người bán dựng bàn, khách đến, rồi gần chiều hàng đã vơi.",
  },
];

export const practiceExam = {
  id: "exam-practice-1",
  yearLabel: "practice",
  version: "practice-1",
  status: "provisional",
  source: "Đề luyện trong app",
  questionCount: 8,
  durationMinutes: 15,
  sections: [
    { questionType: "reading", label: "Đọc hiểu", count: 4 },
    { questionType: "ordering", label: "Sắp xếp câu", count: 4 },
  ],
  notes:
    "Đây là đề luyện trong app, không phải đề minh họa của Bộ. Điểm trên thang 10 chỉ dùng để xem trong phiên này.",
};
