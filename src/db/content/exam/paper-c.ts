import { contentHash } from "../../hash";
import { mcq } from "../helpers";
import { orderingTopic, readingTopic } from "./items";

// Đề thi chính thức môn Tiếng Anh kỳ thi tốt nghiệp THPT năm 2026, mã đề 1116 (Bộ Giáo dục và Đào tạo).
// Đề và thứ tự câu theo đề thật. Đáp án đối chiếu với bản "đáp án tham khảo" của bên thứ ba và đã được
// kiểm lại từng câu theo nội dung đề. Lời giải do app soạn, không phải của Bộ.

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
  input: Parameters<typeof mcq>[0],
): PaperQuestion {
  return { ...mcq(input), type, stimulusId, topicId: readingTopic.id, grade: 12 };
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

const wealth = `Money has many ironies, and here is an important one: wealth is what you do not see. On spotting a Ferrari driving around, (6)______. In reality, however, many drivers of expensive cars turn out to be only mediocre successes who spend a huge percentage of their paycheck on a vehicle. Someone driving a hundred-thousand-dollar car might indeed be wealthy. Yet the only firm data point you have about their wealth is that they have a hundred thousand dollars less than they did before they bought the car or a hundred thousand dollars more in debt. (7)______.

We tend to judge wealth by what we see (8)______. We cannot peer into people’s bank accounts or brokerage statements, so we rely on outward appearances to gauge financial success: cars, houses, photographs on social media. Modern capitalism has turned helping people fake it until they make it into a cherished industry. (9)______. Wealth hides in the nice car not purchased, the diamonds left in the shop and the first-class upgrade declined. Wealth is the financial assets that have not yet been converted into the stuff you see.

Hence, we should be careful (10)______. It is more than mere semantics; not knowing the difference is the source of countless poor money decisions.

(Adapted from Psychology of Money)`;

const environment = `Environmental services, even when they arise without any human labour, are by no means cost-free. Every cost should be understood in terms of opportunity cost. For environmental services, the opportunity cost amounts to the net gain relinquished because the resources are no longer available for their second-best application. Whenever a resource has alternative uses, it cannot legitimately be deemed free.

For instance, a section of river might serve as a site used for either white-water canoeing or hydroelectric generation. Constructing a dam to produce electricity would flood the rapids, so this makes white-water canoeing here out of the question. The opportunity cost of preserving the river for canoeing equals the net benefit of the electricity that would otherwise have been produced, once the expenses of generation and distribution have been subtracted. By the same token, the opportunity cost of erecting the dam involves everything the river in its natural state would have provided – leisure activities, wildlife, scenic beauty, and whatever worth future generations might attach to experiencing the rapids.

This understanding carries considerable weight for planning development. [I] Numerous decisions initially appearing to be cost-free moves in favour of growth prove, when examined carefully, to be against something else. [II] Clearing a forest to make way for crops is hardly without cost; it is paid for through losses in carbon storage, biological diversity, and all the functions the forest once performed unnoticed. [III] Channelling a river for irrigation has its price – namely, whatever the river was doing before its course was altered. [IV] Even leaving a swathe of land alone exacts a cost, since the earnings that intensive exploitation might have produced are equally sacrificed.

From this perspective, economic development can never be reduced to whether a project delivers a positive return. Rather, what must be asked is whether that return outweighs the value of sacrifices. Policies considering this – by pricing scarce environmental services, or obliging those in charge to consider both sides – are not against development. What they demand is that development should be worth its true cost. The danger lies not in counting too much, but in counting too little.

(Adapted from Environmental Economics and Policy)`;

const laptops = `For most undergraduates today, opening a laptop at the start of a lecture has become as automatic as sitting down. The device is no longer a tool consciously chosen; it is simply there, blinking softly, ready to absorb every word that the instructor utters. Yet researchers who study students’ attention argue that this convenience comes at a price most learners are unaware that they are paying.

A recent multi-campus study tracked the in-class behaviour of nearly two thousand undergraduates across humanities and science courses. Even when students claimed to be “fully focused,” eye-tracking data showed that they shifted between unrelated tabs an average of fourteen times per fifty-minute session. The students themselves were astounded when they were shown the results. Many had believed that they were absorbing every point made in class.

The findings underline an unsettling truth: digital multitasking is not just inefficient; it is invisible to those engaged in it. Cognitive scientists describe this as “the illusion of competence” – the false sense that because information has passed beneath one’s eyes, it has been understood and stored. Tests administered a week after the lectures consistently revealed otherwise, with laptop-using students recalling roughly a third less than those taking handwritten notes.

Things go from bad to worse when we take into account the fact that the very tools that distract students are also genuinely essential for some forms of academic work. Annotating digital texts, accessing research databases and recording lectures all benefit from screen-based learning. The crucial question for tertiary institutions, then, is not to get rid of devices altogether but to teach students when and how to set them aside. Until that skill is cultivated, the lecture hall may continue to function less as a place of collective inquiry and more as a quiet place of solitary screens.

(Adapted from https://vanderbilthustler.com)`;

const flyer = `LET’S WARM THEIR HEARTS!

In many remote regions, children face the harsh cold, which affects their health and education. Your kindness can warm their hearts. Let’s work together to give them a better winter. Our project includes:

• Collection: Please (29)______ out your old winter clothes by size and ensure that the items are dry and in good (30)______. You can drop them off at our collection points. This helps us organise the donations faster.
• Cleaning: We will have all donations (31)______ to ensure that they are fresh. We use eco-friendly detergents to (32)______ the sensitive skin of the children.
• Distribution: We (33)______ with local schools to distribute the clothes directly to the students in need.

If everyone (34)______ a hand, we will help thousands of children stay warm this winter.

Your small act of kindness will create a big change!`;

const leaflet = `GREEN HANDS, CLEAN LAND

The theme for Green Week 2026, “Green Hands, Clean Land”, puts (35)______ on the role of our community in protecting the environment. For several decades, climate change has had direct effects on our daily life. (36)______, unless action is taken, we will face food insecurity, water shortages, and higher energy prices.

Since 2018, our annual campaigns have been coming up (37)______. This year, we are planning two activities: clean-up and tree-planting. Participation in (38)______ activity is open to all residents. Completed forms (39)______ be submitted by 30 June.

It is time to make a big difference to our surroundings. The harder we try, (40)______ our future will be! Apply now!`;

// Đề thật có nhiều đề bài chung chung ("Which of the following is true according to the passage?") trùng
// với câu ở Mã đề A/B; cột content_hash là duy nhất toàn kho nên băm kèm mã đoạn văn.
export function paperCHash(question: { stimulusId: string; stem: string }) {
  return contentHash(`${question.stimulusId}\n${question.stem}`);
}

export const paperCStimuli: Stimulus[] = [
  { id: "stim-c-o1", kind: "ordering_prompt", title: "Wind power and local residents", body: "Put the sentences in the correct order.", topicId: orderingTopic.id },
  { id: "stim-c-o2", kind: "ordering_prompt", title: "A long wait at the restaurant", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-c-o3", kind: "ordering_prompt", title: "Young Researcher Grant letter", body: "Put the sentences of the letter in a logical order.", topicId: orderingTopic.id },
  { id: "stim-c-o4", kind: "ordering_prompt", title: "Exchanging an electric fan", body: "Put the utterances in the order of the conversation.", topicId: orderingTopic.id },
  { id: "stim-c-o5", kind: "ordering_prompt", title: "Fibre broadband for rural villages", body: "Put the sentences in the correct order.", topicId: orderingTopic.id },
  { id: "stim-c-wealth", kind: "gap_text", title: "Wealth is what you do not see", body: wealth, topicId: readingTopic.id },
  { id: "stim-c-env", kind: "passage", title: "The opportunity cost of environmental services", body: environment, topicId: readingTopic.id },
  { id: "stim-c-laptop", kind: "passage", title: "Laptops in the lecture hall", body: laptops, topicId: readingTopic.id },
  { id: "stim-c-flyer", kind: "gap_text", title: "Let’s warm their hearts!", body: flyer, topicId: readingTopic.id },
  { id: "stim-c-leaflet", kind: "gap_text", title: "Green hands, clean land", body: leaflet, topicId: readingTopic.id },
];

const orderingQuestions: PaperQuestion[] = [
  order({
    id: "pc-1",
    stimulusId: "stim-c-o1",
    stem: "Wind power and local residents: put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "Inhabitants of coastal regions housing large-scale facilities have reported that the low hum of the constant rotation impairs their sleep quality." },
      { id: "b", text: "Nevertheless, the argument for transitioning is not entirely convincing when the implications for residents in the immediate vicinity are taken into account." },
      { id: "c", text: "With the infrastructure in place, operational expenditures of wind mills are substantially lower than those of coal or gas facilities." },
      { id: "d", text: "Wind power has been promoted as a notably clean and economically viable substitute for fossil fuels." },
      { id: "e", text: "Progress on a country’s renewable targets necessitates balancing each proposed initiative against the burdens imposed upon local populations." },
    ],
    correctAnswer: "d,c,b,a,e",
    explanation: "Câu d mở đầu bằng việc điện gió được quảng bá là sạch và kinh tế. Câu c bổ sung lợi thế chi phí. Câu b mở đầu bằng Nevertheless để chuyển sang phản biện. Câu a đưa bằng chứng cư dân bị ảnh hưởng. Câu e kết luận cần cân bằng giữa mục tiêu và gánh nặng của dân địa phương.",
  }),
  order({
    id: "pc-2",
    stimulusId: "stim-c-o2",
    stem: "A long wait at the restaurant: put the utterances in the order of the conversation.",
    sentences: [
      { id: "a", text: "Diner: Excuse me, I’ve been waiting so long for my order." },
      { id: "b", text: "Diner: Thanks for your help." },
      { id: "c", text: "Waiter: I’m sorry! I’ll check with the kitchen and get back to you immediately." },
    ],
    correctAnswer: "a,c,b",
    explanation: "Khách phàn nàn trước (a), nhân viên xin lỗi và hứa kiểm tra (c), cuối cùng khách cảm ơn (b). Lời cảm ơn chỉ hợp lý sau khi đã có lời đáp của nhân viên.",
  }),
  order({
    id: "pc-3",
    stimulusId: "stim-c-o3",
    stem: "Young Researcher Grant letter (starts with “Dear Ms Hoang,” and ends with “Yours sincerely,”): put the sentences in a logical order.",
    sentences: [
      { id: "a", text: "A payment of $5,000 will be released in the beginning, and the remaining balance after the submission of your mid-term report." },
      { id: "b", text: "Failure to respond by the stated date will result in the offer being granted to the next qualified candidate." },
      { id: "c", text: "We are delighted to inform you that you have been awarded the Young Researcher Grant." },
      { id: "d", text: "To confirm your acceptance, please sign the attached form and submit it by 31 August." },
      { id: "e", text: "The funding is intended to support your fieldwork and must not be used for equipment purchases without prior approval." },
    ],
    correctAnswer: "c,e,a,d,b",
    explanation: "Thư mở bằng thông báo trao học bổng (c), nêu mục đích sử dụng kinh phí (e), cách chi trả (a), yêu cầu xác nhận trước ngày 31/8 (d), rồi hậu quả nếu không phản hồi đúng hạn (b). Câu b nhắc đến stated date nên phải đứng sau câu d.",
  }),
  order({
    id: "pc-4",
    stimulusId: "stim-c-o4",
    stem: "Exchanging an electric fan: put the utterances in the order of the conversation.",
    sentences: [
      { id: "a", text: "Customer: What if I don’t keep the original packaging?" },
      { id: "b", text: "Customer: Great. I’ll bring the item and receipt tomorrow." },
      { id: "c", text: "Customer: I’d like to exchange the electric fan I bought yesterday." },
      { id: "d", text: "Manager: Sold items can be exchanged within five days, but we don’t give refunds." },
      { id: "e", text: "Manager: No problem, only your receipt is needed." },
    ],
    correctAnswer: "c,d,a,e,b",
    explanation: "Khách nêu yêu cầu đổi quạt (c), quản lý nói quy định đổi trong năm ngày và không hoàn tiền (d), khách hỏi về bao bì (a), quản lý trả lời chỉ cần hoá đơn (e), khách chốt sẽ mang đồ và hoá đơn ngày mai (b).",
  }),
  order({
    id: "pc-5",
    stimulusId: "stim-c-o5",
    stem: "Fibre broadband for rural villages: put the sentences in the correct order.",
    sentences: [
      { id: "a", text: "Initial results were impressive, as villagers reported broadband speeds comparable to city standards with significantly improved reliability." },
      { id: "b", text: "For years, the isolated villages of central Marsh County struggled with unreliable copper cables that could not handle increasing bandwidth demands." },
      { id: "c", text: "Consequently, the local council, partnering with two providers, committed to laying fibre optic cables to every household within a year." },
      { id: "d", text: "To minimise disruption, cables were placed along existing verges, while community halls served as temporary installation hubs." },
      { id: "e", text: "Encouraged by the villagers’ satisfaction, neighbouring counties have requested guidance on adopting the model for their remote villages." },
    ],
    correctAnswer: "b,c,d,a,e",
    explanation: "Câu b nêu vấn đề cáp đồng kém. Câu c với Consequently là quyết định lắp cáp quang. Câu d nói cách thi công, câu a nêu kết quả ban đầu, và câu e nêu hệ quả cuối cùng là các hạt lân cận xin hướng dẫn.",
  }),
];

const wealthQuestions: PaperQuestion[] = [
  choice("gap_long", "stim-c-wealth", {
    id: "pc-6",
    difficulty: "hard",
    stem: "Wealth is what you do not see (6)",
    choices: {
      a: "you might assume that the owner of the car must be rich",
      b: "you might be assumed to be the rich owner of the car",
      c: "people might assume you must be the rich owner of the car",
      d: "the car might be assumed to be owned by a rich person",
    },
    answer: "a",
    explanation: "On spotting a Ferrari là mệnh đề rút gọn, nên chủ ngữ của mệnh đề chính phải là người nhìn thấy xe. Chỉ you might assume … đúng chủ ngữ và đúng nghĩa: bạn nhìn thấy xe và cho rằng chủ xe giàu.",
    whyWrong: {
      b: "Chủ ngữ you ở đây bị người khác suy đoán là chủ xe, trong khi người đang nhìn thấy xe mới là người đưa ra suy đoán.",
      c: "Chủ ngữ people không phải người thực hiện hành động spotting, và nghĩa bị lệch: câu nói về người nhìn thấy xe chứ không phải bạn là chủ xe.",
      d: "Chủ ngữ the car không thể tự spot một chiếc xe, nên mệnh đề rút gọn bị sai chủ ngữ.",
    },
  }),
  choice("gap_long", "stim-c-wealth", {
    id: "pc-7",
    difficulty: "medium",
    stem: "Wealth is what you do not see (7)",
    choices: {
      a: "What you know is about them all",
      b: "You know what they are all about",
      c: "All that you know is about them",
      d: "That is all you know about them",
    },
    answer: "d",
    explanation: "Câu chốt lại ý trước đó: dữ kiện chắc chắn duy nhất về tài sản của họ chỉ là số tiền đã chi hoặc đã nợ. That is all you know about them nghĩa là chỉ biết được có vậy.",
    whyWrong: {
      a: "What you know is about them all nghĩa là điều bạn biết nói về tất cả bọn họ, không khớp với ý chỉ biết một dữ kiện về một người.",
      b: "You know what they are all about nghĩa là bạn hiểu hết con người họ, trái với ý bạn gần như không biết gì về tài sản của họ.",
      c: "All that you know is about them đúng ngữ pháp nhưng không chốt được ý đó là toàn bộ điều bạn biết như That is all you know about them.",
    },
  }),
  choice("gap_long", "stim-c-wealth", {
    id: "pc-8",
    difficulty: "medium",
    stem: "Wealth is what you do not see (8)",
    choices: {
      a: "unless we only have external clues as the information to work with",
      b: "because external clues are the only information we have to work with",
      c: "other than external clues as the information that we only have to work with",
      d: "rather than by external clues as the only information we have to work with",
    },
    answer: "b",
    explanation: "Câu sau nói chúng ta không thể nhìn vào tài khoản người khác nên phải dựa vào vẻ bề ngoài. Vậy mệnh đề cần nêu lý do chúng ta đánh giá sự giàu có qua điều nhìn thấy: because external clues are the only information we have.",
    whyWrong: {
      a: "Unless nghĩa là trừ khi, tạo ra điều kiện sai: chúng ta dựa vào dấu hiệu bên ngoài vì chỉ có chúng, không phải trừ khi chỉ có chúng.",
      c: "Cấu trúc other than … as the information that we only have rối và không tạo thành mệnh đề có nghĩa nối với phần trước.",
      d: "Rather than by external clues phủ định việc dùng dấu hiệu bên ngoài, trái với ý cả đoạn: ta chỉ có thể dựa vào chúng.",
    },
  }),
  choice("gap_long", "stim-c-wealth", {
    id: "pc-9",
    difficulty: "hard",
    stem: "Wealth is what you do not see (9)",
    choices: {
      a: "However, the truth remains that authentic wealth keeps its existence a secret",
      b: "Authentic wealth, similarly, keeps its existence by secretly remaining truthful",
      c: "Authentic wealth, as a consequence, secretly exists by remaining truthful",
      d: "Likewise, the truth is that the existence of authentic wealth remains a secret",
    },
    answer: "a",
    explanation: "Câu trước nói chủ nghĩa tư bản biến việc giúp người ta giả vờ giàu thành một ngành, câu sau nói của cải thật thì ẩn đi. Hai ý đối lập nên cần However. Authentic wealth keeps its existence a secret cũng đúng cấu trúc.",
    whyWrong: {
      b: "Keeps its existence by secretly remaining truthful không có nghĩa rõ ràng, và similarly sai quan hệ vì hai ý đối lập.",
      c: "As a consequence sai quan hệ nhân quả, và secretly exists by remaining truthful vô nghĩa.",
      d: "Likewise nghĩa là tương tự, trong khi câu này phải đối lập với việc phô trương sự giàu có ở câu trước.",
    },
  }),
  choice("gap_long", "stim-c-wealth", {
    id: "pc-10",
    difficulty: "medium",
    stem: "Wealth is what you do not see (10)",
    choices: {
      a: "for being wealthy to be distinguished from being rich",
      b: "to distinguish between being wealthy and being rich",
      c: "being wealthy is distinguishing itself from being rich",
      d: "being wealthy and being rich distinguish themselves",
    },
    answer: "b",
    explanation: "Sau be careful cần to-V: we should be careful to distinguish between … Câu sau còn nhắc not knowing the difference, khớp với việc phân biệt hai khái niệm wealthy và rich.",
    whyWrong: {
      a: "Cấu trúc be careful for … to be distinguished sai: sau careful không dùng for + người/vật + to be V3 như vậy.",
      c: "Sau careful không đi với một mệnh đề đầy đủ kiểu being wealthy is distinguishing itself, và nghĩa vô lý.",
      d: "Hai khái niệm không tự phân biệt chính mình; câu sai cấu trúc và sai nghĩa.",
    },
  }),
];

const environmentQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-c-env", {
    id: "pc-11",
    difficulty: "easy",
    stem: "The word relinquished in paragraph 1 is closest in meaning to ______.",
    choices: { a: "made up", b: "given up", c: "filled up", d: "ended up" },
    answer: "b",
    explanation: "Net gain relinquished là phần lợi ích ròng phải từ bỏ vì tài nguyên không còn dùng cho phương án tốt thứ hai. Relinquished nghĩa là từ bỏ, gần với given up.",
    translationVi: "Từ \"relinquished\" trong đoạn 1 có nghĩa gần nhất với \"given up\" (từ bỏ).",
    whyWrong: {
      a: "Made up nghĩa là bịa ra hoặc bù đắp, không hợp nghĩa từ bỏ.",
      c: "Filled up nghĩa là làm đầy.",
      d: "Ended up nghĩa là rốt cuộc rơi vào tình huống nào đó.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-12",
    difficulty: "medium",
    stem: "According to paragraph 1, the costs of environmental services are ______.",
    choices: {
      a: "minimal because these services are nearly labour-free",
      b: "existent even in the absence of human involvement",
      c: "determined by financial investment in natural resources",
      d: "included in the market value of natural resources",
    },
    answer: "b",
    explanation: "Đoạn 1 mở đầu bằng: dịch vụ môi trường, kể cả khi phát sinh mà không cần lao động con người, vẫn không hề miễn phí. Tức là chi phí vẫn tồn tại.",
    translationVi: "Theo đoạn 1, chi phí của các dịch vụ môi trường vẫn tồn tại ngay cả khi không có sự tham gia của con người.",
    whyWrong: {
      a: "Đoạn nói chi phí không hề thấp hay bằng không chỉ vì không cần lao động, trái với lựa chọn này.",
      c: "Bài định nghĩa chi phí là chi phí cơ hội, không phải do vốn đầu tư vào tài nguyên quyết định.",
      d: "Bài không nói chi phí đã nằm trong giá trị thị trường của tài nguyên.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-13",
    difficulty: "hard",
    stem: "Which of the following is NOT implied in paragraph 2?",
    choices: {
      a: "The intrinsic value of the river is not confined to generating hydroelectricity only.",
      b: "Intangible benefits also constitute the opportunity cost of the dam construction.",
      c: "It is impossible to exploit one stretch of river for both hydroelectric generation and white-water canoeing.",
      d: "The strains on the ecosystem of the river imposed by recreational activities and power generation are similar.",
    },
    answer: "d",
    explanation: "Đoạn 2 không so sánh mức áp lực lên hệ sinh thái của giải trí và phát điện, nên không thể suy ra chúng tương tự nhau. Ba ý còn lại đều được đoạn ngụ ý.",
    whyWrong: {
      a: "Có ngụ ý: giá trị của sông còn gồm giải trí, động vật hoang dã, cảnh đẹp, không chỉ là điện.",
      b: "Có ngụ ý: chi phí cơ hội của đập gồm cả cảnh đẹp và giá trị với thế hệ sau, là các lợi ích vô hình.",
      c: "Có ngụ ý: đập làm ngập thác nên không thể vừa chèo thuyền vừa phát điện trên cùng đoạn sông.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-14",
    difficulty: "hard",
    stem: "Where in paragraph 3 does the following sentence best fit? “Such hidden costs only come to light when one stops to think about the roles nature itself is quietly playing.”",
    choices: { a: "[IV]", b: "[III]", c: "[II]", d: "[I]" },
    answer: "c",
    explanation: "Such hidden costs phải nói về chi phí ẩn đã được nhắc ngay trước đó: câu [I] nói nhiều quyết định tưởng miễn phí hoá ra phải trả giá. Đặt câu mới ở vị trí [II], tức sau câu đó và trước các ví dụ cụ thể, thì Such hidden costs có chỗ quy chiếu rõ.",
    whyWrong: {
      a: "Ở [IV], câu mới đứng sau gần hết các ví dụ nên tách khỏi câu đầu nêu ý chi phí ẩn; câu này cần đứng trước để dẫn vào các ví dụ.",
      b: "Ở [III], câu mới đứng sau ví dụ về rừng nên Such hidden costs chỉ còn quy chiếu cho riêng ví dụ đó, trong khi câu cần khái quát cho các quyết định tưởng miễn phí ở câu đầu và đứng trước các ví dụ.",
      d: "Ở [I], câu mới đứng ngay đầu đoạn khi chưa có chi phí ẩn nào được nhắc, nên Such hidden costs không có gì để quy chiếu.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-15",
    difficulty: "medium",
    stem: "Which of the following best summarises paragraph 3?",
    choices: {
      a: "Ecological preservation exerts negligible influence on economic development.",
      b: "Economic benefits should never take precedence over forest and river preservation.",
      c: "Untouched and cultivated lands both produce benefits in the long term.",
      d: "Apparently harmless developments actually come at an underlying price.",
    },
    answer: "d",
    explanation: "Đoạn 3 lần lượt nêu các ví dụ (phá rừng, dẫn nước sông, để đất nguyên trạng) để cho thấy những quyết định tưởng miễn phí thật ra đều có cái giá phải trả.",
    whyWrong: {
      a: "Đoạn không nói bảo tồn có ảnh hưởng không đáng kể, mà nói mọi lựa chọn đều có chi phí.",
      b: "Câu never take precedence quá tuyệt đối, đoạn không đưa ra kết luận như vậy.",
      c: "Đoạn nói về chi phí của từng lựa chọn, không nói đất nguyên trạng và đất canh tác đều sinh lợi lâu dài.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-16",
    difficulty: "easy",
    stem: "The word they in paragraph 4 refers to ______.",
    choices: { a: "sacrifices", b: "sides", c: "services", d: "policies" },
    answer: "d",
    explanation: "Câu What they demand is that development should be worth its true cost đứng ngay sau câu nói về Policies. Chính các chính sách này đòi hỏi phát triển phải xứng với chi phí thật.",
    translationVi: "Từ \"they\" trong đoạn 4 chỉ các chính sách (policies).",
    whyWrong: {
      a: "Sacrifices là thứ được đem so với lợi ích, không phải chủ thể đưa ra yêu cầu.",
      b: "Sides là hai phía cần cân nhắc, không phải chủ thể đòi hỏi.",
      c: "Services chỉ là đối tượng được định giá trong chính sách, không phải chủ ngữ của demand.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-17",
    difficulty: "hard",
    stem: "What conclusion can be drawn from paragraph 4?",
    choices: {
      a: "Both excessive caution and complete ignorance regarding environmental costs cause permanent damage.",
      b: "Due consideration for opportunity costs is crucial for the genuine success of development.",
      c: "Initiatives are required by law to deduct the hidden costs before claiming to have a positive return.",
      d: "Putting a price on environmental services is aimed at slowing down economic projects.",
    },
    answer: "b",
    explanation: "Đoạn 4 nói phải hỏi liệu lợi ích có vượt giá trị của những hy sinh không, và phát triển phải xứng với chi phí thật. Kết luận là cân nhắc đúng mức chi phí cơ hội là then chốt cho thành công thật của phát triển.",
    whyWrong: {
      a: "Đoạn chỉ cảnh báo nguy cơ đếm quá ít, không nói thận trọng quá mức hay thờ ơ đều gây thiệt hại vĩnh viễn.",
      c: "Đoạn không nhắc đến yêu cầu của pháp luật.",
      d: "Đoạn nói rõ các chính sách này không chống lại phát triển.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-18",
    difficulty: "medium",
    stem: "Which of the following is true according to the passage?",
    choices: {
      a: "The positive return of every economic development must be worth what is sacrificed.",
      b: "Cost-free resources can be put to alternative uses as long as this is legally permitted.",
      c: "Assigning a specific price tag to a resource is a prerequisite for calculating opportunity costs.",
      d: "Keeping land intact is free of opportunity cost as there is no resource consumption.",
    },
    answer: "a",
    explanation: "Đoạn 4 nói phải xét liệu lợi ích có vượt giá trị của những hy sinh không và phát triển phải xứng với chi phí thật, khớp với lựa chọn A.",
    whyWrong: {
      b: "Bài nói tài nguyên có công dụng thay thế thì không được coi là miễn phí, và không nhắc đến điều kiện hợp pháp.",
      c: "Bài không nói phải gán giá cho tài nguyên trước khi tính chi phí cơ hội.",
      d: "Đoạn 3 nói để đất nguyên trạng cũng phải trả giá vì mất khoản thu từ khai thác.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-19",
    difficulty: "hard",
    stem: "Which of the following can be inferred from the passage?",
    choices: {
      a: "The scale of economic development inevitably suffers from strict regulations on environmental services.",
      b: "The value of preserved environmental services far outweighs the benefits of industrial development.",
      c: "Projects are mandated to make up for the economic losses in return for environmental preservation.",
      d: "Decisions that overlook environmental opportunity costs risk overestimating the net gains they produce.",
    },
    answer: "d",
    explanation: "Nếu không tính chi phí cơ hội của dịch vụ môi trường thì lợi ích ròng bị tính cao hơn thực tế. Điều này suy ra từ lập luận cả bài và câu cuối: nguy hiểm là đếm quá ít.",
    whyWrong: {
      a: "Bài nói các chính sách này không chống phát triển, nên không suy ra quy mô phát triển chắc chắn bị thu hẹp.",
      b: "Bài không so sánh để kết luận giá trị bảo tồn vượt xa lợi ích công nghiệp.",
      c: "Bài không nói dự án bị bắt buộc bù đắp tổn thất kinh tế.",
    },
  }),
  choice("single_choice", "stim-c-env", {
    id: "pc-20",
    difficulty: "easy",
    stem: "Which of the following would be the best title for the passage?",
    choices: {
      a: "Development: Factoring in Sacrifices",
      b: "Natural Preservation: Ushering in a New Era",
      c: "Sustainable Development: A Pipe Dream",
      d: "Environment: A Tower of Strength",
    },
    answer: "a",
    explanation: "Cả bài nói rằng khi đánh giá phát triển phải tính cả những thứ bị hy sinh, tức chi phí cơ hội. Tiêu đề A tóm đúng ý này.",
    whyWrong: {
      b: "Bài không bàn về việc mở ra một kỷ nguyên mới của bảo tồn.",
      c: "Bài không cho rằng phát triển bền vững là viển vông.",
      d: "Bài không nói môi trường là chỗ dựa vững chắc, tiêu đề này lạc đề.",
    },
  }),
];

const laptopQuestions: PaperQuestion[] = [
  choice("single_choice", "stim-c-laptop", {
    id: "pc-21",
    difficulty: "medium",
    stem: "In paragraph 1, the writer is ______.",
    choices: {
      a: "questioning the real worth of costly laptops",
      b: "arguing in favour of undergraduates’ use of laptops",
      c: "contrasting different methods of notetaking",
      d: "warning against a common habit among students",
    },
    answer: "d",
    explanation: "Đoạn 1 nói mở laptop đầu giờ đã thành phản xạ, và sự tiện lợi này có cái giá mà đa số sinh viên không nhận ra. Đó là lời cảnh báo về một thói quen phổ biến.",
    translationVi: "Trong đoạn 1, người viết đang cảnh báo về một thói quen phổ biến ở sinh viên.",
    whyWrong: {
      a: "Đoạn không bàn về giá trị thật của những chiếc laptop đắt tiền.",
      b: "Đoạn nêu mặt trái của việc dùng laptop, trái với việc ủng hộ.",
      c: "Việc so sánh các cách ghi chép chỉ xuất hiện ở đoạn 3, không phải đoạn 1.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-22",
    difficulty: "easy",
    stem: "The word tracked in paragraph 2 is closest in meaning to ______.",
    choices: { a: "controlled", b: "represented", c: "examined", d: "copied" },
    answer: "c",
    explanation: "A study tracked the in-class behaviour nghĩa là nghiên cứu theo dõi, xem xét hành vi trong lớp. Examined gần nghĩa nhất.",
    translationVi: "Từ \"tracked\" trong đoạn 2 có nghĩa gần nhất với \"examined\" (theo dõi, xem xét).",
    whyWrong: {
      a: "Controlled là kiểm soát, nghiên cứu chỉ quan sát chứ không kiểm soát hành vi.",
      b: "Represented là đại diện, không hợp nghĩa.",
      d: "Copied là sao chép, không hợp nghĩa.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-23",
    difficulty: "medium",
    stem: "The word astounded in paragraph 2 is OPPOSITE in meaning to ______.",
    choices: { a: "brave", b: "honest", c: "calm", d: "anxious" },
    answer: "c",
    explanation: "Astounded nghĩa là vô cùng sửng sốt. Trái nghĩa là calm, tức bình tĩnh, không bị bất ngờ.",
    translationVi: "Từ \"astounded\" trong đoạn 2 trái nghĩa với \"calm\" (bình tĩnh).",
    whyWrong: {
      a: "Brave là dũng cảm, không đối lập với sửng sốt.",
      b: "Honest là trung thực, không liên quan.",
      d: "Anxious là lo lắng, cũng là cảm xúc mạnh, không trái nghĩa với sửng sốt.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-24",
    difficulty: "easy",
    stem: "The word those in paragraph 3 refers to ______.",
    choices: { a: "students", b: "scientists", c: "lectures", d: "tests" },
    answer: "a",
    explanation: "Cụm laptop-using students recalling roughly a third less than those taking handwritten notes so sánh hai nhóm sinh viên, nên those thay cho students.",
    translationVi: "Từ \"those\" trong đoạn 3 chỉ các sinh viên (students).",
    whyWrong: {
      b: "Scientists là người mô tả hiện tượng ảo tưởng năng lực, không phải nhóm ghi chép tay.",
      c: "Lectures là bài giảng, không thể taking handwritten notes.",
      d: "Tests là bài kiểm tra, không thể ghi chép tay.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-25",
    difficulty: "hard",
    stem: "Which of the following best paraphrases the sentence “Things go from bad to worse when we take into account the fact that the very tools that distract students are also genuinely essential for some forms of academic work.” in paragraph 4?",
    choices: {
      a: "It is the digital devices used for certain complicated academic tasks at university that are distracting students from more important assignments.",
      b: "Some academic work at university requires students’ genuine concentration, which has become a complicated matter with bad-quality digital tools.",
      c: "Not only certain academic assignments at university but also the digital tools useful for these tasks are causing complicated problems for students.",
      d: "What complicates matters is that digital devices necessary for completing some university work can interfere with students’ concentration.",
    },
    answer: "d",
    explanation: "Câu gốc nói tình hình tệ hơn vì chính công cụ gây xao nhãng lại thiết yếu cho một số công việc học tập. Lựa chọn D diễn đạt đúng: điều làm vấn đề rắc rối là thiết bị cần cho bài vở lại có thể làm sinh viên mất tập trung.",
    whyWrong: {
      a: "Sai nghĩa: câu gốc không nói thiết bị làm sinh viên xao nhãng khỏi các bài tập quan trọng hơn.",
      b: "Câu gốc không nhắc đến công cụ số chất lượng kém.",
      c: "Sai nghĩa: câu gốc không nói bài tập gây ra vấn đề, mà nói công cụ vừa gây xao nhãng vừa cần thiết.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-26",
    difficulty: "hard",
    stem: "Which of the following statements would the writer NOT agree with?",
    choices: {
      a: "Those switching between tasks on digital devices are aware of its adverse impacts on productivity.",
      b: "University students’ use of laptops in classrooms has become a practice performed unconsciously.",
      c: "Students have become more isolated in lecture halls because of the widespread use of laptops.",
      d: "Providing students with guidance for proper use of laptops is better than imposing a blanket ban.",
    },
    answer: "a",
    explanation: "Đoạn 3 nói đa nhiệm kỹ thuật số vô hình đối với người đang làm, nên tác giả không đồng ý rằng họ nhận thức được tác hại. Các ý còn lại đều phù hợp với bài.",
    whyWrong: {
      b: "Tác giả đồng ý: đoạn 1 nói mở laptop đã tự động như việc ngồi xuống.",
      c: "Tác giả đồng ý: câu cuối nói giảng đường trở thành nơi của những màn hình đơn độc.",
      d: "Tác giả đồng ý: bài đề xuất dạy sinh viên khi nào và cách đặt thiết bị xuống thay vì loại bỏ hoàn toàn.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-27",
    difficulty: "medium",
    stem: "In which paragraph does the writer mention a mismatch between self-report and scientific findings?",
    choices: { a: "Paragraph 1", b: "Paragraph 3", c: "Paragraph 2", d: "Paragraph 4" },
    answer: "c",
    explanation: "Đoạn 2 nói sinh viên khẳng định mình tập trung hoàn toàn nhưng dữ liệu theo dõi mắt cho thấy họ chuyển tab khoảng mười bốn lần mỗi buổi. Đó chính là sự lệch giữa lời tự báo cáo và kết quả khoa học.",
    whyWrong: {
      a: "Đoạn 1 mô tả thói quen và lời cảnh báo chung, chưa nêu dữ liệu để đối chiếu.",
      b: "Đoạn 3 nói về ảo tưởng năng lực và kết quả bài kiểm tra, không đối chiếu lời tự báo cáo với dữ liệu.",
      d: "Đoạn 4 nói về công cụ vừa gây xao nhãng vừa cần thiết, không có sự đối chiếu này.",
    },
  }),
  choice("single_choice", "stim-c-laptop", {
    id: "pc-28",
    difficulty: "medium",
    stem: "In which paragraph does the writer provide examples for a general term?",
    choices: { a: "Paragraph 2", b: "Paragraph 1", c: "Paragraph 3", d: "Paragraph 4" },
    answer: "d",
    explanation: "Đoạn 4 liệt kê annotating digital texts, accessing research databases và recording lectures làm ví dụ cho khái niệm chung screen-based learning.",
    whyWrong: {
      a: "Đoạn 2 trình bày số liệu nghiên cứu, không đưa ví dụ minh hoạ cho một thuật ngữ chung.",
      b: "Đoạn 1 mô tả thói quen và đưa ra cảnh báo, không có ví dụ cho một thuật ngữ.",
      c: "Đoạn 3 nêu và giải thích thuật ngữ illusion of competence, không liệt kê ví dụ cho một thuật ngữ chung.",
    },
  }),
];

const flyerQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-c-flyer", {
    id: "pc-29",
    difficulty: "medium",
    stem: "Let’s warm their hearts (29)",
    choices: { a: "fill", b: "catch", c: "sort", d: "turn" },
    answer: "c",
    explanation: "Sort out … by size nghĩa là phân loại quần áo theo cỡ. Cụm sort out hợp với câu và với việc cần tổ chức quyên góp nhanh hơn.",
    whyWrong: {
      a: "Fill out dùng cho điền biểu mẫu, không dùng cho quần áo.",
      b: "Catch out là bắt lỗi hoặc vạch trần ai đó.",
      d: "Turn out nghĩa là hoá ra hoặc dốc ra, không hợp với việc phân loại theo cỡ.",
    },
  }),
  choice("gap_short", "stim-c-flyer", {
    id: "pc-30",
    difficulty: "easy",
    stem: "Let’s warm their hearts (30)",
    choices: { a: "condition", b: "relation", c: "situation", d: "position" },
    answer: "a",
    explanation: "In good condition là cụm cố định, nghĩa là còn tình trạng tốt, hợp với yêu cầu quần áo khô và còn dùng được.",
    whyWrong: {
      b: "Relation chỉ mối quan hệ, không đi với in good.",
      c: "Situation chỉ hoàn cảnh, không dùng cho tình trạng đồ vật.",
      d: "Position chỉ vị trí hoặc tư thế, không dùng cho tình trạng đồ vật.",
    },
  }),
  choice("gap_short", "stim-c-flyer", {
    id: "pc-31",
    difficulty: "medium",
    stem: "Let’s warm their hearts (31)",
    choices: { a: "washing", b: "wash", c: "being washed", d: "washed" },
    answer: "d",
    explanation: "Cấu trúc nhờ vả bị động: have + vật + V3. We will have all donations washed nghĩa là chúng tôi sẽ cho giặt tất cả quần áo quyên góp.",
    whyWrong: {
      a: "Have + vật + V-ing không phải cấu trúc nhờ vả bị động ở đây.",
      b: "Have + vật + động từ nguyên mẫu chỉ dùng khi vật là người thực hiện hành động.",
      c: "Being washed không đi sau have trong cấu trúc này.",
    },
  }),
  choice("gap_short", "stim-c-flyer", {
    id: "pc-32",
    difficulty: "easy",
    stem: "Let’s warm their hearts (32)",
    choices: { a: "protect", b: "provide", c: "promote", d: "produce" },
    answer: "a",
    explanation: "Chất tẩy rửa thân thiện với môi trường được dùng để bảo vệ làn da nhạy cảm của trẻ, nên protect là hợp nhất.",
    whyWrong: {
      b: "Provide nghĩa là cung cấp, không hợp nghĩa khi đứng trước the sensitive skin.",
      c: "Promote là thúc đẩy hoặc quảng bá, không hợp nghĩa.",
      d: "Produce là tạo ra, không hợp nghĩa.",
    },
  }),
  choice("gap_short", "stim-c-flyer", {
    id: "pc-33",
    difficulty: "easy",
    stem: "Let’s warm their hearts (33)",
    choices: { a: "cooperative", b: "cooperatively", c: "cooperation", d: "cooperate" },
    answer: "d",
    explanation: "Sau chủ ngữ We và trước with cần một động từ chia hiện tại: We cooperate with local schools.",
    whyWrong: {
      a: "Cooperative là tính từ, không làm vị ngữ ở đây.",
      b: "Cooperatively là trạng từ, không làm vị ngữ.",
      c: "Cooperation là danh từ, không làm vị ngữ.",
    },
  }),
  choice("gap_short", "stim-c-flyer", {
    id: "pc-34",
    difficulty: "medium",
    stem: "Let’s warm their hearts (34)",
    choices: { a: "give", b: "gave", c: "gives", d: "have given" },
    answer: "c",
    explanation: "Đây là câu điều kiện loại 1: If + hiện tại đơn, will + V. Everyone là chủ ngữ số ít nên động từ là gives: If everyone gives a hand.",
    whyWrong: {
      a: "Give không chia đúng với chủ ngữ số ít everyone.",
      b: "Gave là quá khứ, thuộc câu điều kiện loại 2, không khớp với vế sau dùng will help.",
      d: "Have given không chia đúng với everyone và không phù hợp với câu điều kiện loại 1.",
    },
  }),
];

const leafletQuestions: PaperQuestion[] = [
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-35",
    difficulty: "easy",
    stem: "Green hands, clean land (35)",
    choices: { a: "intention", b: "influence", c: "emphasis", d: "example" },
    answer: "c",
    explanation: "Put emphasis on là cụm cố định nghĩa là nhấn mạnh vào. Chủ đề của tuần lễ nhấn mạnh vai trò của cộng đồng.",
    whyWrong: {
      a: "Put intention on không phải cụm cố định.",
      b: "Người ta nói have influence on, không nói put influence on.",
      d: "Cụm đúng là set an example, không đi với put … on.",
    },
  }),
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-36",
    difficulty: "medium",
    stem: "Green hands, clean land (36)",
    choices: { a: "Finally", b: "Instead", c: "However", d: "Therefore" },
    answer: "d",
    explanation: "Câu trước nói biến đổi khí hậu đã tác động trực tiếp đến đời sống, câu sau nêu hệ quả nếu không hành động. Quan hệ kết quả nên dùng Therefore.",
    whyWrong: {
      a: "Finally dùng để chốt một chuỗi các ý, ở đây không có chuỗi liệt kê.",
      b: "Instead mang nghĩa thay vào đó, tạo quan hệ thay thế không có trong ngữ cảnh.",
      c: "However tạo quan hệ tương phản, nhưng hai câu này không đối lập mà là nguyên nhân và hệ quả.",
    },
  }),
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-37",
    difficulty: "hard",
    stem: "Green hands, clean land (37)",
    choices: { a: "roses", b: "sky", c: "goods", d: "gold" },
    answer: "a",
    explanation: "Come up roses là thành ngữ nghĩa là diễn ra rất tốt đẹp, phù hợp với việc các chiến dịch hằng năm thành công từ năm 2018.",
    whyWrong: {
      b: "Không có thành ngữ coming up sky.",
      c: "Goods nằm trong deliver the goods, không đi với come up.",
      d: "Gold nằm trong go for gold hoặc strike gold, không phải come up gold.",
    },
  }),
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-38",
    difficulty: "medium",
    stem: "Green hands, clean land (38)",
    choices: { a: "either", b: "neither", c: "other", d: "both" },
    answer: "a",
    explanation: "Có hai hoạt động (dọn dẹp và trồng cây) và mọi cư dân đều được tham gia một trong hai. Either activity đi với danh từ số ít và hợp nghĩa.",
    whyWrong: {
      b: "Neither mang nghĩa phủ định, trái với ý hoạt động mở cho mọi người.",
      c: "Other activity thiếu mạo từ và không chỉ rõ hai hoạt động đã nêu.",
      d: "Both phải đi với danh từ số nhiều (both activities), mà ở đây activity là số ít.",
    },
  }),
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-39",
    difficulty: "easy",
    stem: "Green hands, clean land (39)",
    choices: { a: "should", b: "should not", c: "ought", d: "ought not" },
    answer: "a",
    explanation: "Đơn đã điền phải được nộp trước ngày 30/6, đây là yêu cầu hoặc lời khuyên nên dùng should be submitted.",
    whyWrong: {
      b: "Should not be submitted by nghĩa là không nên nộp trước ngày đó, trái với ý thông báo.",
      c: "Ought phải đi với to, nên Ought be submitted sai ngữ pháp.",
      d: "Ought not cũng thiếu to và mang nghĩa phủ định.",
    },
  }),
  choice("gap_short", "stim-c-leaflet", {
    id: "pc-40",
    difficulty: "medium",
    stem: "Green hands, clean land (40)",
    choices: { a: "greener", b: "greenest", c: "the greenest", d: "the greener" },
    answer: "d",
    explanation: "Đây là so sánh kép: The + so sánh hơn, the + so sánh hơn. The harder we try, the greener our future will be.",
    whyWrong: {
      a: "Greener thiếu mạo từ the nên không tạo được cấu trúc so sánh kép.",
      b: "Greenest là so sánh nhất, không dùng trong cấu trúc này.",
      c: "The greenest là so sánh nhất, không dùng trong cấu trúc so sánh kép.",
    },
  }),
];

export const paperCQuestions: PaperQuestion[] = [
  ...orderingQuestions,
  ...wealthQuestions,
  ...environmentQuestions,
  ...laptopQuestions,
  ...flyerQuestions,
  ...leafletQuestions,
];

export const paperCExam = {
  id: "exam-2026-1116",
  yearLabel: "2026-1116",
  version: "official-1116",
  status: "provisional",
  source: "Đề thi chính thức TN THPT 2026 của Bộ Giáo dục và Đào tạo",
  questionCount: 40,
  durationMinutes: 50,
  sections: [
    { questionType: "gap_short", label: "Điền từ hoặc cụm ngắn", count: 12 },
    { questionType: "ordering", label: "Sắp xếp câu", count: 5 },
    { questionType: "gap_long", label: "Điền câu hoặc cụm dài", count: 5 },
    { questionType: "reading", label: "Đọc hiểu", count: 18 },
  ],
  notes:
    "Đề thi chính thức môn Tiếng Anh kỳ thi tốt nghiệp THPT năm 2026, mã đề 1116, của Bộ Giáo dục và Đào tạo, giữ nguyên thứ tự câu của đề thật. Đáp án dựa trên bản đáp án tham khảo của bên thứ ba (không phải đáp án chính thức của Bộ), lời giải do app soạn. Điểm trên thang 10 chỉ để tự đánh giá trong app.",
  questionIds: paperCQuestions.map((question) => question.id),
};
