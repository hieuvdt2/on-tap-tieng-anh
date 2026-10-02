import { contentHash } from "../hash";
import { isVocabularyTopic, type CurriculumTopic } from "./types";

export const QUESTIONS_PER_TOPIC = 12;

export function validateCurriculum(curriculum: readonly CurriculumTopic[]) {
  const issues: string[] = [];
  const slugs = new Set(curriculum.map((topic) => topic.slug));
  const questionIds = new Set<string>();
  const hashes = new Map<string, string>();

  if (slugs.size !== curriculum.length) {
    issues.push("Slug chủ đề bị trùng.");
  }

  for (const topic of curriculum) {
    if (isVocabularyTopic(topic)) {
      if (topic.items.length < 6) issues.push(`${topic.slug} cần ít nhất 6 mục từ.`);
      if (topic.collocations.length < 4) issues.push(`${topic.slug} cần ít nhất 4 cụm từ.`);
      if (topic.commonMistakes.length < 3) issues.push(`${topic.slug} cần ít nhất 3 lỗi hay gặp.`);
    } else if (topic.signalWords.length < 4) {
      issues.push(`${topic.slug} cần ít nhất 4 từ hoặc dấu hiệu nhận biết.`);
    }
    if (!isVocabularyTopic(topic) && topic.examples.length < 3) {
      issues.push(`${topic.slug} cần ít nhất 3 ví dụ.`);
    }
    if (!isVocabularyTopic(topic) && topic.commonMistakes.length < 3) {
      issues.push(`${topic.slug} cần ít nhất 3 lỗi hay gặp.`);
    }
    if (!isVocabularyTopic(topic) && topic.comparisons.length < 1) {
      issues.push(`${topic.slug} cần ít nhất 1 mục so sánh.`);
    }
    if (topic.questions.length !== QUESTIONS_PER_TOPIC) {
      issues.push(
        `${topic.slug} cần ${QUESTIONS_PER_TOPIC} câu, đang có ${topic.questions.length}.`,
      );
    }

    const counts = { easy: 0, medium: 0, hard: 0 };
    for (const question of topic.questions) {
      counts[question.difficulty] += 1;

      if (questionIds.has(question.id)) {
        issues.push(`ID câu hỏi bị trùng: ${question.id}.`);
      }
      questionIds.add(question.id);

      const hash = contentHash(question.stem);
      const existingId = hashes.get(hash);
      if (existingId) {
        issues.push(`Stem trùng giữa ${existingId} và ${question.id}.`);
      } else {
        hashes.set(hash, question.id);
      }

      if (question.options.length !== 4) {
        issues.push(`${question.id} phải có đúng 4 phương án.`);
      }
      if (
        new Set(question.options.map((option) => option.id)).size !==
        question.options.length
      ) {
        issues.push(`${question.id} có ID phương án bị trùng.`);
      }
      if (
        question.options.filter(
          (option) => option.id === question.correctAnswer,
        ).length !== 1
      ) {
        issues.push(`${question.id} không có đúng một đáp án khớp phương án.`);
      }
      if (question.wrongAnswerExplanations.length !== 3) {
        issues.push(`${question.id} phải giải thích đủ 3 phương án sai.`);
      }
      const expectedWrongIds = question.options
        .map((option) => option.id)
        .filter((id) => id !== question.correctAnswer)
        .sort();
      const explainedWrongIds = question.wrongAnswerExplanations
        .map((item) => item.optionId)
        .sort();
      if (expectedWrongIds.join(",") !== explainedWrongIds.join(",")) {
        issues.push(`${question.id} giải thích sai tập phương án nhiễu.`);
      }
    }

    const difficultyCounts = Object.values(counts);
    if (Math.max(...difficultyCounts) - Math.min(...difficultyCounts) > 1) {
      issues.push(
        `${topic.slug} lệch mức khó: easy=${counts.easy}, medium=${counts.medium}, hard=${counts.hard}.`,
      );
    }

    for (const prerequisite of topic.prerequisiteSlugs) {
      if (!slugs.has(prerequisite)) {
        issues.push(
          `${topic.slug} trỏ prerequisite không tồn tại: ${prerequisite}.`,
        );
      }
    }
  }

  return issues;
}

export function assertValidCurriculum(curriculum: readonly CurriculumTopic[]) {
  const issues = validateCurriculum(curriculum);
  if (issues.length > 0) {
    throw new Error(`Nội dung seed không hợp lệ:\n- ${issues.join("\n- ")}`);
  }
}
