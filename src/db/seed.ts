import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { STUDENT_ID } from "./constants";
import { curriculum } from "./content";
import { orderingItems, orderingTopic, passages, practiceExam, readingTopic } from "./content/exam/items";
import { paperAExam, paperAQuestions, paperAStimuli } from "./content/exam/paper-a";
import { paperBExam, paperBQuestions, paperBStimuli } from "./content/exam/paper-b";
import { isVocabularyTopic } from "./content/types";
import { assertValidCurriculum } from "./content/validate";
import { contentHash } from "./hash";
import {
  examSpecifications,
  grammarTopics,
  questions,
  stimuli,
  vocabularyTopics,
  topics,
  users,
} from "./schema";

config({ path: ".env.local" });

const examNotes = "version 1";

async function main() {
  assertValidCurriculum(curriculum);
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");

  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);

  await db
    .insert(users)
    .values({ id: STUDENT_ID, name: "Học sinh" })
    .onConflictDoNothing();

  for (const topic of curriculum) {
    const topicRow = {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      skill: isVocabularyTopic(topic) ? "vocabulary" : "grammar",
      gradeFrom: topic.gradeFrom,
      gradeTo: topic.gradeTo,
      summary: topic.summary,
    };
    await db
      .insert(topics)
      .values(topicRow)
      .onConflictDoUpdate({
        target: topics.id,
        set: {
          slug: topicRow.slug,
          name: topicRow.name,
          skill: topicRow.skill,
          gradeFrom: topicRow.gradeFrom,
          gradeTo: topicRow.gradeTo,
          summary: topicRow.summary,
        },
      });

    if (isVocabularyTopic(topic)) {
      const vocabularyRow = {
        topicId: topic.id,
        overview: topic.overview,
        items: topic.items,
        collocations: topic.collocations,
        commonMistakes: topic.commonMistakes,
        prerequisiteSlugs: topic.prerequisiteSlugs,
      };
      await db.insert(vocabularyTopics).values(vocabularyRow).onConflictDoUpdate({
        target: vocabularyTopics.topicId,
        set: vocabularyRow,
      });
    } else {
    const grammarRow = {
      topicId: topic.id,
      purpose: topic.purpose,
      usage: topic.usage,
      structure: topic.structure,
      affirmativePattern: topic.affirmativePattern,
      negativePattern: topic.negativePattern,
      questionPattern: topic.questionPattern,
      signalWords: topic.signalWords,
      examples: topic.examples,
      commonMistakes: topic.commonMistakes,
      comparisons: topic.comparisons,
      prerequisiteSlugs: topic.prerequisiteSlugs,
    };
    await db.insert(grammarTopics).values(grammarRow).onConflictDoUpdate({
      target: grammarTopics.topicId,
      set: grammarRow,
    });
    }

    for (const question of topic.questions) {
      const row = {
        id: question.id,
        type: "single_choice",
        stimulusId: null,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        wrongAnswerExplanations: question.wrongAnswerExplanations,
        difficulty: question.difficulty,
        topicId: topic.id,
        grade: topic.gradeFrom,
        status: "published",
        provenance: "original",
        contentHash: contentHash(question.stem),
        duplicateOfId: null,
      };
      await db
        .insert(questions)
        .values(row)
        .onConflictDoUpdate({
          target: questions.id,
          set: {
            type: row.type,
            stimulusId: row.stimulusId,
            stem: row.stem,
            options: row.options,
            correctAnswer: row.correctAnswer,
            explanation: row.explanation,
            wrongAnswerExplanations: row.wrongAnswerExplanations,
            difficulty: row.difficulty,
            topicId: row.topicId,
            grade: row.grade,
            status: row.status,
            provenance: row.provenance,
            contentHash: row.contentHash,
            duplicateOfId: row.duplicateOfId,
          },
        });
    }
  }

  for (const topic of [readingTopic, orderingTopic]) {
    await db
      .insert(topics)
      .values(topic)
      .onConflictDoUpdate({
        target: topics.id,
        set: {
          slug: topic.slug,
          name: topic.name,
          skill: topic.skill,
          gradeFrom: topic.gradeFrom,
          gradeTo: topic.gradeTo,
          summary: topic.summary,
        },
      });
  }

  for (const passage of passages) {
    const wordCount = passage.body.split(/\s+/).filter(Boolean).length;
    await db
      .insert(stimuli)
      .values({
        id: passage.id,
        kind: "passage",
        title: passage.title,
        body: passage.body,
        topicId: readingTopic.id,
        wordCount,
      })
      .onConflictDoUpdate({
        target: stimuli.id,
        set: {
          kind: "passage",
          title: passage.title,
          body: passage.body,
          topicId: readingTopic.id,
          wordCount,
        },
      });

    for (const question of passage.questions) {
      const row = {
        id: question.id,
        type: "single_choice",
        stimulusId: passage.id,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        wrongAnswerExplanations: question.wrongAnswerExplanations,
        difficulty: question.difficulty,
        topicId: readingTopic.id,
        grade: readingTopic.gradeFrom,
        status: "published",
        provenance: "original",
        contentHash: contentHash(question.stem),
        duplicateOfId: null,
      };
      await db.insert(questions).values(row).onConflictDoUpdate({
        target: questions.id,
        set: row,
      });
    }
  }

  for (const item of orderingItems) {
    const wordCount = item.prompt.split(/\s+/).filter(Boolean).length;
    await db
      .insert(stimuli)
      .values({
        id: item.id,
        kind: "ordering_prompt",
        title: item.title,
        body: item.prompt,
        topicId: orderingTopic.id,
        wordCount,
      })
      .onConflictDoUpdate({
        target: stimuli.id,
        set: {
          kind: "ordering_prompt",
          title: item.title,
          body: item.prompt,
          topicId: orderingTopic.id,
          wordCount,
        },
      });

    const row = {
      id: item.id,
      type: "ordering",
      stimulusId: item.id,
      stem: item.prompt,
      options: item.sentences,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      wrongAnswerExplanations: [],
      difficulty: "medium",
      topicId: orderingTopic.id,
      grade: orderingTopic.gradeFrom,
      status: "published",
      provenance: "original",
      contentHash: contentHash(`${item.id} ${item.prompt}`),
      duplicateOfId: null,
    };
    await db.insert(questions).values(row).onConflictDoUpdate({
      target: questions.id,
      set: row,
    });
  }

  for (const stimulus of paperAStimuli) {
    const wordCount = stimulus.body.split(/\s+/).filter(Boolean).length;
    await db
      .insert(stimuli)
      .values({ ...stimulus, wordCount })
      .onConflictDoUpdate({
        target: stimuli.id,
        set: { ...stimulus, wordCount },
      });
  }

  for (const question of paperAQuestions) {
    const row = {
      id: question.id,
      type: question.type,
      stimulusId: question.stimulusId,
      stem: question.stem,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      wrongAnswerExplanations: question.wrongAnswerExplanations,
      difficulty: question.difficulty,
      topicId: question.topicId,
      grade: question.grade,
      status: "published",
      provenance: "original",
      contentHash: contentHash(question.stem),
      duplicateOfId: null,
    };
    await db.insert(questions).values(row).onConflictDoUpdate({
      target: questions.id,
      set: row,
    });
  }

  await db
    .insert(examSpecifications)
    .values({
      id: "exam-2025-v1",
      yearLabel: "2025+",
      version: "1",
      status: "provisional",
      source: "Quyết định 764/QĐ-BGDĐT ngày 08/03/2024",
      questionCount: 40,
      durationMinutes: 50,
      sections: [
        {
          questionType: "gap_short",
          label: "Điền từ hoặc cụm ngắn",
          count: 12,
        },
        { questionType: "ordering", label: "Sắp xếp câu", count: 5 },
        { questionType: "gap_long", label: "Điền câu hoặc cụm dài", count: 5 },
        { questionType: "reading", label: "Đọc hiểu", count: 18 },
      ],
      notes: examNotes,
    })
    .onConflictDoUpdate({
      target: examSpecifications.id,
      set: {
        yearLabel: "2025+",
        version: "1",
        status: "provisional",
        source: "Quyết định 764/QĐ-BGDĐT ngày 08/03/2024",
        questionCount: 40,
        durationMinutes: 50,
        sections: [
          {
            questionType: "gap_short",
            label: "Điền từ hoặc cụm ngắn",
            count: 12,
          },
          { questionType: "ordering", label: "Sắp xếp câu", count: 5 },
          {
            questionType: "gap_long",
            label: "Điền câu hoặc cụm dài",
            count: 5,
          },
          { questionType: "reading", label: "Đọc hiểu", count: 18 },
        ],
        notes: examNotes,
      },
    });

  await db
    .insert(examSpecifications)
    .values(practiceExam)
    .onConflictDoUpdate({
      target: examSpecifications.id,
      set: practiceExam,
    });

  await db
    .insert(examSpecifications)
    .values(paperAExam)
    .onConflictDoUpdate({
      target: examSpecifications.id,
      set: paperAExam,
    });

  for (const stimulus of paperBStimuli) {
    const wordCount = stimulus.body.split(/\s+/).filter(Boolean).length;
    await db
      .insert(stimuli)
      .values({ ...stimulus, wordCount })
      .onConflictDoUpdate({
        target: stimuli.id,
        set: { ...stimulus, wordCount },
      });
  }

  for (const question of paperBQuestions) {
    const row = {
      id: question.id,
      type: question.type,
      stimulusId: question.stimulusId,
      stem: question.stem,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      wrongAnswerExplanations: question.wrongAnswerExplanations,
      difficulty: question.difficulty,
      topicId: question.topicId,
      grade: question.grade,
      status: "published",
      provenance: "original",
      contentHash: contentHash(question.stem),
      duplicateOfId: null,
    };
    await db.insert(questions).values(row).onConflictDoUpdate({
      target: questions.id,
      set: row,
    });
  }

  await db
    .insert(examSpecifications)
    .values(paperBExam)
    .onConflictDoUpdate({
      target: examSpecifications.id,
      set: paperBExam,
    });

  const stored = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.status, "published"));
  console.log(
    `Seeded ${curriculum.length} topics and ${stored.length} published questions.`,
  );
  await sql.end();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
