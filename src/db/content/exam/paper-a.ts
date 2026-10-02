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

const repair = `SATURDAY REPAIR DESK

Room 12 will open a free repair desk this Saturday. Bring a torn school bag, a loose bicycle light, or a button that has come off.

If everyone (1)______ one hour, the class can clear the box of broken items. The aim is to cut the (2)______ of small things that are thrown away. Bags with holes will be (3)______ on the front table before noon. Volunteers will (4)______ out needles, thread, and screwdrivers at the door. We want students to (5)______ the habit of mending an item once before buying a new one. Your (6)______ on the sheet tells us how many tables to set.

Sign up by Thursday. Put every tool back in the labelled box when you leave.`;

const readingLog = `A paper reading log looks slow, but the pause is the point. (1)______. A saved link only shows that a page was opened. (2)______. The log asks for three lines: the claim, one piece of evidence, and a doubt. (3)______. A week later those lines are enough to restart the idea without opening a long row of tabs. (4)______. Copying whole paragraphs into the log misses the same point as keeping unread links. (5)______.`;

const nightBus = `The last bus from the industrial park used to leave at 9 p.m. Students who finished the evening shift at the packing house often missed it by ten minutes and then walked for forty minutes along a road with no lamps. In March the ward changed the timetable. The last bus now leaves at 9.40 p.m., and one extra stop was added outside the packing house gate.

[I] The change did not need a new vehicle. The bus was already going back empty to the depot, so the later trip used a journey that would have happened anyway. [II] What changed was who could get home without asking a parent to wait in the dark. [III] Ms Lien, who teaches the evening class, said attendance on Thursdays rose after the new time was printed on the gate. [IV]

A few shopkeepers near the old stop objected. They liked the 9 p.m. bus because it brought workers past their stalls before closing time. The ward posted both times for two weeks and kept the 9 p.m. bus on Fridays, when the market stays open. On other nights the 9.40 bus is the last one.

The student council still wants a lamp on the short path between the gate and the new stop. The later bus removes most of the walk, but those five minutes are still dark after rain. A lamp was requested in April and has not been installed. Until then, students are told to wait inside the gate and come out only when the bus lights are visible.`;

const mapAd = `SUNDAY MAP WORKSHOP

The ward library is opening eight places on a map workshop for students aged 16 to 18. You will walk three streets and draw the shops, the bus stops, and the places that still have no lamp.

Bring a pencil and a notebook. Phones may be used only to check a street name, not to copy a finished map. The clearer your sketch is, the (27)______ useful it will be when the class compares streets. No one who arrives after 8.15 (28)______ be given a route card, because the groups leave together.

(29)______, the library will lend clipboards to students who do not have one. (30)______ student needs previous drawing lessons; the tutor starts with two simple symbols. Forms (31)______ be handed in at the front desk by Friday noon. This is a rare chance to make a map your neighbours can actually (32)______.`;

const labSlides = `When a group hands in one slide deck, the teacher sees a tidy result and cannot see who understood the method. In a chemistry class last term, four students submitted a graph of how fast salt dissolved in warm water. The graph was correct. The talk afterwards was not. Only one student could explain why the group had kept the volume the same. The others had split the jobs so early that they never watched the trial.

The teacher changed the rule for the next project. The group still shared one table of results, but each person wrote four sentences alone before the meeting: what was changed, what was kept the same, what the numbers showed, and what still seemed unclear. The group slide could use those sentences, but it could not stand in place of them.

The new rule took more time. It also showed the gaps while there was still time to repeat a step. One group found that they had timed only the first minute and had guessed the rest. They ran the trial again before the deadline. The deck looked plainer than the first project, and the method was easier to explain.

A shared page is still a good place for an agreed table. The mistake is to treat that page as proof that every name on it followed the method. A short note from each student does not measure talent. It shows whether the writer was present when the group decided what the numbers meant.`;

export const paperAStimuli: Stimulus[] = [
  { id: "stim-repair", kind: "gap_text", title: "Saturday Repair Desk", body: repair, topicId: readingTopic.id },
  { id: "stim-o1", kind: "ordering_prompt", title: "Choir rehearsal", body: "Put the parts of the email in a logical order.", topicId: orderingTopic.id },
  { id: "stim-o2", kind: "ordering_prompt", title: "Locker key", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-o3", kind: "ordering_prompt", title: "Class podcast", body: "Put the sentences in a logical order.", topicId: orderingTopic.id },
  { id: "stim-o4", kind: "ordering_prompt", title: "Cooking club", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-o5", kind: "ordering_prompt", title: "Sports day", body: "Put the sentences in the order of the events.", topicId: orderingTopic.id },
  { id: "stim-log", kind: "gap_text", title: "A paper reading log", body: readingLog, topicId: readingTopic.id },
  { id: "stim-bus", kind: "passage", title: "The later bus", body: nightBus, topicId: readingTopic.id },
  { id: "stim-map", kind: "gap_text", title: "Sunday map workshop", body: mapAd, topicId: readingTopic.id },
  { id: "stim-lab", kind: "passage", title: "Shared slides", body: labSlides, topicId: readingTopic.id },
];

const repairQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-1",
    difficulty: "easy",
    stem: "Repair desk (1)",
    choices: { a: "gives", b: "give", c: "giving", d: "gave" },
    answer: "a",
    explanation: "Everyone đi với động từ số ít. Câu điều kiện loại 0/1 ở đây nói thói quen ngày thứ Bảy, dùng hiện tại đơn gives.",
    whyWrong: {
      b: "Give hợp với I, you, we, they, không hợp với everyone.",
      c: "Giving là dạng -ing, không đứng một mình sau if everyone.",
      d: "Gave là quá khứ. Câu đang nói việc sắp làm vào thứ Bảy, không phải một lần đã qua.",
    },
  }),
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-2",
    difficulty: "medium",
    stem: "Repair desk (2)",
    choices: { a: "number", b: "numbered", c: "numbering", d: "numbers" },
    answer: "a",
    explanation: "Cut the number of nghĩa là giảm số lượng. Ở đây cần danh từ số ít sau the.",
    whyWrong: {
      b: "Numbered là tính từ hoặc quá khứ, không đi sau the trong cụm này.",
      c: "Numbering là danh động từ, không phải cụm cut the number of.",
      d: "Numbers là số nhiều hoặc động từ. Trước of người ta dùng the number of.",
    },
  }),
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-3",
    difficulty: "medium",
    stem: "Repair desk (3)",
    choices: { a: "collect", b: "collecting", c: "collected", d: "to collect" },
    answer: "c",
    explanation: "Bags will be collected là bị động thì tương lai. Việc được làm cho các túi, không phải túi tự làm.",
    whyWrong: {
      a: "Collect là nguyên mẫu chủ động. Chủ ngữ bags không tự thu.",
      b: "Will be collecting là chủ động tiếp diễn, không phải bị động.",
      d: "To collect không đi sau will be.",
    },
  }),
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-4",
    difficulty: "medium",
    stem: "Repair desk (4)",
    choices: { a: "hand", b: "take", c: "look", d: "make" },
    answer: "a",
    explanation: "Hand out nghĩa là phát cho mọi người. Câu có out ngay sau chỗ trống.",
    whyWrong: {
      b: "Take out là lấy ra, không phải phát tại cửa.",
      c: "Look out là cẩn thận, không đi với needles and thread theo nghĩa này.",
      d: "Make out là nhìn ra hoặc hiểu ra, không phải phát dụng cụ.",
    },
  }),
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-5",
    difficulty: "easy",
    stem: "Repair desk (5)",
    choices: { a: "build", b: "building", c: "built", d: "builds" },
    answer: "a",
    explanation: "Want someone to do something. Sau to cần động từ nguyên mẫu build.",
    whyWrong: {
      b: "Building không đi sau to trong cấu trúc want to.",
      c: "Built là quá khứ hoặc quá khứ phân từ.",
      d: "Builds thêm -s khi không có to trước nó với chủ ngữ số ít.",
    },
  }),
  choice("gap_short", "stim-repair", readingTopic.id, {
    id: "pa-6",
    difficulty: "medium",
    stem: "Repair desk (6)",
    choices: { a: "sign", b: "signature", c: "signed", d: "signing" },
    answer: "b",
    explanation: "Your signature nghĩa là chữ ký của bạn. Câu cần danh từ.",
    whyWrong: {
      a: "Sign có thể là danh từ biển báo hoặc động từ ký. Your sign on the sheet không phải cách nói chữ ký.",
      c: "Signed là tính từ hoặc quá khứ.",
      d: "Signing là danh động từ. Cụm tự nhiên là your signature.",
    },
  }),
];

const orderingQuestions: PaperQuestion[] = [
  order({
    id: "pa-7",
    stimulusId: "stim-o1",
    stem: "Put the parts of the email in a logical order.",
    sentences: [
      { id: "a", text: "Please reply by Wednesday so the smaller room can be booked." },
      { id: "b", text: "The Thursday rehearsal will move from the hall to room 4." },
      { id: "c", text: "Dear choir members," },
      { id: "d", text: "The hall is being used for the parents' meeting that evening." },
      { id: "e", text: "Bring your own folder, because the new room has no spare copies." },
    ],
    correctAnswer: "c,b,d,e,a",
    explanation: "Thư mở bằng lời chào, báo đổi phòng, nêu lý do, dặn mang tài liệu, rồi mới xin trả lời.",
  }),
  order({
    id: "pa-8",
    stimulusId: "stim-o2",
    stem: "Locker key: put the utterances in the order of the conversation.",
    sentences: [
      { id: "b", text: "Nam: Show your student card at the office and they will lend you a spare key." },
      { id: "c", text: "Mai: Thanks. I will go there before the bell." },
      { id: "a", text: "Mai: I cannot open my locker. The key is still in yesterday's jacket." },
    ],
    correctAnswer: "a,b,c",
    explanation: "Mai nói vấn đề, Nam chỉ chỗ lấy chìa khóa dự phòng, Mai cảm ơn và đi.",
  }),
  order({
    id: "pa-9",
    stimulusId: "stim-o3",
    stem: "Put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "After the third episode, two listeners wrote to correct a date about the old ferry." },
      { id: "b", text: "The class recorded short interviews with neighbours who had lived on the street for years." },
      { id: "c", text: "Those corrections were read out at the start of the next episode." },
      { id: "d", text: "Each interview was cut to four minutes and posted on Friday evening." },
      { id: "e", text: "The first episode explained why the street still had no evening bus." },
    ],
    correctAnswer: "b,e,d,a,c",
    explanation: "Thu âm trước, làm tập mở đầu, đăng vào thứ Sáu, người nghe góp ý, rồi đọc đính chính ở tập sau.",
  }),
  order({
    id: "pa-10",
    stimulusId: "stim-o4",
    stem: "Cooking club: put the utterances in the order of the conversation.",
    sentences: [
      { id: "a", text: "Hoa: I am not sure. I have never cooked for more than two people." },
      { id: "b", text: "Khanh: Then start on the salad team. We need someone to wash and measure, not to invent a dish." },
      { id: "c", text: "Hoa: Are you still taking names for the cooking club lunch?" },
      { id: "d", text: "Khanh: Yes. The form closes on Monday." },
      { id: "e", text: "Hoa: All right. Put my name on that team." },
    ],
    correctAnswer: "c,d,a,b,e",
    explanation: "Hoa hỏi còn nhận tên không, Khanh trả lời hạn chót, Hoa ngại, Khanh giao việc dễ, Hoa đồng ý.",
  }),
  order({
    id: "pa-11",
    stimulusId: "stim-o5",
    stem: "Put the sentences in the order of the events.",
    sentences: [
      { id: "a", text: "By 7 a.m. the field was still too wet for running." },
      { id: "b", text: "The results were pinned on the gym door before lunch." },
      { id: "c", text: "Sports day had been planned for the school field." },
      { id: "d", text: "Teachers moved the races into the gym and shortened each heat." },
      { id: "e", text: "Heavy rain fell all night." },
    ],
    correctAnswer: "c,e,a,d,b",
    explanation: "Kế hoạch sân ngoài, mưa đêm, sáng sân còn ướt, chuyển vào nhà thi đấu, rồi mới dán kết quả.",
  }),
];

const logQuestions: PaperQuestion[] = [
  choice("gap_long", "stim-log", readingTopic.id, {
    id: "pa-12",
    difficulty: "hard",
    stem: "Reading log (1)",
    choices: {
      a: "It asks the reader to stop at the end of an article and decide what is worth keeping.",
      b: "It asks the library to store every article the class might need next year.",
      c: "It asks the teacher to highlight the claim before the students open the text.",
      d: "It asks the writer of the article to add three lines at the top.",
    },
    answer: "a",
    explanation: "Câu trước nói sự dừng lại mới là điều đáng giá. Câu đúng nói người đọc phải tự chọn điều đáng giữ.",
    whyWrong: {
      b: "Nhật ký không giao việc lưu trữ cho thư viện.",
      c: "Giáo viên tô sẵn ý chính thì mất việc người đọc tự chọn.",
      d: "Người viết bài báo không phải người ghi nhật ký.",
    },
  }),
  choice("gap_long", "stim-log", readingTopic.id, {
    id: "pa-13",
    difficulty: "hard",
    stem: "Reading log (2)",
    choices: {
      a: "A saved link shows that the page was opened, not that the argument was understood.",
      b: "A saved link is better than three lines because it keeps the whole article.",
      c: "A saved link should be printed before the claim is written down.",
      d: "A saved link proves the reader can already explain the evidence.",
    },
    answer: "a",
    explanation: "Câu trước nói link chỉ cho thấy trang đã được mở. Câu đúng nối tiếp: mở chưa có nghĩa là hiểu lập luận.",
    whyWrong: {
      b: "Đoạn đang chê việc chỉ lưu link, không khen link hơn ba dòng.",
      c: "Không có bước in link trước khi viết ý.",
      d: "Link không chứng minh người đọc giải thích được dẫn chứng.",
    },
  }),
  choice("gap_long", "stim-log", readingTopic.id, {
    id: "pa-14",
    difficulty: "medium",
    stem: "Reading log (3)",
    choices: {
      a: "Three lines are short enough to finish quickly and exact enough to be useful later.",
      b: "Three lines should repeat the title so the link can be found again.",
      c: "Three lines are optional if the article is already short.",
      d: "Three lines replace the need to read the article at all.",
    },
    answer: "a",
    explanation: "Ba dòng vừa nêu xong. Câu đúng nói vì sao ba dòng ấy đủ dùng.",
    whyWrong: {
      b: "Ba dòng là ý chính, dẫn chứng và chỗ còn nghi, không phải chép lại nhan đề.",
      c: "Đoạn không cho miễn ba dòng khi bài ngắn.",
      d: "Nhật ký ghi sau khi đọc, không thay việc đọc.",
    },
  }),
  choice("gap_long", "stim-log", readingTopic.id, {
    id: "pa-15",
    difficulty: "medium",
    stem: "Reading log (4)",
    choices: {
      a: "Students who reread only the log often remember the doubt more clearly than the opening story.",
      b: "Students who reread only the log usually lose the claim and the evidence.",
      c: "Students should delete the log once the tabs have been closed.",
      d: "Students remember the opening story best when they never write the doubt.",
    },
    answer: "a",
    explanation: "Câu trước nói một tuần sau ba dòng giúp mở lại ý. Câu đúng nói người đọc lại nhật ký nhớ chỗ còn nghi rõ hơn chuyện mở đầu.",
    whyWrong: {
      b: "Trái với câu trước, vì ba dòng có cả ý chính và dẫn chứng.",
      c: "Xóa nhật ký thì mất chỗ để mở lại ý.",
      d: "Đoạn coi dòng về chỗ còn nghi là phần cần giữ.",
    },
  }),
  choice("gap_long", "stim-log", readingTopic.id, {
    id: "pa-16",
    difficulty: "hard",
    stem: "Reading log (5)",
    choices: {
      a: "The log works only when the reader chooses and condenses, not when the page is copied.",
      b: "The log works best when every paragraph is pasted in full.",
      c: "The log works because unread links already contain the doubt.",
      d: "The log works if another student writes the three lines.",
    },
    answer: "a",
    explanation: "Câu trước nói chép cả đoạn thì hỏng giống như giữ link chưa đọc. Câu đúng chốt: nhật ký chỉ có ích khi người đọc tự rút ý.",
    whyWrong: {
      b: "Chép nguyên đoạn là việc đoạn vừa bác.",
      c: "Link chưa đọc không chứa chỗ người đọc còn nghi.",
      d: "Người khác viết thì không còn là việc đọc của mình.",
    },
  }),
];

const busQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-17",
    difficulty: "medium",
    stem: "The word depot in paragraph 2 is closest in meaning to ______.",
    choices: {
      a: "the place where the bus is kept when the route is finished",
      b: "the gate where the students wait",
      c: "the market that stays open on Friday",
      d: "the office that prints the new timetable",
    },
    answer: "a",
    explanation: "Going back empty to the depot nghĩa là xe về chỗ đỗ sau khi hết tuyến.",
    whyWrong: {
      b: "Cổng là nơi học sinh đợi, không phải nơi xe về.",
      c: "Chợ mở vào thứ Sáu, không phải bãi xe.",
      d: "Không có văn phòng in thời khóa biểu trong câu đó.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-18",
    difficulty: "easy",
    stem: "Before March, students who missed the bus had to ______.",
    choices: {
      a: "walk about forty minutes on a dark road",
      b: "wait inside the packing house until morning",
      c: "pay for a taxi at the new stop",
      d: "ask Ms Lien to drive them home",
    },
    answer: "a",
    explanation: "Đoạn đầu nói các bạn trễ xe rồi đi bộ bốn mươi phút trên đường không có đèn.",
    whyWrong: {
      b: "Không nói ở lại đến sáng.",
      c: "Không nói tiền taxi.",
      d: "Cô Lien dạy ca tối, không chở các bạn về.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-19",
    difficulty: "medium",
    stem: "Which of the following is NOT given in the passage?",
    choices: {
      a: "The names of the shopkeepers who objected",
      b: "The old leaving time of the last bus",
      c: "The reason the later trip did not need a new vehicle",
      d: "The month when a lamp was requested",
    },
    answer: "a",
    explanation: "Bài nói một vài người bán hàng phản đối, nhưng không nêu tên.",
    whyWrong: {
      b: "Giờ cũ là 9 giờ tối.",
      c: "Xe vốn chạy về bãi dù không có khách.",
      d: "Đèn được xin vào tháng Tư.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-20",
    difficulty: "hard",
    stem: "Where does this sentence best fit? \"Parents who used to wait by the gate have mostly stopped coming.\"",
    choices: { a: "[I]", b: "[II]", c: "[III]", d: "[IV]" },
    answer: "c",
    explanation: "Câu trước [III] nói phụ huynh không còn phải đợi trong tối. Câu được cho nối tiếp đúng ý đó, rồi mới đến nhận xét của cô Lien.",
    whyWrong: {
      a: "[I] đứng trước phần chi phí, chưa nói gì về phụ huynh.",
      b: "[II] còn đang nói về chiếc xe chạy không, chưa tới việc ai được về nhà.",
      d: "[IV] đã qua ý phụ huynh và qua cả nhận xét về sĩ số.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-21",
    difficulty: "medium",
    stem: "What is the main idea of paragraph 3?",
    choices: {
      a: "The ward kept one earlier bus when the market needed it.",
      b: "The shopkeepers paid for the Friday bus.",
      c: "The market moved closer to the packing house.",
      d: "The 9.40 bus runs only on Friday.",
    },
    answer: "a",
    explanation: "Đoạn 3 nói người bán hàng phản đối, phường giữ xe 9 giờ vào thứ Sáu vì chợ còn mở.",
    whyWrong: {
      b: "Không nói họ trả tiền chuyến xe.",
      c: "Chợ không chuyển chỗ.",
      d: "Xe 9 giờ 40 là chuyến cuối các đêm khác, không chỉ thứ Sáu.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-22",
    difficulty: "easy",
    stem: "The word it in paragraph 3 refers to ______.",
    choices: {
      a: "the 9 p.m. bus",
      b: "the market",
      c: "the ward",
      d: "the lamp",
    },
    answer: "a",
    explanation: "They liked the 9 p.m. bus because it brought workers past their stalls. It là chuyến xe đó.",
    whyWrong: {
      b: "Chợ không đưa công nhân đi qua quầy.",
      c: "Phường không phải chủ ngữ của brought.",
      d: "Đèn nằm ở đoạn sau, không ở câu này.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-23",
    difficulty: "hard",
    stem: "What can be inferred about Thursday classes?",
    choices: {
      a: "More students could stay for them after the bus time changed.",
      b: "They were cancelled when the road was dark.",
      c: "They are taught only to the shopkeepers.",
      d: "They now finish before 9 p.m.",
    },
    answer: "a",
    explanation: "Cô Lien nói sĩ số thứ Năm tăng sau khi giờ mới được dán ở cổng. Suy ra nhiều bạn ở lại lớp hơn.",
    whyWrong: {
      b: "Lớp không bị hủy.",
      c: "Người học là học sinh ca tối, không phải người bán hàng.",
      d: "Bài không nói lớp tan trước 9 giờ.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-24",
    difficulty: "medium",
    stem: "Which of the following is true according to the passage?",
    choices: {
      a: "The path from the gate to the new stop is still dark.",
      b: "The lamp was installed in April.",
      c: "Students should walk to the stop before the bus is visible.",
      d: "The 9 p.m. bus was removed on every night.",
    },
    answer: "a",
    explanation: "Đoạn cuối nói năm phút từ cổng ra bến mới vẫn tối sau mưa, và đèn chưa gắn.",
    whyWrong: {
      b: "Đèn được xin vào tháng Tư nhưng chưa gắn.",
      c: "Các bạn được dặn đợi trong cổng đến khi thấy đèn xe.",
      d: "Xe 9 giờ vẫn chạy vào thứ Sáu.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-25",
    difficulty: "hard",
    stem: "What can be inferred about the cost of the new trip?",
    choices: {
      a: "It was limited because the bus would have returned anyway.",
      b: "It was high because a second bus had to be bought.",
      c: "It was paid by the shopkeepers near the old stop.",
      d: "It rose after the lamp was requested.",
    },
    answer: "a",
    explanation: "Đoạn 2 nói không cần xe mới vì xe vốn chạy không về bãi.",
    whyWrong: {
      b: "Bài nói không cần xe mới.",
      c: "Người bán hàng phản đối, không phải người trả tiền.",
      d: "Đèn và chi phí chuyến xe là hai việc khác nhau.",
    },
  }),
  choice("single_choice", "stim-bus", readingTopic.id, {
    id: "pa-26",
    difficulty: "medium",
    stem: "Which title best fits the passage?",
    choices: {
      a: "A Later Bus, and One Dark Path Left",
      b: "Why the Market Closed in March",
      c: "Buying a New Bus for the Evening Shift",
      d: "Ms Lien's Plan to Light the Whole Road",
    },
    answer: "a",
    explanation: "Bài nói chuyến xe muộn hơn giúp phần lớn quãng đi bộ, nhưng đoạn đường ngắn vẫn tối.",
    whyWrong: {
      b: "Chợ không đóng cửa vào tháng Ba.",
      c: "Không mua xe mới.",
      d: "Cô Lien nói về sĩ số, không phải người lập kế hoạch thắp sáng cả con đường.",
    },
  }),
];

const mapQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-27",
    difficulty: "hard",
    stem: "Map workshop (27)",
    choices: { a: "more", b: "most", c: "much", d: "the more" },
    answer: "a",
    explanation: "The clearer ... the more useful là so sánh kép. Chữ the đã có sẵn trước chỗ trống, nên chỉ điền more.",
    whyWrong: {
      b: "Most là so sánh nhất, không đi với the clearer.",
      c: "Much không đứng ở vị trí này trong so sánh kép.",
      d: "The more sẽ thành the the more vì chữ the đã đứng trước chỗ trống.",
    },
  }),
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-28",
    difficulty: "medium",
    stem: "Map workshop (28)",
    choices: { a: "will", b: "must", c: "should", d: "can" },
    answer: "a",
    explanation: "No one ... will be given là câu bị động nói quy định. Người đến muộn sẽ không nhận phiếu.",
    whyWrong: {
      b: "Must be given nghĩa là bị buộc phải nhận, trái với ý từ chối.",
      c: "Should be given là lời khuyên nên đưa, không phải quy định từ chối.",
      d: "Can be given nghĩa là có thể được nhận. Câu muốn nói sẽ không được nhận.",
    },
  }),
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-29",
    difficulty: "easy",
    stem: "Map workshop (29)",
    choices: { a: "In addition", b: "However", c: "Otherwise", d: "For example" },
    answer: "a",
    explanation: "Câu sau thêm một hỗ trợ nữa, cho mượn bảng kẹp. In addition nối ý bổ sung.",
    whyWrong: {
      b: "However báo ý ngược. Cho mượn bảng kẹp không trái với các câu trước.",
      c: "Otherwise nghĩa là nếu không thì. Không có điều kiện vừa nêu.",
      d: "For example mở một ví dụ. Câu này là một việc thư viện làm thêm.",
    },
  }),
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-30",
    difficulty: "medium",
    stem: "Map workshop (30)",
    choices: { a: "No", b: "Each", c: "Every", d: "Either" },
    answer: "a",
    explanation: "No student needs previous lessons vì người hướng dẫn bắt đầu từ hai ký hiệu đơn giản.",
    whyWrong: {
      b: "Each student needs nghĩa là ai cũng cần bài học vẽ trước. Trái với câu.",
      c: "Every student needs cũng là ai cũng cần.",
      d: "Either student không đi với needs theo kiểu này khi nói cả nhóm.",
    },
  }),
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-31",
    difficulty: "easy",
    stem: "Map workshop (31)",
    choices: { a: "must", b: "mustn't", c: "might", d: "could" },
    answer: "a",
    explanation: "Hạn nộp là bắt buộc. Forms must be handed in.",
    whyWrong: {
      b: "Mustn't nghĩa là không được nộp. Trái với lời mời nộp.",
      c: "Might be handed in là có thể nộp, không phải hạn chót.",
      d: "Could be handed in cũng chỉ khả năng, không phải quy định.",
    },
  }),
  choice("gap_short", "stim-map", readingTopic.id, {
    id: "pa-32",
    difficulty: "medium",
    stem: "Map workshop (32)",
    choices: { a: "use", b: "used", c: "using", d: "useful" },
    answer: "a",
    explanation: "Can actually use. Sau can cần động từ nguyên mẫu.",
    whyWrong: {
      b: "Used là quá khứ.",
      c: "Using không đi sau can.",
      d: "Useful là tính từ. Câu cần động từ.",
    },
  }),
];

const labQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-33",
    difficulty: "easy",
    stem: "In paragraph 1, the writer shows that ______.",
    choices: {
      a: "a correct graph did not prove that every student understood the method",
      b: "the salt experiment failed because the water was too warm",
      c: "four students refused to share one graph",
      d: "the teacher already knew who had watched the trial",
    },
    answer: "a",
    explanation: "Biểu đồ đúng, nhưng chỉ một bạn giải thích được vì sao giữ nguyên thể tích.",
    whyWrong: {
      b: "Thí nghiệm không thất bại. Biểu đồ đúng.",
      c: "Nhóm đã nộp một biểu đồ chung.",
      d: "Giáo viên phát hiện điều này sau buổi nói chuyện, không phải biết sẵn.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-34",
    difficulty: "easy",
    stem: "The word them in paragraph 2 refers to ______.",
    choices: {
      a: "the four sentences",
      b: "the results",
      c: "the students",
      d: "the gaps",
    },
    answer: "a",
    explanation: "The group slide could use those sentences, but it could not stand in place of them. Them là bốn câu đó.",
    whyWrong: {
      b: "Results là bảng số liệu, không phải thứ slide không được thay.",
      c: "Students không phải danh từ vừa được nhắc trong cụm those sentences.",
      d: "Gaps xuất hiện ở đoạn sau.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-35",
    difficulty: "medium",
    stem: "Which sentence best paraphrases the new rule?",
    choices: {
      a: "Each student had to write a short account before the group built the slide.",
      b: "The group could submit the slide only if the graph looked plain.",
      c: "One student wrote the method and the others checked the spelling.",
      d: "The shared table was banned so that nobody could copy a result.",
    },
    answer: "a",
    explanation: "Mỗi người viết bốn câu một mình trước buổi họp. Slide được dùng các câu đó nhưng không thay chúng.",
    whyWrong: {
      b: "Bài không bắt slide phải trông sơ sài mới được nộp.",
      c: "Không chia một người viết và người khác chỉ sửa chính tả.",
      d: "Nhóm vẫn được chia sẻ một bảng kết quả.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-36",
    difficulty: "medium",
    stem: "The word plainer in paragraph 3 is OPPOSITE in meaning to ______.",
    choices: { a: "more decorated", b: "more accurate", c: "more public", d: "more careful" },
    answer: "a",
    explanation: "Plainer ở đây là ít trau chuốt hơn. Trái nghĩa là được trang trí, trình bày cầu kỳ hơn.",
    whyWrong: {
      b: "Accurate nói về đúng số liệu, không phải vẻ ngoài của slide.",
      c: "Public nói về việc có công khai hay không.",
      d: "Careful nói về sự cẩn thận, không phải mức độ trang trí.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-37",
    difficulty: "medium",
    stem: "The word defend near the end of paragraph 3 is closest in meaning to ______.",
    choices: { a: "explain and support", b: "hide", c: "decorate", d: "cancel" },
    answer: "a",
    explanation: "The method was easier to defend nghĩa là dễ giải thích và bảo vệ cách làm.",
    whyWrong: {
      b: "Hide là giấu. Câu đang nói phương pháp dễ trình bày hơn.",
      c: "Decorate là trang trí slide, không phải bảo vệ phương pháp.",
      d: "Cancel là hủy. Nhóm đã làm lại thí nghiệm, không hủy phương pháp.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-38",
    difficulty: "hard",
    stem: "Which statement would the writer disagree with?",
    choices: {
      a: "A shared slide proves that every named student followed the method.",
      b: "An agreed table can still be placed on a shared page.",
      c: "An individual note can reveal a gap in time to fix it.",
      d: "Guessing the later minutes made the first timing incomplete.",
    },
    answer: "a",
    explanation: "Đoạn cuối nói sai lầm chính là coi trang chung là bằng chứng mọi người đều hiểu cách làm.",
    whyWrong: {
      b: "Người viết nói trang chung vẫn là chỗ tốt để đặt bảng đã thống nhất.",
      c: "Quy tắc mới giúp thấy lỗ hổng khi còn kịp làm lại.",
      d: "Một nhóm phát hiện mình chỉ bấm giờ phút đầu rồi đoán phần còn lại.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-39",
    difficulty: "medium",
    stem: "In which paragraph does a group repeat an experiment?",
    choices: { a: "Paragraph 3", b: "Paragraph 1", c: "Paragraph 2", d: "Paragraph 4" },
    answer: "a",
    explanation: "Đoạn 3 nói một nhóm làm lại thí nghiệm trước hạn vì đã đoán phần thời gian còn lại.",
    whyWrong: {
      b: "Đoạn 1 chỉ có một thí nghiệm đã nộp.",
      c: "Đoạn 2 nêu quy tắc viết bốn câu, chưa làm lại thí nghiệm.",
      d: "Đoạn 4 kết luận về ý nghĩa của trang chung và ghi chú riêng.",
    },
  }),
  choice("single_choice", "stim-lab", readingTopic.id, {
    id: "pa-40",
    difficulty: "medium",
    stem: "In which paragraph does the writer limit the claim about shared slides?",
    choices: { a: "Paragraph 4", b: "Paragraph 1", c: "Paragraph 2", d: "Paragraph 3" },
    answer: "a",
    explanation: "Đoạn 4 nói trang chung không phải là sai. Sai là coi nó thành bằng chứng cho mọi tên trên trang.",
    whyWrong: {
      b: "Đoạn 1 kể một trường hợp biểu đồ đúng nhưng chỉ một người hiểu.",
      c: "Đoạn 2 mô tả quy tắc mới.",
      d: "Đoạn 3 kể việc làm lại thí nghiệm.",
    },
  }),
];

export const paperAQuestions: PaperQuestion[] = [
  ...repairQuestions,
  ...orderingQuestions,
  ...logQuestions,
  ...busQuestions,
  ...mapQuestions,
  ...labQuestions,
];

export const paperAExam = {
  id: "exam-form-a",
  yearLabel: "form-a",
  version: "form-a",
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
    "Mã đề A gồm 40 câu, 50 phút, cùng dạng với kỳ thi từ năm 2025. Câu và đoạn văn được soạn trong app, không phải đề của Bộ. Điểm trên thang 10 chỉ dùng trong phiên này.",
  questionIds: paperAQuestions.map((question) => question.id),
};
