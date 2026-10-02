import { mcq } from "../helpers";
import type { VocabularyTopicSeed } from "../types";

export const environment: VocabularyTopicSeed = {
  skill: "vocabulary",
  id: "topic-environment",
  slug: "environment",
  name: "Environment",
  gradeFrom: 10,
  gradeTo: 12,
  summary:
    "Từ vựng về môi trường, ô nhiễm và bảo vệ thiên nhiên dùng trong bài nói và bài viết cấp trung học.",
  overview:
    "Chủ đề giúp bạn mô tả vấn đề môi trường và hành động bảo vệ Trái Đất bằng từ ngữ chính xác. Tập trung vào danh từ và động từ hay gặp khi bàn về khí hậu, rác thải và tài nguyên. Câu luyện yêu cầu chọn từ khớp ngữ cảnh câu, không chỉ nhớ nghĩa rời.",
  items: [
    {
      word: "pollution",
      meaningVi: "ô nhiễm",
      wordClass: "noun",
      example: "Air pollution in big cities harms children’s health.",
      note: "Có thể nói “air / water / soil pollution”; động từ liên quan là “pollute”.",
    },
    {
      word: "recycle",
      meaningVi: "tái chế",
      wordClass: "verb",
      example: "Our neighbourhood recycles plastic bottles every Tuesday.",
      note: "Khác “reuse” (dùng lại nguyên món) và “reduce” (giảm lượng dùng).",
    },
    {
      word: "conserve",
      meaningVi: "bảo tồn / tiết kiệm (tài nguyên)",
      wordClass: "verb",
      example: "Turning off unused lights helps conserve electricity.",
      note: "Hay đi với water, energy, wildlife; danh từ là “conservation”.",
    },
    {
      word: "endangered",
      meaningVi: "có nguy cơ tuyệt chủng",
      wordClass: "adjective",
      example: "Tigers are endangered in several Asian countries.",
      note: "Thường đứng trước “species”; mạnh hơn “rare”.",
    },
    {
      word: "emission",
      meaningVi: "khí thải / sự phát thải",
      wordClass: "noun",
      example: "Factories must cut carbon emissions this decade.",
      note: "Thường dùng số nhiều “emissions” khi nói khí nhà kính.",
    },
    {
      word: "drought",
      meaningVi: "hạn hán",
      wordClass: "noun",
      example: "The long drought destroyed crops across the region.",
      note: "Đối lập với “flood”; tính từ liên quan là “dry”.",
    },
    {
      word: "sustainable",
      meaningVi: "bền vững",
      wordClass: "adjective",
      example: "The town promotes sustainable farming that protects the soil.",
      note: "Hay đi với development, energy, tourism.",
    },
    {
      word: "habitat",
      meaningVi: "môi trường sống (của loài)",
      wordClass: "noun",
      example: "Logging destroys the natural habitat of many birds.",
      note: "Không dùng cho “nhà ở” của người; đó là “home” hoặc “housing”.",
    },
  ],
  collocations: [
    {
      phrase: "climate change",
      meaningVi: "biến đổi khí hậu",
      example: "Climate change is raising average temperatures worldwide.",
    },
    {
      phrase: "carbon footprint",
      meaningVi: "dấu chân carbon / lượng phát thải cá nhân",
      example: "Taking the bus can reduce your carbon footprint.",
    },
    {
      phrase: "renewable energy",
      meaningVi: "năng lượng tái tạo",
      example: "Wind and solar are forms of renewable energy.",
    },
    {
      phrase: "raise awareness",
      meaningVi: "nâng cao nhận thức",
      example: "The campaign aims to raise awareness about plastic waste.",
    },
    {
      phrase: "throw away",
      meaningVi: "vứt bỏ",
      example: "Do not throw away batteries with regular rubbish.",
    },
  ],
  commonMistakes: [
    {
      wrong: "We should protect the nature.",
      right: "We should protect nature. / We should protect the environment.",
      why: "Khi nói “thiên nhiên” nói chung, thường không dùng “the” trước “nature”.",
    },
    {
      wrong: "Air pollutions is a serious problem.",
      right: "Air pollution is a serious problem.",
      why: "“Pollution” là danh từ không đếm được trong nghĩa tổng quát, không thêm -s.",
    },
    {
      wrong: "Many animals are in dangered.",
      right: "Many animals are endangered.",
      why: "Dạng đúng là tính từ “endangered”, không tách thành “in dangered”.",
    },
  ],
  prerequisiteSlugs: [],
  questions: [
    mcq({
      id: "env-1",
      difficulty: "easy",
      stem: "Please ___ glass jars instead of putting them in the rubbish bin.",
      choices: {
        a: "recycle",
        b: "pollute",
        c: "waste",
        d: "burn",
      },
      answer: "a",
      explanation:
        "Đưa lọ thủy tinh vào quy trình tái chế → “recycle”. Ví dụ: “We recycle paper at school.”",
      whyWrong: {
        b: "“Pollute” đúng khi làm bẩn không khí hoặc nước, ví dụ: “Factories pollute the river.”",
        c: "“Waste” đúng khi lãng phí tài nguyên, ví dụ: “Do not waste clean water.”",
        d: "“Burn” đúng khi đốt, ví dụ: “Burning plastic releases toxic smoke.”",
      },
    }),
    mcq({
      id: "env-2",
      difficulty: "easy",
      stem: "Heavy traffic increases air ___ near busy roads.",
      choices: {
        a: "habitat",
        b: "pollution",
        c: "drought",
        d: "conservation",
      },
      answer: "b",
      explanation:
        "Khí thải giao thông làm không khí bẩn → “pollution”. Ví dụ: “Water pollution kills fish.”",
      whyWrong: {
        a: "“Habitat” đúng khi nói nơi sống của loài, ví dụ: “Coral reefs are a habitat for fish.”",
        c: "“Drought” đúng khi nói hạn hán kéo dài, ví dụ: “The drought lasted six months.”",
        d: "“Conservation” đúng khi nói hoạt động bảo tồn, ví dụ: “Wildlife conservation needs funding.”",
      },
    }),
    mcq({
      id: "env-3",
      difficulty: "easy",
      stem: "Short showers help us ___ water during the dry season.",
      choices: {
        a: "dump",
        b: "conserve",
        c: "emit",
        d: "flood",
      },
      answer: "b",
      explanation:
        "Dùng ít nước hơn để tiết kiệm tài nguyên → “conserve”. Ví dụ: “Farms try to conserve groundwater.”",
      whyWrong: {
        a: "“Dump” đúng khi đổ bỏ chất thải, ví dụ: “Do not dump chemicals into streams.”",
        c: "“Emit” đúng khi phát ra khí hoặc ánh sáng, ví dụ: “Cars emit carbon dioxide.”",
        d: "“Flood” đúng khi ngập lụt, ví dụ: “Heavy rain may flood the village.”",
      },
    }),
    mcq({
      id: "env-4",
      difficulty: "easy",
      stem: "Do not ___ old phones; take them to an electronics collection point.",
      choices: {
        a: "throw away",
        b: "raise awareness",
        c: "cut down",
        d: "break down",
      },
      answer: "a",
      explanation:
        "Câu khuyên đừng vứt điện thoại cũ lung tung → “throw away”. Ví dụ: “Never throw away medicine in sinks.”",
      whyWrong: {
        b: "“Raise awareness” đúng khi nâng cao hiểu biết cộng đồng, ví dụ: “Posters raise awareness about recycling.”",
        c: "“Cut down” đúng khi đốn cây hoặc giảm lượng, ví dụ: “We must cut down on plastic bags.”",
        d: "“Break down” đúng khi phân hủy hoặc hỏng máy, ví dụ: “Food scraps break down in compost.”",
      },
    }),
    mcq({
      id: "env-5",
      difficulty: "medium",
      stem: "Pandas are ___ because their bamboo forests keep shrinking.",
      choices: {
        a: "renewable",
        b: "sustainable",
        c: "endangered",
        d: "recycled",
      },
      answer: "c",
      explanation:
        "Loài bị đe dọa vì mất rừng trúc → “endangered”. Ví dụ: “Several whales remain endangered.”",
      whyWrong: {
        a: "“Renewable” đúng với nguồn năng lượng có thể tái tạo, ví dụ: “Solar power is renewable.”",
        b: "“Sustainable” đúng khi mô tả cách làm bền vững, ví dụ: “Sustainable tourism protects beaches.”",
        d: "“Recycled” đúng khi nói vật liệu đã tái chế, ví dụ: “This bag is made of recycled plastic.”",
      },
    }),
    mcq({
      id: "env-6",
      difficulty: "medium",
      stem: "Governments hope ___ will replace coal in most power plants.",
      choices: {
        a: "climate change",
        b: "renewable energy",
        c: "carbon footprint",
        d: "air pollution",
      },
      answer: "b",
      explanation:
        "Thay than bằng gió, mặt trời… là chuyển sang “renewable energy”. Ví dụ: “The country invests in renewable energy.”",
      whyWrong: {
        a: "“Climate change” đúng khi nói biến đổi khí hậu toàn cầu, ví dụ: “Climate change affects rainfall.”",
        c: "“Carbon footprint” đúng khi nói lượng phát thải của cá nhân hoặc tổ chức, ví dụ: “Flying increases your carbon footprint.”",
        d: "“Air pollution” đúng khi nói ô nhiễm không khí, ví dụ: “Air pollution triggers asthma.”",
      },
    }),
    mcq({
      id: "env-7",
      difficulty: "medium",
      stem: "A severe ___ left rivers empty and farmers without enough water for rice.",
      choices: {
        a: "emission",
        b: "habitat",
        c: "drought",
        d: "recycle",
      },
      answer: "c",
      explanation:
        "Thiếu mưa kéo dài khiến sông cạn → “drought”. Ví dụ: “During the drought, wells ran dry.”",
      whyWrong: {
        a: "“Emission” đúng khi nói khí thải, ví dụ: “New rules limit vehicle emissions.”",
        b: "“Habitat” đúng khi nói môi trường sống của loài, ví dụ: “Wetlands are a vital habitat.”",
        d: "“Recycle” đúng khi tái chế vật liệu, ví dụ: “Cities recycle aluminium cans.”",
      },
    }),
    mcq({
      id: "env-8",
      difficulty: "medium",
      stem: "School clubs organise events to ___ of ocean plastic among teenagers.",
      choices: {
        a: "raise awareness",
        b: "throw away",
        c: "cut down trees",
        d: "burn fossil fuels",
      },
      answer: "a",
      explanation:
        "Tổ chức sự kiện để mọi người hiểu hơn về rác nhựa → “raise awareness”. Ví dụ: “Videos raise awareness of wildlife crime.”",
      whyWrong: {
        b: "“Throw away” đúng khi vứt đồ, ví dụ: “Shoppers throw away too much packaging.”",
        c: "“Cut down trees” đúng khi đốn cây, ví dụ: “Illegal loggers cut down trees at night.”",
        d: "“Burn fossil fuels” đúng khi đốt than, dầu, khí, ví dụ: “Power stations burn fossil fuels.”",
      },
    }),
    mcq({
      id: "env-9",
      difficulty: "hard",
      stem: "Building roads through the forest destroyed the ___ of several rare mammals.",
      choices: {
        a: "pollution",
        b: "habitat",
        c: "emission",
        d: "drought",
      },
      answer: "b",
      explanation:
        "Mất nơi sống tự nhiên của loài thú → “habitat”. Ví dụ: “Oil spills damage coastal habitats.”",
      whyWrong: {
        a: "“Pollution” đúng khi nói tình trạng ô nhiễm, ví dụ: “Noise pollution disturbs birds.”",
        c: "“Emission” đúng khi nói lượng khí thải, ví dụ: “Shipping emissions are rising.”",
        d: "“Drought” đúng khi nói hạn hán, ví dụ: “The drought forced cattle farmers to move.”",
      },
    }),
    mcq({
      id: "env-10",
      difficulty: "hard",
      stem: "Companies must report annual carbon ___ and show a clear plan to reduce them.",
      choices: {
        a: "habitats",
        b: "droughts",
        c: "emissions",
        d: "curricula",
      },
      answer: "c",
      explanation:
        "Báo cáo lượng khí carbon phát ra hàng năm → “emissions”. Ví dụ: “Stricter laws cut industrial emissions.”",
      whyWrong: {
        a: "“Habitats” đúng khi nói các môi trường sống, ví dụ: “Protected habitats support biodiversity.”",
        b: "“Droughts” đúng khi nói các đợt hạn, ví dụ: “Frequent droughts threaten food security.”",
        d: "“Curricula” đúng trong chủ đề giáo dục, ví dụ: “National curricula include climate topics.”",
      },
    }),
    mcq({
      id: "env-11",
      difficulty: "hard",
      stem: "Choosing local food and fewer flights is one way to shrink your ___.",
      choices: {
        a: "carbon footprint",
        b: "renewable energy",
        c: "climate change",
        d: "natural habitat",
      },
      answer: "a",
      explanation:
        "Giảm dấu ấn phát thải cá nhân → “carbon footprint”. Ví dụ: “Cycling lowers your carbon footprint.”",
      whyWrong: {
        b: "“Renewable energy” đúng khi nói nguồn điện sạch, ví dụ: “The factory runs on renewable energy.”",
        c: "“Climate change” đúng khi nói hiện tượng khí hậu toàn cầu, ví dụ: “Climate change melts glaciers.”",
        d: "“Natural habitat” đúng khi nói nơi sống tự nhiên, ví dụ: “Mangroves are a natural habitat for crabs.”",
      },
    }),
    mcq({
      id: "env-12",
      difficulty: "hard",
      stem: "The village wants ___ tourism that brings income without damaging coral reefs.",
      choices: {
        a: "endangered",
        b: "polluted",
        c: "sustainable",
        d: "extinct",
      },
      answer: "c",
      explanation:
        "Du lịch mang lại thu nhập mà không phá rạn san hô → “sustainable”. Ví dụ: “Sustainable fishing protects fish stocks.”",
      whyWrong: {
        a: "“Endangered” đúng khi mô tả loài bị đe dọa, ví dụ: “The eagle is endangered here.”",
        b: "“Polluted” đúng khi nói đã bị ô nhiễm, ví dụ: “The polluted lake cannot support life.”",
        d: "“Extinct” đúng khi loài đã tuyệt chủng, ví dụ: “The dodo is extinct.”",
      },
    }),
  ],
};
