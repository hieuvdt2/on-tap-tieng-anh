import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const subjectVerbAgreement: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-subject-verb-agreement",
  slug: "subject-verb-agreement",
  name: "Subject-Verb Agreement",
  gradeFrom: 8,
  gradeTo: 12,
  summary:
    "Khớp động từ với chủ ngữ: everyone/neither dùng số ít; a number of + số nhiều; the number of + số ít; there is/are theo danh từ phía sau.",
  overview:
    "Subject-verb agreement là quy tắc chọn dạng động từ khớp số với chủ ngữ thật, không phải với danh từ gần chỗ trống nhất. Các mẫu hay gặp trong đề: đại từ bất định (“everyone”, “somebody”) + động từ số ít; “neither … nor …” theo chủ ngữ gần động từ; “a number of” + động từ số nhiều; “the number of” + động từ số ít; “there is/are” khớp danh từ đứng sau. Học các mẫu như collocation để nhận nhanh khi làm chỗ trống.",
  items: [
    {
      word: "everyone / everybody",
      meaningVi: "mọi người — đi với động từ số ít",
      wordClass: "indefinite pronoun",
      example: "Everyone wants a clear explanation.",
      note: "Dù nghĩa là nhiều người, ngữ pháp vẫn số ít: wants, is, has.",
    },
    {
      word: "neither … nor …",
      meaningVi: "không … cũng không … — động từ khớp chủ ngữ gần nhất",
      wordClass: "correlative conjunction",
      example: "Neither the teacher nor the students were ready.",
      note: "Nhìn danh từ sát động từ: students → were; student → was.",
    },
    {
      word: "a number of",
      meaningVi: "một số (nhiều) — động từ số nhiều",
      wordClass: "quantifier phrase",
      example: "A number of students were absent.",
      note: "Khác “the number of” (số lượng → số ít).",
    },
    {
      word: "the number of",
      meaningVi: "số lượng của — động từ số ít",
      wordClass: "quantifier phrase",
      example: "The number of applicants is rising.",
      note: "Chủ ngữ thật là “number”, không phải danh từ sau “of”.",
    },
    {
      word: "there is / there are",
      meaningVi: "có … — khớp danh từ đứng ngay sau",
      wordClass: "existential structure",
      example: "There are three books on the desk.",
      note: "Danh từ số ít/không đếm được → there is; số nhiều → there are.",
    },
    {
      word: "each / every",
      meaningVi: "mỗi — động từ số ít",
      wordClass: "determiner",
      example: "Each student has a locker.",
      note: "each of + danh từ số nhiều vẫn thường dùng động từ số ít: Each of them has…",
    },
    {
      word: "one of + plural noun",
      meaningVi: "một trong những — động từ số ít",
      wordClass: "noun phrase pattern",
      example: "One of the answers is incorrect.",
      note: "Chủ ngữ là “one”, không phải danh từ số nhiều phía sau.",
    },
    {
      word: "news / mathematics / physics",
      meaningVi: "danh từ dạng số nhiều nhưng nghĩa số ít",
      wordClass: "singular noun (form)",
      example: "The news is surprising.",
      note: "Dùng is/was/has, không dùng are với “news” trong nghĩa tin tức.",
    },
  ],
  collocations: [
    {
      phrase: "a number of + plural verb",
      meaningVi: "một số … + động từ số nhiều",
      example: "A number of volunteers have signed up.",
    },
    {
      phrase: "the number of + singular verb",
      meaningVi: "số lượng … + động từ số ít",
      example: "The number of volunteers has increased.",
    },
    {
      phrase: "everyone + singular verb",
      meaningVi: "mọi người + động từ số ít",
      example: "Everyone needs enough sleep before an exam.",
    },
    {
      phrase: "neither A nor B + verb near B",
      meaningVi: "neither … nor … khớp chủ ngữ gần động từ",
      example: "Neither my parents nor my sister likes that film.",
    },
    {
      phrase: "there is/are + noun after",
      meaningVi: "there is/are khớp danh từ phía sau",
      example: "There is a problem; there are two solutions.",
    },
  ],
  commonMistakes: [
    {
      wrong: "Everyone want to leave early.",
      right: "Everyone wants to leave early.",
      why: "“Everyone” đi với động từ số ít dù nghĩa là nhiều người.",
    },
    {
      wrong: "A number of students was late.",
      right: "A number of students were late.",
      why: "“a number of” mang nghĩa “nhiều” → động từ số nhiều “were”.",
    },
    {
      wrong: "The number of errors are high.",
      right: "The number of errors is high.",
      why: "Chủ ngữ là “the number” → động từ số ít “is”.",
    },
  ],
  prerequisiteSlugs: ["present-simple"],
  questions: [
    mcq({
      id: "sva-1",
      difficulty: "easy",
      stem: "Everyone ___ ready for the presentation.",
      choices: { a: "is", b: "are", c: "were", d: "have been" },
      answer: "a",
      explanation:
        "“Everyone” luôn đi với động từ số ít. Ví dụ: “Everyone is waiting outside.”",
      whyWrong: {
        b: "“are” đúng với chủ ngữ số nhiều rõ ràng, như “All students are ready.”",
        c: "“were” đúng ở quá khứ với chủ ngữ số nhiều, như “They were ready.”",
        d: "“have been” đúng với chủ ngữ số nhiều hiện tại hoàn thành, như “They have been ready.”",
      },
    }),
    mcq({
      id: "sva-2",
      difficulty: "easy",
      stem: "There ___ three empty seats in the front row.",
      choices: { a: "are", b: "is", c: "was", d: "has" },
      answer: "a",
      explanation:
        "Sau “there” là danh từ số nhiều “three empty seats” → “there are”. Ví dụ: “There are two buses at the stop.”",
      whyWrong: {
        b: "“there is” đúng khi danh từ phía sau số ít, như “There is one empty seat.”",
        c: "“there was” đúng ở quá khứ với danh từ số ít, như “There was a delay yesterday.”",
        d: "“has” không dùng sau “there” theo kiểu này; “has” đúng kiểu “She has three seats reserved.”",
      },
    }),
    mcq({
      id: "sva-3",
      difficulty: "easy",
      stem: "The news from the school ___ quite encouraging.",
      choices: { a: "is", b: "are", c: "were", d: "have" },
      answer: "a",
      explanation:
        "“news” mang nghĩa số ít dù có “s”. Ví dụ: “The news is on at six.”",
      whyWrong: {
        b: "“are” đúng với danh từ số nhiều thật, như “The reports are encouraging.”",
        c: "“were” đúng ở quá khứ với chủ ngữ số nhiều, như “The reports were encouraging.”",
        d: "“have” đúng với chủ ngữ số nhiều hiện tại, như “They have good news.”",
      },
    }),
    mcq({
      id: "sva-4",
      difficulty: "easy",
      stem: "Each of the players ___ a water bottle.",
      choices: { a: "has", b: "have", c: "are having", d: "were" },
      answer: "a",
      explanation:
        "“Each” (và “each of + danh từ số nhiều”) đi với động từ số ít. Ví dụ: “Each of the rooms has a window.”",
      whyWrong: {
        b: "“have” đúng với chủ ngữ số nhiều, như “All of the players have a water bottle.”",
        c: "“are having” đúng khi nhấn mạnh hành động đang diễn ra với chủ ngữ số nhiều, như “They are having lunch.”",
        d: "“were” đúng ở quá khứ với chủ ngữ số nhiều, như “The players were ready.”",
      },
    }),
    mcq({
      id: "sva-5",
      difficulty: "medium",
      stem: "A number of parents ___ waiting outside the hall.",
      choices: { a: "are", b: "is", c: "was", d: "has" },
      answer: "a",
      explanation:
        "“a number of” = nhiều → động từ số nhiều. Ví dụ: “A number of emails were sent this morning.”",
      whyWrong: {
        b: "“is” đúng với “the number of …”, như “The number of parents is high.”",
        c: "“was” đúng ở quá khứ với chủ ngữ số ít, như “The number was surprising.”",
        d: "“has” đúng với chủ ngữ số ít, như “The number of parents has grown.”",
      },
    }),
    mcq({
      id: "sva-6",
      difficulty: "medium",
      stem: "The number of online courses ___ every year.",
      choices: { a: "increases", b: "increase", c: "are increasing", d: "have increased" },
      answer: "a",
      explanation:
        "Chủ ngữ là “the number” → động từ số ít “increases”. Ví dụ: “The number of visitors increases in summer.”",
      whyWrong: {
        b: "“increase” (không -s) đúng với chủ ngữ số nhiều, như “Online courses increase every year.”",
        c: "“are increasing” đúng với chủ ngữ số nhiều đang diễn ra, như “More students are increasing their study time” — hoặc “Courses are increasing.”",
        d: "“have increased” đúng với chủ ngữ số nhiều hiện tại hoàn thành, như “Online courses have increased.”",
      },
    }),
    mcq({
      id: "sva-7",
      difficulty: "medium",
      stem: "Neither the principal nor the teachers ___ available now.",
      choices: { a: "are", b: "is", c: "was", d: "has" },
      answer: "a",
      explanation:
        "Với “neither … nor …”, động từ khớp chủ ngữ gần nhất: “teachers” → “are”. Ví dụ: “Neither Tom nor his friends are free today.”",
      whyWrong: {
        b: "“is” đúng nếu chủ ngữ gần động từ số ít, như “Neither the teachers nor the principal is available.”",
        c: "“was” đúng ở quá khứ với chủ ngữ số ít gần động từ, như “Neither the teachers nor the principal was free.”",
        d: "“has” đúng với chủ ngữ số ít, như “Neither of them has arrived.”",
      },
    }),
    mcq({
      id: "sva-8",
      difficulty: "medium",
      stem: "One of the windows ___ broken during the storm.",
      choices: { a: "was", b: "were", c: "are", d: "have been" },
      answer: "a",
      explanation:
        "Chủ ngữ là “One”, không phải “windows” → động từ số ít “was”. Ví dụ: “One of the keys is missing.”",
      whyWrong: {
        b: "“were” đúng nếu chủ ngữ số nhiều, như “Some of the windows were broken.”",
        c: "“are” đúng với chủ ngữ số nhiều hiện tại, như “Two of the windows are broken.”",
        d: "“have been” đúng với chủ ngữ số nhiều hiện tại hoàn thành, như “Several windows have been broken.”",
      },
    }),
    mcq({
      id: "sva-9",
      difficulty: "hard",
      stem: "Neither of the proposals ___ practical for our budget.",
      choices: { a: "seems", b: "seem", c: "are seeming", d: "have seemed" },
      answer: "a",
      explanation:
        "“Neither of + danh từ số nhiều” thường lấy động từ số ít trong tiếng Anh học thuật/thi. Ví dụ: “Neither of the answers seems correct.”",
      whyWrong: {
        b: "“seem” (số nhiều) đôi khi gặp trong văn nói, nhưng đề thường yêu cầu số ít với “neither of”. “seem” chuẩn với “Both proposals seem practical.”",
        c: "“are seeming” gần như không dùng; “seem” ít khi ở tiếp diễn. “are” đúng kiểu “Both proposals are practical.”",
        d: "“have seemed” đúng với chủ ngữ số nhiều hiện tại hoàn thành, như “Both options have seemed risky.”",
      },
    }),
    mcq({
      id: "sva-10",
      difficulty: "hard",
      stem: "The committee ___ decided to postpone the vote.",
      choices: { a: "has", b: "have", c: "are", d: "were" },
      answer: "a",
      explanation:
        "Khi “committee” được xem là một đơn vị (quyết định tập thể), dùng động từ số ít. Ví dụ: “The team has won the match.”",
      whyWrong: {
        b: "“have” đúng khi nhấn mạnh từng thành viên hành động riêng, như “The committee have different opinions” (biến thể Anh Anh).",
        c: "“are” đúng với danh từ số nhiều hoặc tập thể mang nghĩa thành viên, như “The members are ready.”",
        d: "“were” đúng ở quá khứ với chủ ngữ số nhiều, như “The members were divided.”",
      },
    }),
    mcq({
      id: "sva-11",
      difficulty: "hard",
      stem: "There ___ a pen and two notebooks on her desk.",
      choices: { a: "is", b: "are", c: "were", d: "have" },
      answer: "a",
      explanation:
        "Trong cấu trúc “there”, động từ thường khớp danh từ đứng ngay sau: “a pen” số ít → “There is …”. Ví dụ: “There is a book and some pens in the bag.”",
      whyWrong: {
        b: "“are” đúng nếu danh từ đầu tiên số nhiều, như “There are two notebooks and a pen on her desk.”",
        c: "“were” đúng ở quá khứ với chủ ngữ số nhiều phía sau, như “There were two notebooks on her desk.”",
        d: "“have” không dùng sau “there” theo kiểu này; đúng kiểu “She has a pen and two notebooks.”",
      },
    }),
    mcq({
      id: "sva-12",
      difficulty: "hard",
      stem: "Not only the students but also the coach ___ exhausted after the match.",
      choices: { a: "was", b: "were", c: "are", d: "have been" },
      answer: "a",
      explanation:
        "Với “not only … but also …”, động từ khớp chủ ngữ gần nhất: “the coach” → “was”. Ví dụ: “Not only the players but also the coach was tired.”",
      whyWrong: {
        b: "“were” đúng nếu chủ ngữ gần động từ số nhiều, như “Not only the coach but also the students were exhausted.”",
        c: "“are” đúng ở hiện tại với chủ ngữ số nhiều gần động từ, như “Not only the coach but also the students are exhausted.”",
        d: "“have been” đúng với chủ ngữ số nhiều hiện tại hoàn thành, như “The students have been exhausted.”",
      },
    }),
  ],
};
