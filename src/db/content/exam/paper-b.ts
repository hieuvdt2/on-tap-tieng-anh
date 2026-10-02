import { mcq } from "../helpers";
import { orderingTopic, readingTopic } from "./items";

type Stimulus = {
  id: string;
  kind: "gap_text" | "passage" | "ordering_prompt";
  title: string;
  body: string;
  topicId: string;
};

type PaperQuestion = ReturnType<typeof mcq> & {
  type: "gap_short" | "gap_long" | "single_choice" | "ordering";
  stimulusId: string;
  topicId: string;
  grade: number;
};

function choice(
  type: PaperQuestion["type"],
  stimulusId: string,
  topicId: string,
  input: Parameters<typeof mcq>[0],
): PaperQuestion {
  return { ...mcq(input), type, stimulusId, topicId, grade: 12 };
}

function order(input: {
  id: string;
  stimulusId: string;
  stem: string;
  sentences: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}): PaperQuestion {
  return {
    id: input.id,
    type: "ordering",
    stimulusId: input.stimulusId,
    difficulty: "medium",
    stem: input.stem,
    options: input.sentences,
    correctAnswer: input.correctAnswer,
    explanation: input.explanation,
    wrongAnswerExplanations: [],
    topicId: orderingTopic.id,
    grade: 12,
  };
}

const bookReturn = `BOOK RETURN HOUR

The class library will stay open for one extra hour on Wednesday. Bring any book that still has its card in the pocket.

If every borrower (1)______ the book by 5 p.m., the shelf can be checked before the reading club starts. The aim is to reduce the (2)______ of books that stay in bags all term. Torn covers will be (3)______ in a box for repair, not thrown away. Volunteers will (4)______ out date stamps and pencils at the door. We want students to (5)______ the habit of returning one book before asking for another. Your (6)______ on the list tells us how many chairs to set.

Come even if you have only one book. Put the card back in the pocket before you leave.`;

const pencilTin = `A tin of spare pencils sits on the window shelf. (1)______. Borrowing from the person beside you stops the lesson and often leaves that person with nothing to write with. (2)______. The rule is simple: take one pencil, and return a pencil before the next morning. (3)______. On Friday the class counts the tin and writes the number on the lid. (4)______. A new box every Monday had hidden the same loss, because nobody could see where the pencils had gone. (5)______.`;

const quietRoom = `The school used to keep the old music room locked after 4 p.m. Students who wanted a quiet place for homework sat on the corridor floor, where club members walked past with drums and sports bags. In April the student council asked for the room to stay open until 6 p.m. on Tuesdays and Thursdays. A teacher agreed to lock it at the end, but only if the council kept a list of names.

[I] The room did not need new furniture. Twenty chairs were already there from choir practice. [II] What changed was who could use the silence between the last lesson and the late bus. [III] Mr Dat, who locks the building, said the list made the job possible because he could see who was still inside. [IV]

A few club leaders objected. They had used the room for storing instruments and did not want homework bags on the same chairs. The council promised to stack the chairs and leave the instrument cupboard shut. On Fridays the room still closes at 4 p.m., because the band needs it for a full rehearsal. On the other two evenings it is a quiet room, not a practice room.

The council still wants a sign on the door that says "no music after 4". The later opening removes the corridor sitting, but a drum in the next room can still break the silence. The sign was requested in May and has not been printed. Until then, students are told to choose the chairs farthest from the band door.`;

const clayAd = `CLAY AFTER SCHOOL

The art room is keeping ten places on a clay afternoon for students in grade 12. You will make one small bowl and learn how to wrap it so it can dry without cracking.

Bring an old shirt. Phones may be used only to check the drying time, not to watch a lesson from another class. The cleaner your hands are, the (27)______ likely the bowl is to keep its shape. No one who arrives after 3.20 (28)______ get a lump of clay, because the group starts together.

(29)______, the art room will lend aprons to students who forget a shirt. (30)______ student needs to have used a kiln before; the tutor starts with one simple pinch pot. Forms (31)______ be handed in at the art desk by Thursday noon. This is a rare chance to make a bowl your family can actually (32)______.`;

const kettleRota = `When a class shares one kettle, the teacher sees a clean counter at the end of the day and cannot see who wiped it. In a home-economics class last term, four students left the room after making tea for a visitor. The cups were washed. The talk afterwards was not. Only one student could say when the kettle had been switched off. The others had split the jobs so early that they never watched the last step.

The teacher changed the rule for the next practical. The group still shared one tray, but each person wrote three lines alone before leaving: what was switched on, what was wiped, and what was still hot. The group photo could show the tray, but it could not stand in place of those lines.

The new rule took more time. It also showed the gaps while there was still time to go back. One group found that they had dried the cups and had left the hob on. They returned before the caretaker's round. The photo looked plainer than the first practical, and the safety steps were easier to explain.

A shared tray is still a good place for an agreed set of cups. The mistake is to treat that photo as proof that every name on the rota followed the last step. A short note from each student does not measure skill. It shows whether the writer was present when the group decided the room was safe to leave.`;

export const paperBStimuli: Stimulus[] = [
  { id: "stim-b-books", kind: "gap_text", title: "Book return hour", body: bookReturn, topicId: readingTopic.id },
  { id: "stim-b-o1", kind: "ordering_prompt", title: "Lost bottle", body: "Put the parts of the email in a logical order.", topicId: orderingTopic.id },
  { id: "stim-b-o2", kind: "ordering_prompt", title: "Library card", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-b-o3", kind: "ordering_prompt", title: "Herb box", body: "Put the sentences in a logical order.", topicId: orderingTopic.id },
  { id: "stim-b-o4", kind: "ordering_prompt", title: "Spring concert", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-b-o5", kind: "ordering_prompt", title: "Noticeboard", body: "Put the sentences in the order of the events.", topicId: orderingTopic.id },
  { id: "stim-b-tin", kind: "gap_text", title: "A spare pencil tin", body: pencilTin, topicId: readingTopic.id },
  { id: "stim-b-room", kind: "passage", title: "The quiet room", body: quietRoom, topicId: readingTopic.id },
  { id: "stim-b-clay", kind: "gap_text", title: "Clay after school", body: clayAd, topicId: readingTopic.id },
  { id: "stim-b-kettle", kind: "passage", title: "The shared kettle", body: kettleRota, topicId: readingTopic.id },
];

const bookQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-1",
    difficulty: "easy",
    stem: "Book return (1)",
    choices: { a: "returns", b: "return", c: "returning", d: "returned" },
    answer: "a",
    explanation: "Every borrower là chủ ngữ số ít. Câu nói quy tắc của giờ trả sách, nên dùng hiện tại đơn returns.",
    whyWrong: {
      b: "Return đi với I, you, we, they, không đi với every borrower.",
      c: "Returning không đứng một mình sau if every borrower.",
      d: "Returned là quá khứ, trong khi tờ thông báo nói việc làm vào thứ Tư.",
    },
  }),
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-2",
    difficulty: "medium",
    stem: "Book return (2)",
    choices: { a: "number", b: "numbered", c: "numbering", d: "numbers" },
    answer: "a",
    explanation: "Reduce the number of nghĩa là giảm số lượng. Sau the cần danh từ số ít number.",
    whyWrong: {
      b: "Numbered là dạng tính từ hoặc quá khứ, không đi sau the trong cụm này.",
      c: "Numbering là dạng -ing, không phải danh từ chỉ số lượng ở đây.",
      d: "Numbers là số nhiều, không hợp với the và với of books trong cụm the number of.",
    },
  }),
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-3",
    difficulty: "medium",
    stem: "Book return (3)",
    choices: { a: "placed", b: "place", c: "placing", d: "places" },
    answer: "a",
    explanation: "Will be placed là bị động tương lai. Bìa sách được đặt vào hộp, không tự đặt.",
    whyWrong: {
      b: "Place là động từ nguyên mẫu, không đi sau will be trong câu bị động này.",
      c: "Placing là dạng -ing, không hoàn thành cấu trúc will be + quá khứ phân từ.",
      d: "Places là hiện tại đơn, không đi sau will be.",
    },
  }),
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-4",
    difficulty: "medium",
    stem: "Book return (4)",
    choices: { a: "hand", b: "look", c: "take", d: "put" },
    answer: "a",
    explanation: "Hand out nghĩa là phát cho người đến. Câu nói tình nguyện viên phát dấu ngày và bút chì ở cửa.",
    whyWrong: {
      b: "Look out nghĩa là cẩn thận, không phải phát đồ.",
      c: "Take out nghĩa là lấy ra hoặc mang đi, không phải phát cho người khác.",
      d: "Put out thường nghĩa là dập tắt hoặc bày ra, không hợp với việc phát dấu ngày ở cửa.",
    },
  }),
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-5",
    difficulty: "easy",
    stem: "Book return (5)",
    choices: { a: "keep", b: "break", c: "lose", d: "drop" },
    answer: "a",
    explanation: "Keep the habit nghĩa là giữ thói quen. Sau to cần động từ nguyên mẫu, và ý câu là muốn học sinh tiếp tục trả sách.",
    whyWrong: {
      b: "Break the habit nghĩa là bỏ thói quen, trái với mục đích của giờ trả sách.",
      c: "Lose the habit cũng nghĩa là mất thói quen.",
      d: "Drop the habit nghĩa là thôi không làm việc đó nữa.",
    },
  }),
  choice("gap_short", "stim-b-books", readingTopic.id, {
    id: "pb-6",
    difficulty: "medium",
    stem: "Book return (6)",
    choices: { a: "name", b: "named", c: "naming", d: "names" },
    answer: "a",
    explanation: "Your name là danh từ số ít, hợp với động từ tells ở câu sau.",
    whyWrong: {
      b: "Named là tính từ hoặc quá khứ, không làm chủ ngữ cho tells.",
      c: "Naming là dạng -ing, không phải thông tin ghi trên danh sách ở câu này.",
      d: "Names là số nhiều, trong khi động từ tells chia cho chủ ngữ số ít.",
    },
  }),
];

const orderingQuestions: PaperQuestion[] = [
  order({
    id: "pb-7",
    stimulusId: "stim-b-o1",
    stem: "Lost bottle: put the parts of the email in a logical order.",
    sentences: [
      { id: "a", text: "Please leave it at the office if you find one with a blue lid and the name Lan." },
      { id: "b", text: "I left it on the bench after the 4 p.m. practice." },
      { id: "c", text: "Thank you for checking the lost-property box." },
      { id: "d", text: "I am writing because my water bottle was not in my bag this morning." },
      { id: "e", text: "I can collect it before registration tomorrow." },
    ],
    correctAnswer: "d,b,a,e,c",
    explanation: "Nêu lý do viết thư, nói mình để quên lúc nào, nhờ để ở văn phòng, hẹn giờ lấy, rồi cảm ơn.",
  }),
  order({
    id: "pb-8",
    stimulusId: "stim-b-o2",
    stem: "Library card: put the utterances in the order of the conversation.",
    sentences: [
      { id: "a", text: "Student: Thank you. I will bring it tomorrow." },
      { id: "b", text: "Student: I need a card, but I left the photo at home." },
      { id: "c", text: "Librarian: Then come back with the photo and I will print the card." },
    ],
    correctAnswer: "b,c,a",
    explanation: "Bạn học nói thiếu ảnh, thủ thư bảo mang ảnh lại, rồi bạn cảm ơn và hẹn hôm sau.",
  }),
  order({
    id: "pb-9",
    stimulusId: "stim-b-o3",
    stem: "Herb box: put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "Two weeks later the mint had new leaves, so the class cut only a few." },
      { id: "b", text: "The class put a wooden box of soil outside the science room." },
      { id: "c", text: "They watered it every Monday and wrote the date on a card." },
      { id: "d", text: "Before planting, they checked that the box would get morning sun but not the football." },
      { id: "e", text: "Mint was chosen because it grows quickly and can be used in the cooking club." },
    ],
    correctAnswer: "b,d,e,c,a",
    explanation: "Đặt thùng trước, kiểm tra nắng, chọn bạc hà, tưới hàng tuần, rồi mới cắt lá sau hai tuần.",
  }),
  order({
    id: "pb-10",
    stimulusId: "stim-b-o4",
    stem: "Spring concert: put the utterances in the order of the conversation.",
    sentences: [
      { id: "a", text: "Minh: I am not sure. I have never sung in front of a hall." },
      { id: "b", text: "An: Then stand in the back row for the first song. You only need to follow the person beside you." },
      { id: "c", text: "Minh: Is the choir still taking new voices for the spring concert?" },
      { id: "d", text: "An: Yes. The first practice is on Thursday." },
      { id: "e", text: "Minh: All right. Put my name on the list." },
    ],
    correctAnswer: "c,d,a,b,e",
    explanation: "Minh hỏi còn nhận người không, An nói buổi tập, Minh ngại, An giao chỗ đứng, Minh đồng ý ghi tên.",
  }),
  order({
    id: "pb-11",
    stimulusId: "stim-b-o5",
    stem: "Noticeboard: put the sentences in the order of the events.",
    sentences: [
      { id: "a", text: "By Monday morning the old notices were still covering the new timetable." },
      { id: "b", text: "The new timetable was pinned on top before the first lesson." },
      { id: "c", text: "The noticeboard had been used for club posters all year." },
      { id: "d", text: "Two students took the old posters down and kept the ones that were still dated." },
      { id: "e", text: "The office asked for a clear board before the exam week." },
    ],
    correctAnswer: "c,e,a,d,b",
    explanation: "Bảng đã dán poster cả năm, văn phòng yêu cầu dọn, sáng thứ Hai lịch mới vẫn bị che, hai bạn gỡ poster cũ, rồi mới dán thời khóa biểu.",
  }),
];

const tinQuestions: PaperQuestion[] = [
  choice("gap_long", "stim-b-tin", readingTopic.id, {
    id: "pb-12",
    difficulty: "hard",
    stem: "Pencil tin (1)",
    choices: {
      a: "It is there for the student who forgot a pencil and needs to start work at once.",
      b: "It is locked so that no student can take a pencil during the lesson.",
      c: "It replaces the need for any student to bring a pencil from home.",
      d: "It is sent home with one student at the end of every day.",
    },
    answer: "a",
    explanation: "Câu sau nói việc mượn bạn bên cạnh làm gián đoạn tiết học. Câu đúng giới thiệu hộp bút để người quên bút vẫn bắt đầu được.",
    whyWrong: {
      b: "Khóa hộp thì hộp không còn là chỗ lấy bút dự phòng.",
      c: "Hộp chỉ dành cho lúc quên, không thay việc mang bút từ nhà.",
      d: "Mang cả hộp về nhà thì lớp không dùng được vào hôm sau.",
    },
  }),
  choice("gap_long", "stim-b-tin", readingTopic.id, {
    id: "pb-13",
    difficulty: "hard",
    stem: "Pencil tin (2)",
    choices: {
      a: "The tin is meant to stop that borrowing by giving the class one shared spare.",
      b: "The tin is kept in the teacher's bag so the class cannot see it.",
      c: "Borrowing from a friend is better because the tin has no pencils.",
      d: "The person beside you should bring extra pencils for the whole row.",
    },
    answer: "a",
    explanation: "Câu trước nêu hại của việc mượn bạn. Câu đúng nói hộp dùng để chấm dứt kiểu mượn đó.",
    whyWrong: {
      b: "Giấu hộp thì mất mục đích để cả lớp thấy và dùng.",
      c: "Trái với câu trước, vì đoạn đang muốn tránh mượn bạn.",
      d: "Câu này đẩy việc chuẩn bị sang bạn bên cạnh, đúng việc đoạn muốn tránh.",
    },
  }),
  choice("gap_long", "stim-b-tin", readingTopic.id, {
    id: "pb-14",
    difficulty: "medium",
    stem: "Pencil tin (3)",
    choices: {
      a: "That rule is short enough to remember and easy to check the next morning.",
      b: "The rule asks each student to buy a new pencil every Friday.",
      c: "The rule lets anyone take the whole tin home.",
      d: "The rule matters only when the class has no test.",
    },
    answer: "a",
    explanation: "Quy tắc vừa được nêu. Câu đúng nói vì sao quy tắc ấy làm được: ngắn và kiểm được vào sáng hôm sau.",
    whyWrong: {
      b: "Quy tắc là lấy một cây và trả lại, không phải mua mới mỗi thứ Sáu.",
      c: "Lấy cả hộp về nhà phá quy tắc take one.",
      d: "Đoạn không giới hạn quy tắc vào ngày không có bài kiểm tra.",
    },
  }),
  choice("gap_long", "stim-b-tin", readingTopic.id, {
    id: "pb-15",
    difficulty: "medium",
    stem: "Pencil tin (4)",
    choices: {
      a: "The number shows whether pencils are coming back, not only whether someone took one.",
      b: "The number is erased so that the loss stays hidden.",
      c: "The count is useful only if the tin is thrown away afterwards.",
      d: "The lid should be left blank so nobody argues about the total.",
    },
    answer: "a",
    explanation: "Câu trước nói lớp đếm và ghi số lên nắp. Câu đúng nói con số cho biết bút có được trả lại hay không.",
    whyWrong: {
      b: "Xóa số thì không còn gì để thấy bút có quay lại không.",
      c: "Đếm xong rồi vứt hộp thì mất chính chỗ đang theo dõi.",
      d: "Để trống nắp trái với việc viết số lên nắp.",
    },
  }),
  choice("gap_long", "stim-b-tin", readingTopic.id, {
    id: "pb-16",
    difficulty: "hard",
    stem: "Pencil tin (5)",
    choices: {
      a: "The tin helps only when the weekly count is kept, not when a fresh box quietly replaces what disappeared.",
      b: "A new box every Monday is the surest way to see who lost a pencil.",
      c: "The tin works best when nobody writes the number down.",
      d: "Hidden losses are useful because they save the class from counting.",
    },
    answer: "a",
    explanation: "Câu trước nói hộp mới mỗi thứ Hai che mất chỗ bút biến đi. Câu đúng chốt: hộp chỉ có ích khi vẫn đếm mỗi tuần.",
    whyWrong: {
      b: "Hộp mới không cho biết ai làm mất bút, và đoạn vừa nói nó che mất sự thất thoát.",
      c: "Không ghi số thì mất cách kiểm tra bút có quay lại không.",
      d: "Đoạn coi thất thoát bị giấu là vấn đề, không phải điều có ích.",
    },
  }),
];

const roomQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-17",
    difficulty: "medium",
    stem: "The word rehearsal in paragraph 3 is closest in meaning to ______.",
    choices: {
      a: "a practice session before a performance",
      b: "a list of students who stay late",
      c: "the cupboard where instruments are kept",
      d: "the sign that has not been printed",
    },
    answer: "a",
    explanation: "A full rehearsal là buổi tập trọn vẹn trước khi biểu diễn. Ban nhạc cần phòng vào thứ Sáu để tập.",
    whyWrong: {
      b: "Danh sách tên nằm ở đoạn 1 và đoạn 2, không phải nghĩa của rehearsal.",
      c: "Tủ nhạc cụ được nhắc riêng, không phải buổi tập.",
      d: "Tấm biển được xin ở đoạn 4.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-18",
    difficulty: "easy",
    stem: "Before April, students who wanted a quiet place had to ______.",
    choices: {
      a: "sit on the corridor floor",
      b: "wait in the music room until 6 p.m.",
      c: "ask the band to stop at 4 p.m.",
      d: "take the drums home",
    },
    answer: "a",
    explanation: "Đoạn đầu nói phòng khóa sau 4 giờ, nên học sinh ngồi trên sàn hành lang.",
    whyWrong: {
      b: "Trước tháng Tư phòng không mở đến 6 giờ.",
      c: "Không nói học sinh yêu cầu ban nhạc dừng.",
      d: "Không nói mang trống về nhà.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-19",
    difficulty: "hard",
    stem: "The passage mentions all of the following EXCEPT ______.",
    choices: {
      a: "the names of the club leaders who objected",
      b: "the new closing time on Tuesdays",
      c: "the reason Friday is different",
      d: "the month when a sign was requested",
    },
    answer: "a",
    explanation: "Đoạn 3 chỉ nói một vài trưởng câu lạc bộ phản đối, không nêu tên.",
    whyWrong: {
      b: "Đoạn 1 nói thứ Ba và thứ Năm mở đến 6 giờ.",
      c: "Đoạn 3 nói thứ Sáu đóng lúc 4 giờ vì ban nhạc cần tập.",
      d: "Đoạn 4 nói tấm biển được xin vào tháng Năm.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-20",
    difficulty: "medium",
    stem: "In which paragraph does the writer say the change did not need new furniture?",
    choices: { a: "Paragraph 2", b: "Paragraph 1", c: "Paragraph 3", d: "Paragraph 4" },
    answer: "a",
    explanation: "Đoạn 2 mở đầu bằng câu phòng không cần bàn ghế mới vì đã có hai mươi ghế.",
    whyWrong: {
      b: "Đoạn 1 nói giờ mở cửa và danh sách tên.",
      c: "Đoạn 3 nói phản đối của các câu lạc bộ và lịch thứ Sáu.",
      d: "Đoạn 4 nói tấm biển và tiếng trống.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-21",
    difficulty: "medium",
    stem: "The word it in “the band needs it” refers to ______.",
    choices: { a: "the room", b: "the list", c: "Friday", d: "the cupboard" },
    answer: "a",
    explanation: "Câu đứng sau ý phòng vẫn đóng lúc 4 giờ thứ Sáu. It là căn phòng ban nhạc cần để tập.",
    whyWrong: {
      b: "Danh sách giúp ông Đạt khóa cửa, không phải thứ ban nhạc cần để tập.",
      c: "Friday là thời điểm, không phải vật được cần.",
      d: "Tủ được hứa là sẽ đóng, không phải thứ ban nhạc cần trong câu này.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-22",
    difficulty: "medium",
    stem: "Why did Mr Dat accept the later opening?",
    choices: {
      a: "The name list showed him who was still inside.",
      b: "The band agreed to finish at 4 p.m. every day.",
      c: "New chairs were bought for the choir.",
      d: "The sign had already been printed.",
    },
    answer: "a",
    explanation: "Đoạn 2 nói danh sách khiến việc khóa cửa khả thi vì ông Đạt thấy ai còn ở trong.",
    whyWrong: {
      b: "Ban nhạc vẫn dùng phòng vào thứ Sáu, không phải dừng lúc 4 giờ mỗi ngày.",
      c: "Đoạn nói không cần mua ghế mới.",
      d: "Tấm biển xin vào tháng Năm và chưa được in.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-23",
    difficulty: "easy",
    stem: "The council promised to ______.",
    choices: {
      a: "stack the chairs and leave the instrument cupboard shut",
      b: "move the band to the corridor",
      c: "open the room on Friday evenings",
      d: "print the sign in May",
    },
    answer: "a",
    explanation: "Đoạn 3 nói hội học sinh hứa xếp ghế và để tủ nhạc cụ đóng.",
    whyWrong: {
      b: "Không có lời hứa chuyển ban nhạc ra hành lang.",
      c: "Thứ Sáu phòng vẫn đóng lúc 4 giờ.",
      d: "Tấm biển được xin chứ chưa được in, và không phải lời hứa ở đoạn 3.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-24",
    difficulty: "medium",
    stem: "The later opening still fails to give full silence because ______.",
    choices: {
      a: "a drum in the next room can be heard",
      b: "the chairs are taken home at 4 p.m.",
      c: "Mr Dat refuses to lock the door",
      d: "homework is banned after the last lesson",
    },
    answer: "a",
    explanation: "Đoạn cuối nói mở cửa muộn bỏ được việc ngồi hành lang, nhưng tiếng trống phòng bên vẫn phá yên tĩnh.",
    whyWrong: {
      b: "Ghế vẫn ở trong phòng, được xếp lại chứ không mang về.",
      c: "Ông Đạt đồng ý khóa cửa khi có danh sách.",
      d: "Phòng mở để làm bài, không cấm bài tập.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-25",
    difficulty: "medium",
    stem: "It can be inferred that the band ______.",
    choices: {
      a: "continues to use the room on Fridays",
      b: "was cancelled when the council made the list",
      c: "now practises in the corridor after 4 p.m.",
      d: "needs the sign before it can start",
    },
    answer: "a",
    explanation: "Thứ Sáu phòng đóng sớm vì ban nhạc cần buổi tập trọn vẹn, nên ban nhạc vẫn dùng phòng ngày đó.",
    whyWrong: {
      b: "Danh sách phục vụ giờ tự học, không hủy ban nhạc.",
      c: "Hành lang là chỗ học sinh từng ngồi học, không phải chỗ ban nhạc tập.",
      d: "Tấm biển dành cho yêu cầu không nhạc sau 4 giờ, không phải điều kiện để ban nhạc bắt đầu.",
    },
  }),
  choice("single_choice", "stim-b-room", readingTopic.id, {
    id: "pb-26",
    difficulty: "medium",
    stem: "Which title best fits the passage about the quiet room?",
    choices: {
      a: "A Quiet Room, with Friday Left to the Band",
      b: "Why the Music Room Was Sold",
      c: "Buying Chairs for the Late Bus",
      d: "Mr Dat's Plan to Ban Every Club",
    },
    answer: "a",
    explanation: "Bài nói phòng được mở yên tĩnh hai buổi tối, còn thứ Sáu vẫn để ban nhạc tập.",
    whyWrong: {
      b: "Không có việc bán phòng.",
      c: "Không mua ghế mới, và xe buýt muộn chỉ là mốc thời gian.",
      d: "Ông Đạt không có kế hoạch cấm mọi câu lạc bộ.",
    },
  }),
];

const clayQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-27",
    difficulty: "medium",
    stem: "Clay afternoon (27)",
    choices: { a: "more", b: "most", c: "much", d: "many" },
    answer: "a",
    explanation: "Cấu trúc the + so sánh hơn, the + so sánh hơn. The cleaner đi với the more likely.",
    whyWrong: {
      b: "Most là so sánh nhất, không đi trong cấu trúc the cleaner ..., the ...",
      c: "Much không tạo vế so sánh hơn sau the.",
      d: "Many dùng cho danh từ đếm được, không đứng trước likely.",
    },
  }),
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-28",
    difficulty: "easy",
    stem: "Clay afternoon (28)",
    choices: { a: "will", b: "would", c: "was", d: "were" },
    answer: "a",
    explanation: "Will get nói quy tắc của buổi sắp diễn ra. No one who arrives after 3.20 will get a lump of clay.",
    whyWrong: {
      b: "Would cần một điều kiện giả định, câu này là quy tắc chắc chắn.",
      c: "Was không đi với động từ nguyên mẫu get.",
      d: "Were cũng không đi trực tiếp với get trong câu này.",
    },
  }),
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-29",
    difficulty: "medium",
    stem: "Clay afternoon (29)",
    choices: { a: "Also", b: "However", c: "Otherwise", d: "Instead" },
    answer: "a",
    explanation: "Câu trước nói nhóm bắt đầu cùng giờ. Also thêm một thông tin nữa: phòng mỹ thuật cho mượn tạp dề.",
    whyWrong: {
      b: "However báo sự tương phản, nhưng việc cho mượn tạp dề không đối lập với giờ bắt đầu.",
      c: "Otherwise nghĩa là nếu không thì, không nối được hai thông báo này.",
      d: "Instead nghĩa là thay vào đó, trong khi tạp dề là phần thêm chứ không thay việc đến đúng giờ.",
    },
  }),
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-30",
    difficulty: "medium",
    stem: "Clay afternoon (30)",
    choices: { a: "No", b: "Every", c: "Another", d: "Each" },
    answer: "a",
    explanation: "No student needs nghĩa là không học sinh nào cần từng dùng lò nung. Câu sau nói người hướng dẫn bắt đầu từ một bài cơ bản.",
    whyWrong: {
      b: "Every student needs nghĩa là ai cũng phải từng dùng lò, trái với câu sau.",
      c: "Another student không hợp vì chưa có một học sinh nào được nêu trước đó.",
      d: "Each student needs cũng biến việc dùng lò thành yêu cầu bắt buộc.",
    },
  }),
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-31",
    difficulty: "easy",
    stem: "Clay afternoon (31)",
    choices: { a: "must", b: "mustn't", c: "needn't", d: "won't" },
    answer: "a",
    explanation: "Must be handed in là yêu cầu bắt buộc nộp phiếu trước trưa thứ Năm.",
    whyWrong: {
      b: "Mustn't nghĩa là cấm nộp, trái với hạn chót.",
      c: "Needn't nghĩa là không cần nộp.",
      d: "Won't nghĩa là sẽ không được nộp, không phải lời hướng dẫn hạn nộp.",
    },
  }),
  choice("gap_short", "stim-b-clay", readingTopic.id, {
    id: "pb-32",
    difficulty: "easy",
    stem: "Clay afternoon (32)",
    choices: { a: "use", b: "used", c: "using", d: "uses" },
    answer: "a",
    explanation: "Sau can dùng động từ nguyên mẫu. Can actually use nghĩa là thực sự dùng được.",
    whyWrong: {
      b: "Used là quá khứ hoặc quá khứ phân từ, không đi sau can.",
      c: "Using là dạng -ing, không đi sau can.",
      d: "Uses là hiện tại ngôi thứ ba, không đi sau can.",
    },
  }),
];

const kettleQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-33",
    difficulty: "medium",
    stem: "The word practical in paragraph 2 is closest in meaning to ______.",
    choices: {
      a: "a hands-on lesson",
      b: "a written exam",
      c: "the caretaker's round",
      d: "a photo of the tray",
    },
    answer: "a",
    explanation: "The next practical là buổi thực hành tiếp theo, sau buổi pha trà ở đoạn 1.",
    whyWrong: {
      b: "Không có bài thi viết.",
      c: "Vòng đi của bảo vệ nằm ở đoạn 3.",
      d: "Ảnh khay là bằng chứng bị bác, không phải nghĩa của practical.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-34",
    difficulty: "easy",
    stem: "In the first class, only one student could explain ______.",
    choices: {
      a: "when the kettle had been switched off",
      b: "why the visitor preferred tea",
      c: "where the cups had been bought",
      d: "how the photo was edited",
    },
    answer: "a",
    explanation: "Đoạn 1 nói chỉ một bạn nói được lúc ấm đun nước đã tắt.",
    whyWrong: {
      b: "Không nói sở thích của khách.",
      c: "Không nói nơi mua tách.",
      d: "Ảnh được nhắc ở quy tắc mới, không phải ở buổi đầu.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-35",
    difficulty: "easy",
    stem: "The new rule asked each student to write ______.",
    choices: {
      a: "three lines before leaving",
      b: "a full report at home",
      c: "the visitor's name on the tray",
      d: "a complaint about the caretaker",
    },
    answer: "a",
    explanation: "Đoạn 2 yêu cầu mỗi người tự viết ba dòng trước khi rời phòng.",
    whyWrong: {
      b: "Không yêu cầu báo cáo dài ở nhà.",
      c: "Không ghi tên khách lên khay.",
      d: "Không có đơn phàn nàn bảo vệ.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-36",
    difficulty: "medium",
    stem: "The word they in “They returned before the caretaker's round” refers to ______.",
    choices: { a: "one group", b: "the cups", c: "the teacher", d: "the three lines" },
    answer: "a",
    explanation: "Câu trước nói một nhóm phát hiện bếp còn bật. They là nhóm đó quay lại.",
    whyWrong: {
      b: "Tách đã được lau khô, không phải thứ quay lại phòng.",
      c: "Giáo viên đặt quy tắc, không phải người quay lại trong câu này.",
      d: "Ba dòng là phần viết, không phải chủ ngữ của returned.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-37",
    difficulty: "medium",
    stem: "In which paragraph does a group return to fix a danger?",
    choices: { a: "Paragraph 3", b: "Paragraph 1", c: "Paragraph 2", d: "Paragraph 4" },
    answer: "a",
    explanation: "Đoạn 3 kể một nhóm thấy bếp còn bật và quay lại trước vòng đi của bảo vệ.",
    whyWrong: {
      b: "Đoạn 1 chỉ có buổi pha trà đã kết thúc.",
      c: "Đoạn 2 nêu quy tắc viết ba dòng.",
      d: "Đoạn 4 kết luận về ảnh và ghi chú.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-38",
    difficulty: "medium",
    stem: "Which of the following is true according to the passage about the kettle?",
    choices: {
      a: "The group photo could not replace the three lines.",
      b: "The cups were left unwashed in the first class.",
      c: "The caretaker switched the hob off for the students.",
      d: "The teacher banned shared trays.",
    },
    answer: "a",
    explanation: "Đoạn 2 nói ảnh có thể cho thấy khay nhưng không thay được ba dòng mỗi người viết.",
    whyWrong: {
      b: "Đoạn 1 nói tách đã được rửa.",
      c: "Nhóm tự quay lại, không nói bảo vệ tắt bếp giúp.",
      d: "Đoạn 4 vẫn coi khay chung là chỗ phù hợp để đặt bộ tách đã thống nhất.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-39",
    difficulty: "medium",
    stem: "In which paragraph does the writer limit the claim about a shared tray?",
    choices: { a: "Paragraph 4", b: "Paragraph 1", c: "Paragraph 2", d: "Paragraph 3" },
    answer: "a",
    explanation: "Đoạn 4 nói khay chung vẫn có ích. Sai là coi ảnh khay thành bằng chứng cho mọi tên trên bảng phân công.",
    whyWrong: {
      b: "Đoạn 1 kể một buổi chỉ một người biết lúc tắt ấm.",
      c: "Đoạn 2 mô tả quy tắc mới.",
      d: "Đoạn 3 kể việc quay lại tắt bếp.",
    },
  }),
  choice("single_choice", "stim-b-kettle", readingTopic.id, {
    id: "pb-40",
    difficulty: "medium",
    stem: "What is the main idea of the passage?",
    choices: {
      a: "A tidy shared result does not prove that every student saw the last step.",
      b: "Tea should not be made for visitors at school.",
      c: "A photo is more useful than a short note.",
      d: "Only one student should be allowed to use the kettle.",
    },
    answer: "a",
    explanation: "Cả bài nói kết quả gọn chung không chứng minh mọi người đã theo dõi bước cuối. Ghi chú ngắn cho thấy người viết có mặt lúc nhóm quyết định phòng đã an toàn.",
    whyWrong: {
      b: "Pha trà chỉ là tình huống mở đầu, không phải kết luận.",
      c: "Đoạn nói ảnh không thay được dòng ghi chú.",
      d: "Lớp vẫn dùng chung ấm và khay, không cấm chỉ còn một người.",
    },
  }),
];

export const paperBQuestions: PaperQuestion[] = [
  ...bookQuestions,
  ...orderingQuestions,
  ...tinQuestions,
  ...roomQuestions,
  ...clayQuestions,
  ...kettleQuestions,
];

export const paperBExam = {
  id: "exam-form-b",
  yearLabel: "form-b",
  version: "form-b",
  status: "provisional",
  source: "Đề soạn trong app",
  questionCount: 40,
  durationMinutes: 50,
  sections: [
    { questionType: "gap_short", label: "Điền từ hoặc cụm ngắn", count: 12 },
    { questionType: "ordering", label: "Sắp xếp câu", count: 5 },
    { questionType: "gap_long", label: "Điền câu hoặc cụm dài", count: 5 },
    { questionType: "reading", label: "Đọc hiểu", count: 18 },
  ],
  notes:
    "Mã đề B gồm 40 câu, 50 phút, cùng dạng với kỳ thi từ năm 2025. Câu và đoạn văn được soạn trong app, không phải đề của Bộ. Điểm trên thang 10 chỉ dùng trong phiên này.",
  questionIds: paperBQuestions.map((question) => question.id),
};
