import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const health: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-health",
  slug: "health",
  name: "Health",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về sức khỏe: triệu chứng, chữa trị, dinh dưỡng và thói quen sống lành mạnh trong ngữ cảnh đời thường.",
  overview:
    "Bài này giúp bạn dùng đúng các từ như “symptom”, “prescribe”, “recover”, “contagious” khi nói về bệnh, khám chữa và chăm sóc sức khỏe. Tập trung nghĩa trong câu: chọn từ khớp ngữ cảnh, không học nghĩa tách rời. Học kèm cụm cố định như “catch a cold”, “run a fever” để nói tự nhiên hơn.",
  items: [
    {
      word: "symptom",
      meaningVi: "triệu chứng (dấu hiệu của bệnh)",
      wordClass: "noun",
      example: "A high fever can be a symptom of the flu.",
      note: "Thường dùng số nhiều: “symptoms of stress”.",
    },
    {
      word: "prescribe",
      meaningVi: "kê đơn (thuốc)",
      wordClass: "verb",
      example: "The doctor prescribed antibiotics for the infection.",
      note: "Khác “recommend”: prescribe mang tính y khoa, có đơn thuốc.",
    },
    {
      word: "recover",
      meaningVi: "hồi phục (sau bệnh/chấn thương)",
      wordClass: "verb",
      example: "It took her two weeks to recover from the surgery.",
      note: "Thường đi với “from”: recover from an illness.",
    },
    {
      word: "contagious",
      meaningVi: "dễ lây (bệnh)",
      wordClass: "adjective",
      example: "Chickenpox is highly contagious among children.",
      note: "Nói về bệnh/lây lan, không dùng cho cảm xúc trừ khi ẩn dụ.",
    },
    {
      word: "diagnose",
      meaningVi: "chẩn đoán (bệnh)",
      wordClass: "verb",
      example: "Specialists diagnosed the rare condition last month.",
      note: "diagnose + bệnh / diagnose someone with + bệnh.",
    },
    {
      word: "nutrition",
      meaningVi: "dinh dưỡng",
      wordClass: "noun",
      example: "Good nutrition supports concentration at school.",
      note: "Tính từ liên quan: “nutritious” (bổ dưỡng).",
    },
    {
      word: "vaccination",
      meaningVi: "tiêm chủng; mũi tiêm phòng",
      wordClass: "noun",
      example: "School vaccination programs reduce serious outbreaks.",
      note: "Động từ: “vaccinate”; tính từ: “vaccinated”.",
    },
    {
      word: "chronic",
      meaningVi: "mãn tính; kéo dài lâu",
      wordClass: "adjective",
      example: "He manages chronic back pain with daily exercise.",
      note: "Đối lập với “acute” (cấp tính, ngắn hạn).",
    },
  ],
  collocations: [
    {
      phrase: "catch a cold",
      meaningVi: "bị cảm lạnh",
      example: "I caught a cold after standing in the rain.",
    },
    {
      phrase: "run a fever",
      meaningVi: "bị sốt",
      example: "The toddler ran a fever all night.",
    },
    {
      phrase: "get over an illness",
      meaningVi: "khỏi bệnh; vượt qua đợt ốm",
      example: "She finally got over the flu before the exam.",
    },
    {
      phrase: "take medicine",
      meaningVi: "uống/dùng thuốc",
      example: "Remember to take medicine after meals.",
    },
    {
      phrase: "make an appointment",
      meaningVi: "đặt lịch khám",
      example: "Please make an appointment with the dentist.",
    },
  ],
  commonMistakes: [
    {
      wrong: "The doctor gave me a recipe for the pain.",
      right: "The doctor gave me a prescription for the pain.",
      why: "“recipe” là công thức nấu ăn; đơn thuốc là “prescription”.",
    },
    {
      wrong: "She is very contagious of kindness.",
      right: "She is very infectious with kindness. / Her kindness is contagious.",
      why: "“contagious” chủ yếu nói bệnh lây; dùng ẩn dụ thì gắn với danh từ cảm xúc, không nói “contagious of”.",
    },
    {
      wrong: "I need to recover my headache.",
      right: "I need to recover from my headache. / I need to get rid of my headache.",
      why: "recover đi với “from” khi nói khỏi bệnh; không “recover + bệnh” trực tiếp.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "hea-1",
      difficulty: "easy",
      stem: "A sore throat and a dry cough can be a ___ of a cold.",
      choices: {
        a: "symptom",
        b: "vaccine",
        c: "surgery",
        d: "diet",
      },
      answer: "a",
      explanation:
        "Câu liệt kê dấu hiệu cơ thể (đau họng, ho) nên cần “symptom” — triệu chứng. Ví dụ: “Fever is a common symptom of the flu.”",
      whyWrong: {
        b: "“vaccine” đúng khi nói mũi tiêm phòng: “The vaccine protects against measles.”",
        c: "“surgery” đúng khi nói ca mổ: “She had surgery on her knee.”",
        d: "“diet” đúng khi nói chế độ ăn: “A balanced diet keeps you healthy.”",
      },
    }),
    mcq({
      id: "hea-2",
      difficulty: "easy",
      stem: "After the operation, it took him a month to ___ fully.",
      choices: {
        a: "infect",
        b: "recover",
        c: "prescribe",
        d: "spread",
      },
      answer: "b",
      explanation:
        "Sau phẫu thuật cần thời gian khỏi lại sức → “recover”. Ví dụ: “Athletes recover faster with proper rest.”",
      whyWrong: {
        a: "“infect” đúng khi nói làm lây nhiễm: “Dirty water can infect wounds.”",
        c: "“prescribe” đúng khi bác sĩ kê đơn: “Doctors prescribe painkillers carefully.”",
        d: "“spread” đúng khi bệnh lan rộng: “The virus spread quickly in the dorm.”",
      },
    }),
    mcq({
      id: "hea-3",
      difficulty: "easy",
      stem: "Wash your hands often because this virus is highly ___.",
      choices: {
        a: "nutritious",
        b: "chronic",
        c: "contagious",
        d: "optional",
      },
      answer: "c",
      explanation:
        "Câu nhắc rửa tay để tránh lây → “contagious” (dễ lây). Ví dụ: “Measles is highly contagious.”",
      whyWrong: {
        a: "“nutritious” đúng khi nói đồ ăn bổ: “Oats are nutritious for breakfast.”",
        b: "“chronic” đúng khi bệnh kéo dài lâu: “He has chronic asthma.”",
        d: "“optional” đúng khi việc không bắt buộc: “The health check is optional.”",
      },
    }),
    mcq({
      id: "hea-4",
      difficulty: "easy",
      stem: "The clinic asked parents to bring children for free ___ before the school year.",
      choices: {
        a: "nutrition",
        b: "vaccination",
        c: "infection",
        d: "bandage",
      },
      answer: "b",
      explanation:
        "Đưa trẻ đến phòng khám trước năm học để tiêm phòng → “vaccination”. Ví dụ: “Annual flu vaccination is recommended.”",
      whyWrong: {
        a: "“nutrition” đúng khi nói dinh dưỡng: “School meals improve children’s nutrition.”",
        c: "“infection” đúng khi nói nhiễm trùng: “The cut developed an infection.”",
        d: "“bandage” đúng khi nói băng gạc: “She wrapped a bandage around her wrist.”",
      },
    }),
    mcq({
      id: "hea-5",
      difficulty: "medium",
      stem: "Only a licensed doctor can ___ strong antibiotics for bacterial infections.",
      choices: {
        a: "diagnose",
        b: "prescribe",
        c: "recover",
        d: "inhale",
      },
      answer: "b",
      explanation:
        "Kê kháng sinh mạnh là việc của bác sĩ có giấy phép → “prescribe”. Ví dụ: “Never take antibiotics unless a doctor has prescribed them.”",
      whyWrong: {
        a: "“diagnose” đúng khi xác định bệnh: “Tests helped them diagnose the allergy.”",
        c: "“recover” đúng khi bệnh nhân khỏi: “Patients recover better with support.”",
        d: "“inhale” đúng khi hít vào phổi: “Asthma patients inhale medicine through a device.”",
      },
    }),
    mcq({
      id: "hea-6",
      difficulty: "medium",
      stem: "Blood tests helped specialists ___ the cause of her constant tiredness.",
      choices: {
        a: "diagnose",
        b: "bandage",
        c: "sneeze",
        d: "swallow",
      },
      answer: "a",
      explanation:
        "Xét nghiệm máu giúp tìm nguyên nhân mệt → “diagnose” (chẩn đoán). Ví dụ: “Doctors diagnosed anemia after the lab results.”",
      whyWrong: {
        b: "“bandage” đúng khi băng vết thương: “Nurses bandage the wound carefully.”",
        c: "“sneeze” đúng khi hắt hơi: “Pepper makes some people sneeze.”",
        d: "“swallow” đúng khi nuốt: “It hurt when he tried to swallow.”",
      },
    }),
    mcq({
      id: "hea-7",
      difficulty: "medium",
      stem: "Athletes focus on sleep and ___ so their bodies can repair after hard training.",
      choices: {
        a: "contagion",
        b: "nutrition",
        c: "outbreak",
        d: "allergy",
      },
      answer: "b",
      explanation:
        "Ngủ và chế độ ăn giúp cơ thể phục hồi → “nutrition”. Ví dụ: “Proper nutrition fuels long practice sessions.”",
      whyWrong: {
        a: "“contagion” đúng khi nói sự lây lan bệnh: “Hospitals work to stop contagion.”",
        c: "“outbreak” đúng khi dịch bùng phát: “An outbreak closed the canteen.”",
        d: "“allergy” đúng khi dị ứng: “Her peanut allergy is serious.”",
      },
    }),
    mcq({
      id: "hea-8",
      difficulty: "medium",
      stem: "Unlike a short cold, ___ pain may last for months and needs a long-term plan.",
      choices: {
        a: "chronic",
        b: "fresh",
        c: "sudden",
        d: "mild",
      },
      answer: "a",
      explanation:
        "Đối lập với cảm ngắn ngày, cơn đau kéo dài nhiều tháng → “chronic”. Ví dụ: “Chronic stress affects sleep quality.”",
      whyWrong: {
        b: "“fresh” đúng khi nói mới/tươi: “Eat fresh fruit every day.”",
        c: "“sudden” đúng khi xảy ra đột ngột: “She felt a sudden pain in her chest.”",
        d: "“mild” đúng khi nhẹ: “He had a mild headache after class.”",
      },
    }),
    mcq({
      id: "hea-9",
      difficulty: "hard",
      stem: "If colleagues ___ a fever at work, managers should send them home to rest.",
      choices: {
        a: "catch",
        b: "run",
        c: "make",
        d: "take",
      },
      answer: "b",
      explanation:
        "Cụm cố định là “run a fever” (bị sốt). Ví dụ: “The child ran a fever after midnight.”",
      whyWrong: {
        a: "“catch” đúng trong “catch a cold/flu”, không nói “catch a fever”: “I caught a cold on the trip.”",
        c: "“make” đúng trong “make an appointment”: “Make an appointment before you visit.”",
        d: "“take” đúng trong “take medicine” hoặc “take someone’s temperature”: “Nurses take patients’ temperature.”",
      },
    }),
    mcq({
      id: "hea-10",
      difficulty: "hard",
      stem: "She refused online advice and waited for a proper ___ before buying any pills.",
      choices: {
        a: "recipe",
        b: "prescription",
        c: "receipt",
        d: "portion",
      },
      answer: "b",
      explanation:
        "Trước khi mua thuốc cần đơn của bác sĩ → “prescription”. Ví dụ: “The pharmacy will not sell it without a prescription.”",
      whyWrong: {
        a: "“recipe” đúng khi nói công thức nấu: “This soup recipe needs ginger.”",
        c: "“receipt” đúng khi nói hóa đơn mua hàng: “Keep the receipt for the refund.”",
        d: "“portion” đúng khi nói khẩu phần: “A small portion of rice is enough.”",
      },
    }),
    mcq({
      id: "hea-11",
      difficulty: "hard",
      stem: "Public posters remind travelers that early ___ can prevent outbreaks on crowded flights.",
      choices: {
        a: "vaccination",
        b: "diagnosis alone",
        c: "chronic pain",
        d: "surgery plans",
      },
      answer: "a",
      explanation:
        "Áp phích nhắc khách du lịch tiêm sớm để ngăn dịch trên máy bay đông → “vaccination”. Ví dụ: “Travel vaccination is advised before long trips.”",
      whyWrong: {
        b: "“diagnosis alone” đúng khi chỉ nói việc xác định bệnh, không ngăn dịch trước: “An early diagnosis helped treatment.”",
        c: "“chronic pain” đúng khi đau mãn tính: “Physio can ease chronic pain.”",
        d: "“surgery plans” đúng khi lên kế hoạch mổ: “They discussed surgery plans with the family.”",
      },
    }),
    mcq({
      id: "hea-12",
      difficulty: "hard",
      stem: "After weeks in bed, he was eager to ___ the illness and return to training.",
      choices: {
        a: "get over",
        b: "get into",
        c: "get off",
        d: "get by",
      },
      answer: "a",
      explanation:
        "Muốn khỏi bệnh và trở lại tập luyện → “get over” (an illness). Ví dụ: “It took days to get over the fever.”",
      whyWrong: {
        b: "“get into” đúng khi bắt đầu thích/tham gia: “She got into swimming last year.”",
        c: "“get off” đúng khi xuống xe/thoát tội: “We get off at the next stop.”",
        d: "“get by” đúng khi xoay sở đủ sống: “Students get by on a small budget.”",
      },
    }),
  ],
};
