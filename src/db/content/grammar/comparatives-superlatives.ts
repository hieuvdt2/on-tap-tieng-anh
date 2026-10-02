import { mcq } from "../helpers";
import type { TopicSeed } from "../types";

export const comparativesSuperlatives: TopicSeed = {
  id: "topic-comparatives-superlatives",
  slug: "comparatives-superlatives",
  name: "Comparatives and Superlatives",
  gradeFrom: 7,
  gradeTo: 12,
  summary: "So sánh hơn và so sánh nhất để đối chiếu tính chất giữa người hoặc vật.",
  purpose:
    "So sánh hơn nói A hơn B, tức chỉ có hai đối tượng. So sánh nhất nói A đứng đầu trong một nhóm từ ba trở lên.",
  usage: [
    "Mẹo: nhìn chữ đi kèm để biết loại so sánh.",
    "than: so sánh hơn.",
    "in the class, of all, of the three, ever: so sánh nhất.",
    "as ... as: so sánh ngang bằng.",
  ].join("\n"),
  structure: [
    "Tính từ ngắn: một âm tiết, thêm -er hoặc -est.",
    "- tall: taller than.",
    "- cheap: the tallest.",
    "Tận cùng -y: đổi y thành i, rồi thêm -er hoặc -est.",
    "- happy: happier, the happiest.",
    "Tính từ dài: hai âm tiết trở lên, đặt more hoặc the most phía trước.",
    "- careful, interesting: more interesting than, the most interesting.",
    "Bất quy tắc: học thuộc, không thêm -er.",
    "- good: better, the best.",
    "- bad: worse, the worst.",
    "- far: farther/further, the farthest/furthest.",
  ].join("\n"),
  affirmativePattern: "A + be + comparative + than + B. / A + be + the + superlative + (in/of + nhóm).",
  negativePattern: "A + be + not + as + adj + as + B. / A + be + less + adj + than + B.",
  questionPattern: "Which / Who + be + comparative / the + superlative?",
  signalWords: ["than", "the most", "the -est", "as ... as", "more", "less", "of all", "in the class"],
  examples: [
    {
      sentence: "This road is narrower than the old one.",
      note: "“narrow” là tính từ ngắn, thêm -er thành “narrower”. Có “than” vì chỉ so hai con đường.",
    },
    {
      sentence: "Her essay is more interesting than mine.",
      note: "“interesting” là tính từ dài, không thêm -er mà dùng “more interesting than”.",
    },
    {
      sentence: "She is the most careful student in our class.",
      note: "“careful” là tính từ dài, so với cả lớp nên dùng “the most careful”. “in our class” cho biết đây là cả một nhóm.",
    },
    {
      sentence: "Today is much hotter than yesterday.",
      note: "“much” đứng trước dạng so sánh hơn để nói “hơn nhiều”. Bỏ “much” đi câu vẫn đúng: “hotter than”.",
    },
    {
      sentence: "Your answer is as clear as the sample.",
      note: "“as ... as” là so sánh ngang bằng: hai thứ rõ như nhau. Tính từ ở giữa giữ nguyên, không thêm -er.",
    },
  ],
  commonMistakes: [
    {
      wrong: "This book is more cheaper than that one.",
      right: "This book is cheaper than that one.",
      why: "“cheaper” đã có đuôi -er, nên không thêm “more” nữa. Chỉ chọn một trong hai cách.",
    },
    {
      wrong: "He is the taller in the team.",
      right: "He is the tallest in the team.",
      why: "“in the team” là cả đội, tức từ ba người trở lên, nên dùng so sánh nhất “the tallest”.",
    },
    {
      wrong: "My score is gooder than yours.",
      right: "My score is better than yours.",
      why: "“good” là bất quy tắc: so sánh hơn là “better”, không phải “gooder”.",
    },
    {
      wrong: "Her essay is most interesting than mine.",
      right: "Her essay is more interesting than mine.",
      why: "Có “than” là so sánh hơn, nên dùng “more”. “most” là của so sánh nhất và không đi với “than”.",
    },
  ],
  comparisons: [
    {
      with: "more ... than: so sánh hơn, hai đối tượng",
      note: "Dùng với tính từ dài khi so hai thứ. Luôn đi với “than”. Ví dụ: “This film is more interesting than that one.” Phim này hay hơn phim kia.",
    },
    {
      with: "the most: so sánh nhất, cả nhóm",
      note: "Dùng với tính từ dài khi nói nhất trong một nhóm. Luôn có “the” phía trước và không đi với “than”. Ví dụ: “This is the most interesting film of the year.” Đây là phim hay nhất năm.",
    },
    {
      with: "most không có the",
      note: "Trong câu so sánh, “most” gần như luôn đi cùng “the”: “the most”. Đứng một mình, “most” thường nghĩa là phần lớn: “Most students like music.” Phần lớn học sinh thích âm nhạc. Vì vậy “most interesting than” là sai.",
    },
    {
      with: "much / far + so sánh hơn: hơn nhiều",
      note: "“much” không tự tạo ra so sánh hơn. Nó chỉ đứng trước dạng so sánh để nhấn mạnh: “much more interesting than”, “much taller than”. Ví dụ: “The new phone is much faster than the old one.” Điện thoại mới nhanh hơn nhiều.",
    },
    {
      with: "as ... as: ngang bằng",
      note: "So hai thứ bằng nhau: “as tall as”. Phủ định là không bằng: “not as tall as” hoặc “not so tall as”. Tính từ ở giữa giữ nguyên.",
    },
  ],
  prerequisiteSlugs: ["present-simple"],
  questions: [
    mcq({
      id: "cs-1",
      difficulty: "easy",
      stem: "This bag is ___ than that one.",
      choices: { a: "heavy", b: "heavier", c: "heaviest", d: "more heavy" },
      answer: "b",
      explanation:
        "Câu có “than” và chỉ so hai cái túi, nên dùng so sánh hơn. “heavy” tận cùng bằng phụ âm + y, đổi y thành i rồi thêm -er: “heavier”. Ví dụ: “My bag is heavier than yours.”",
      whyWrong: {
        a: "“heavy” là dạng gốc, chưa phải so sánh. Đứng trước “than” phải là dạng so sánh hơn.",
        c: "“heaviest” là so sánh nhất, dùng khi so với cả nhóm, như “the heaviest bag in the shop”. Không đi với “than”.",
        d: "“heavy” chỉ có hai âm tiết và tận cùng bằng -y, nên thêm -er. Không dùng “more heavy”.",
      },
    }),
    mcq({
      id: "cs-2",
      difficulty: "easy",
      stem: "Mount Fansipan is ___ mountain in Vietnam.",
      choices: {
        a: "higher",
        b: "the higher",
        c: "the highest",
        d: "more high",
      },
      answer: "c",
      explanation:
        "“in Vietnam” là so với tất cả các núi ở Việt Nam, tức cả một nhóm. Vì vậy dùng so sánh nhất. “high” là tính từ ngắn: “the highest”. Ví dụ: “Everest is the highest mountain in the world.”",
      whyWrong: {
        a: "“higher” là so sánh hơn, chỉ so hai thứ và cần “than”. Câu này không có “than”.",
        b: "“the higher” không phải dạng so sánh nhất. So sánh nhất của “high” là “the highest”.",
        d: "“high” là tính từ ngắn, thêm -er hoặc -est. Không dùng “more high”.",
      },
    }),
    mcq({
      id: "cs-3",
      difficulty: "easy",
      stem: "Her essay is ___ interesting than mine.",
      choices: { a: "most", b: "more", c: "much", d: "the most" },
      answer: "b",
      explanation:
        "Bước 1: câu có “than”, nên đây là so sánh hơn, chỉ so hai bài luận. Bước 2: “interesting” là tính từ dài (in-ter-est-ing, bốn âm tiết), nên không thêm -er mà đặt “more” phía trước. Kết quả: “more interesting than”. Ví dụ: “This film is more interesting than that one.”",
      whyWrong: {
        a: "“most” dùng cho so sánh nhất và phải đi với “the”: “the most interesting”. Câu này có “than” nên chỉ so hai thứ, không phải nhất trong nhóm. Ví dụ đúng: “Her essay is the most interesting in the class.”",
        c: "“much” không tự tạo ra so sánh hơn. Nó chỉ đứng trước dạng so sánh để nói hơn nhiều: “much more interesting than”. Ví dụ: “Her essay is much more interesting than mine.”",
        d: "“the most” là so sánh nhất, dùng khi so với cả nhóm, như “in the class” hoặc “of all”. So sánh nhất không đi với “than”.",
      },
    }),
    mcq({
      id: "cs-4",
      difficulty: "easy",
      stem: "Today is ___ yesterday.",
      choices: {
        a: "hotter than",
        b: "hottest than",
        c: "the hotter",
        d: "more hotter than",
      },
      answer: "a",
      explanation:
        "So hai ngày, hôm nay và hôm qua, nên dùng so sánh hơn. “hot” là tính từ ngắn tận cùng bằng nguyên âm + phụ âm, gấp đôi phụ âm cuối rồi thêm -er: “hotter than”. Ví dụ: “July is hotter than March.”",
      whyWrong: {
        b: "“hottest” là so sánh nhất. So sánh nhất không đi với “than”.",
        c: "“the hotter” thiếu “than” và không phải cách so hai ngày.",
        d: "“hotter” đã có đuôi -er, thêm “more” là thừa.",
      },
    }),
    mcq({
      id: "cs-5",
      difficulty: "medium",
      stem: "This exercise is ___ difficult of all in the worksheet.",
      choices: {
        a: "more",
        b: "the more",
        c: "most",
        d: "the most",
      },
      answer: "d",
      explanation:
        "“of all” là so với tất cả bài trong phiếu, tức cả nhóm, nên dùng so sánh nhất. “difficult” là tính từ dài, nên dùng “the most difficult”. Ví dụ: “This is the most difficult question of all.”",
      whyWrong: {
        a: "“more” là so sánh hơn, đi với “than”. Câu này có “of all” nên cần so sánh nhất.",
        b: "“the more” không phải so sánh nhất. Nó chỉ xuất hiện trong cấu trúc “the more ..., the more ...”.",
        c: "So sánh nhất phải có “the”: “the most difficult”. Thiếu “the” là sai.",
      },
    }),
    mcq({
      id: "cs-6",
      difficulty: "medium",
      stem: "Your pronunciation is ___ clear as the teacher's.",
      choices: { a: "more", b: "as", c: "so", d: "the" },
      answer: "b",
      explanation:
        "Phía sau có “clear as”, nên đây là so sánh ngang bằng “as ... as”: rõ bằng giáo viên. Tính từ ở giữa giữ nguyên: “as clear as”. Ví dụ: “My bag is as heavy as yours.”",
      whyWrong: {
        a: "“more” là so sánh hơn và phải đi với “than”: “more clear than”. Không có “more ... as”.",
        c: "“so ... as” chỉ dùng trong câu phủ định: “not so clear as”. Câu này là khẳng định.",
        d: "“the clear as” không phải cấu trúc so sánh nào.",
      },
    }),
    mcq({
      id: "cs-7",
      difficulty: "medium",
      stem: "His result this term is ___ than last term.",
      choices: { a: "good", b: "better", c: "best", d: "more good" },
      answer: "b",
      explanation:
        "Có “than” nên dùng so sánh hơn. “good” là bất quy tắc: so sánh hơn là “better”, so sánh nhất là “the best”. Ví dụ: “Your English is better than last year.”",
      whyWrong: {
        a: "“good” là dạng gốc, chưa phải so sánh.",
        c: "“best” là so sánh nhất và không đi với “than”.",
        d: "“good” không dùng “more good”. Phải học thuộc dạng bất quy tắc “better”.",
      },
    }),
    mcq({
      id: "cs-8",
      difficulty: "medium",
      stem: "Of the three routes, this one is ___.",
      choices: {
        a: "shorter",
        b: "the shorter",
        c: "shortest",
        d: "the shortest",
      },
      answer: "d",
      explanation:
        "“Of the three routes” là trong ba con đường, tức từ ba trở lên, nên dùng so sánh nhất: “the shortest”. Ví dụ: “Of all my friends, Lan is the tallest.”",
      whyWrong: {
        a: "“shorter” chỉ so hai thứ và thường cần “than”. Ở đây có ba con đường.",
        b: "“the shorter” chỉ dùng khi chọn một trong hai, như “the shorter of the two”. Ở đây là ba.",
        c: "So sánh nhất phải có “the”: “the shortest”.",
      },
    }),
    mcq({
      id: "cs-9",
      difficulty: "hard",
      stem: "The more carefully you revise, ___ mistakes you will make.",
      choices: {
        a: "the fewer",
        b: "the fewest",
        c: "fewer",
        d: "the less few",
      },
      answer: "a",
      explanation:
        "Cấu trúc “the more ..., the ...” nghĩa là càng ... càng .... Cả hai vế đều bắt đầu bằng “the” + so sánh hơn. “mistakes” đếm được nên dùng “fewer”: “the fewer mistakes”. Ví dụ: “The more you read, the more you learn.”",
      whyWrong: {
        b: "“the fewest” là so sánh nhất. Cấu trúc càng ... càng ... dùng so sánh hơn ở cả hai vế.",
        c: "Vế thứ hai cũng phải có “the”: “the fewer”.",
        d: "“the less few” không phải cụm đúng. Danh từ đếm được dùng “fewer”.",
      },
    }),
    mcq({
      id: "cs-10",
      difficulty: "hard",
      stem: "Living in the city is not ___ living in the countryside.",
      choices: {
        a: "as peaceful than",
        b: "so peaceful as",
        c: "more peaceful as",
        d: "peaceful as",
      },
      answer: "b",
      explanation:
        "Câu phủ định “is not”, nói thành phố không yên bình bằng nông thôn. Phủ định của so sánh ngang bằng là “not as ... as” hoặc “not so ... as”. Ở đây chỉ có “so peaceful as” đúng dạng. Ví dụ: “This test is not so hard as the last one.”",
      whyWrong: {
        a: "“as ... than” trộn hai cấu trúc. “as” đi với “as”, còn “than” đi với so sánh hơn.",
        c: "“more” phải đi với “than”, không đi với “as”.",
        d: "Thiếu “as” hoặc “so” ở phía trước tính từ.",
      },
    }),
    mcq({
      id: "cs-11",
      difficulty: "hard",
      stem: "This is by far ___ explanation I have heard today.",
      choices: {
        a: "clearer",
        b: "the clearer",
        c: "the clearest",
        d: "more clearer",
      },
      answer: "c",
      explanation:
        "“by far” nghĩa là hơn hẳn, hay đứng trước so sánh nhất. “I have heard today” là so với mọi lời giải thích hôm nay, tức cả nhóm. Vì vậy dùng “the clearest”. Ví dụ: “She is by far the best player in the team.”",
      whyWrong: {
        a: "“clearer” là so sánh hơn, cần “than” và chỉ so hai thứ.",
        b: "“the clearer” không phải dạng so sánh nhất.",
        d: "“clearer” đã có đuôi -er, thêm “more” là thừa.",
      },
    }),
    mcq({
      id: "cs-12",
      difficulty: "hard",
      stem: "The weather got ___ worse after lunch, so the match was postponed.",
      choices: { a: "more", b: "even", c: "most", d: "very" },
      answer: "b",
      explanation:
        "“worse” đã là so sánh hơn của “bad”. Trước so sánh hơn, muốn nói còn ... hơn nữa thì dùng “even”: “even worse”, tức còn tệ hơn nữa. Ví dụ: “The second test was even harder.”",
      whyWrong: {
        a: "“worse” đã là so sánh hơn, thêm “more” là thừa.",
        c: "“most” dùng cho so sánh nhất. “most worse” không đúng.",
        d: "“very” chỉ đi với tính từ gốc, như “very bad”. Không nói “very worse”.",
      },
    }),
  ],
};
