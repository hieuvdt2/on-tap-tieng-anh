const vietnameseNames: Record<string, string> = {
  "Present Simple": "Thì hiện tại đơn",
  "Present Continuous": "Thì hiện tại tiếp diễn",
  "Past Simple": "Thì quá khứ đơn",
  "Past Continuous": "Thì quá khứ tiếp diễn",
  "Present Perfect": "Thì hiện tại hoàn thành",
  "Past Simple và Present Perfect": "Phân biệt quá khứ đơn và hiện tại hoàn thành",
  "Future Forms": "Các cách nói tương lai",
  "Past Perfect": "Thì quá khứ hoàn thành",
  Articles: "Mạo từ a, an, the",
  "Countable and Uncountable Nouns": "Danh từ đếm được và không đếm được",
  Quantifiers: "Từ chỉ số lượng",
  "Comparatives and Superlatives": "So sánh hơn và so sánh nhất",
  "Prepositions of Time and Place": "Giới từ chỉ thời gian và nơi chốn",
  "Modals: can, could, should": "Động từ khuyết thiếu can, could, should",
  "Modals: Obligation and Possibility": "Động từ khuyết thiếu chỉ bắt buộc và khả năng",
  "Conditional Type 1": "Câu điều kiện loại 1",
  "Conditional Type 2": "Câu điều kiện loại 2",
  "Passive Voice": "Câu bị động",
  "Relative Clauses": "Mệnh đề quan hệ",
  "Gerund and Infinitive": "Danh động từ và động từ nguyên mẫu",
  "Reported Speech": "Câu tường thuật",
  "Wish and If Only": "Câu ước với wish và if only",
  "Word Formation": "Cấu tạo từ",
  "Conjunctions and Linking Words": "Liên từ và từ nối",
  Education: "Giáo dục",
  Environment: "Môi trường",
  Technology: "Công nghệ",
  Health: "Sức khỏe",
  Culture: "Văn hóa",
  Careers: "Nghề nghiệp",
  Community: "Cộng đồng",
  Media: "Truyền thông",
  Collocations: "Cụm từ cố định",
  "Phrasal Verbs": "Cụm động từ",
  "Dependent Prepositions": "Giới từ đi kèm",
  "Subject-Verb Agreement": "Hòa hợp chủ ngữ và động từ",
  Reading: "Đọc hiểu",
  "Sentence Ordering": "Sắp xếp câu",
};

export function topicVietnameseName(name: string) {
  return vietnameseNames[name] ?? null;
}

export function topicLabel(name: string) {
  const vietnamese = topicVietnameseName(name);
  return vietnamese ? `${name} (${vietnamese})` : name;
}
