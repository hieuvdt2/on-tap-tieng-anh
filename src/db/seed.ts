import { config } from "dotenv";
import { eq, isNull, sql as dsql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { STUDENT_ID } from "./constants";
import { curriculum } from "./content";
import { orderingItems, orderingTopic, passages, practiceExam, readingTopic } from "./content/exam/items";
import { paperAExam, paperAQuestions, paperAStimuli } from "./content/exam/paper-a";
import { paperBExam, paperBQuestions, paperBStimuli } from "./content/exam/paper-b";
import { paperCExam, paperCHash, paperCQuestions, paperCStimuli } from "./content/exam/paper-c";
import { isVocabularyTopic } from "./content/types";
import { assertValidCurriculum } from "./content/validate";
import { contentHash } from "./hash";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { buildFamilies } from "../modules/vocabulary/family";
import { isCefrLevel } from "../modules/levels/cefr";
import { isWordTheme, TOPIC_TO_THEME } from "../modules/vocabulary/themes";
import { headwordKey } from "../modules/vocabulary/validate";
import {
  examSpecifications,
  grammarTopics,
  questions,
  stimuli,
  vocabularyTopics,
  vocabWords,
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
      // Từ tự soạn của chủ đề cũng nằm trong kho từ để học/ôn lặp lại. Chỉ thêm nếu chưa có.
      for (const item of topic.items) {
        const key = headwordKey(item.word);
        await db
          .insert(vocabWords)
          .values({
            id: `vw-${key.replace(/[^a-z0-9]+/g, "-")}`,
            headword: item.word,
            headwordKey: key,
            wordClass: item.wordClass,
            meaningVi: item.meaningVi,
            example: item.example,
            note: item.note,
            topicId: topic.id,
            theme: TOPIC_TO_THEME[topic.slug] ?? null,
            provenance: "original",
          })
          .onConflictDoUpdate({
            target: vocabWords.headwordKey,
            set: { theme: TOPIC_TO_THEME[topic.slug] ?? null },
            setWhere: isNull(vocabWords.theme),
          });
      }
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
        translationVi: question.translationVi ?? null,
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
            translationVi: row.translationVi,
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
        translationVi: question.translationVi ?? null,
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
      translationVi: question.translationVi ?? null,
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
      translationVi: question.translationVi ?? null,
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

  for (const stimulus of paperCStimuli) {
    const wordCount = stimulus.body.split(/\s+/).filter(Boolean).length;
    await db
      .insert(stimuli)
      .values({ ...stimulus, wordCount })
      .onConflictDoUpdate({
        target: stimuli.id,
        set: { ...stimulus, wordCount },
      });
  }

  for (const question of paperCQuestions) {
    const row = {
      id: question.id,
      type: question.type,
      stimulusId: question.stimulusId,
      stem: question.stem,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      wrongAnswerExplanations: question.wrongAnswerExplanations,
      translationVi: question.translationVi ?? null,
      difficulty: question.difficulty,
      topicId: question.topicId,
      grade: question.grade,
      status: "published",
      provenance: "original",
      contentHash: paperCHash(question),
      duplicateOfId: null,
    };
    await db.insert(questions).values(row).onConflictDoUpdate({
      target: questions.id,
      set: row,
    });
  }

  await db
    .insert(examSpecifications)
    .values(paperCExam)
    .onConflictDoUpdate({
      target: examSpecifications.id,
      set: paperCExam,
    });

  const stored = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.status, "published"));
    // Từ vựng bổ sung do AI tạo hàng loạt rồi đã duyệt (scripts/generate-vocab.ts). Chỉ thêm nếu chưa có.
  const extraFile = path.join(process.cwd(), "src/db/content/vocabulary/extra-words.json");
  if (existsSync(extraFile)) {
    const extra = JSON.parse(readFileSync(extraFile, "utf8")) as {
      topicSlug: string;
      word: string;
      wordClass: string;
      ipa: string | null;
      meaningVi: string;
      example: string;
      note: string;
    }[];
    const topicIdBySlug = new Map(curriculum.map((topic) => [topic.slug, topic.id]));
    for (const item of extra) {
      const topicId = topicIdBySlug.get(item.topicSlug);
      if (!topicId) continue;
      const key = headwordKey(item.word);
      await db
        .insert(vocabWords)
        .values({
          id: `vw-${key.replace(/[^a-z0-9]+/g, "-")}`,
          headword: item.word,
          headwordKey: key,
          wordClass: item.wordClass,
          ipa: item.ipa,
          meaningVi: item.meaningVi,
          example: item.example,
          note: item.note,
          topicId,
          theme: TOPIC_TO_THEME[item.topicSlug] ?? null,
          provenance: "ai_generated",
        })
        .onConflictDoUpdate({
          target: vocabWords.headwordKey,
          set: { theme: TOPIC_TO_THEME[item.topicSlug] ?? null },
          setWhere: isNull(vocabWords.theme),
        });
    }
    console.log(`Từ vựng bổ sung: ${extra.length} mục trong extra-words.json`);
  }

  // Danh sách ~3.000 từ thông dụng (nguồn: file người dùng cung cấp). Nghĩa chưa được kiểm duyệt nên
  // gắn provenance "imported"; app hiển thị nhãn "chưa kiểm" và cho báo nghĩa sai.
  const oxfordFile = path.join(process.cwd(), "src/db/content/vocabulary/oxford-3000.json");
  if (existsSync(oxfordFile)) {
    const words = JSON.parse(readFileSync(oxfordFile, "utf8")) as { word: string; pos: string; meaningVi: string }[];
    const themesFile = path.join(process.cwd(), "src/db/content/vocabulary/themes.json");
    const themeOf: Record<string, string> = existsSync(themesFile) ? JSON.parse(readFileSync(themesFile, "utf8")) : {};
    for (const item of words) {
      const key = headwordKey(item.word);
      const theme = isWordTheme(themeOf[item.word]) ? themeOf[item.word] : null;
      await db
        .insert(vocabWords)
        .values({
          id: `vw-${key.replace(/[^a-z0-9]+/g, "-")}`,
          headword: item.word,
          headwordKey: key,
          wordClass: item.pos,
          meaningVi: item.meaningVi,
          example: "",
          note: "",
          topicId: null,
          theme,
          provenance: "imported",
        })
        .onConflictDoUpdate({
          target: vocabWords.headwordKey,
          set: { theme },
          setWhere: isNull(vocabWords.theme),
        });
    }
    console.log(`Từ vựng nhập từ danh sách 3000: ${words.length} mục`);
  }

  // Họ từ: gom các dạng của cùng một từ dựa trên toàn bộ kho từ hiện có.
  const allWords = await db.select({ key: vocabWords.headwordKey, family: vocabWords.family }).from(vocabWords);
  const families = buildFamilies(allWords.map((row) => row.key));
  let familyUpdates = 0;
  for (const row of allWords) {
    const family = families.get(row.key) ?? row.key;
    if (row.family === family) continue;
    await db.update(vocabWords).set({ family }).where(eq(vocabWords.headwordKey, row.key));
    familyUpdates += 1;
  }
  console.log(`Họ từ: cập nhật ${familyUpdates} từ`);

  // Phiên âm Mỹ (scripts/vocab-ipa.ts). Chỉ điền cho từ chưa có phiên âm, cập nhật hàng loạt trong một lệnh.
  const ipaFile = path.join(process.cwd(), "src/db/content/vocabulary/ipa.json");
  if (existsSync(ipaFile)) {
    const ipa = JSON.parse(readFileSync(ipaFile, "utf8")) as Record<string, string>;
    const byKey = Object.fromEntries(Object.entries(ipa).map(([word, value]) => [headwordKey(word), value]));
    await db.execute(dsql`
      update vocab_word set ipa = v.value
      from jsonb_each_text(${JSON.stringify(byKey)}::jsonb) as v(key, value)
      where vocab_word.headword_key = v.key and vocab_word.ipa is null
    `);
    console.log(`Phiên âm: ${Object.keys(byKey).length} từ có trong ipa.json`);
  }

  // Câu theo trình độ CEFR (src/db/content/cefr/questions.json): câu độc lập + đoạn đọc/đoạn nghe có câu hỏi.
  for (const cefrName of ["questions.json", "ai-generated.json"]) {
    const cefrFile = path.join(process.cwd(), "src/db/content/cefr", cefrName);
    if (!existsSync(cefrFile)) continue;
    type CefrQuestion = {
      id: string; level: string; difficulty: string; stem: string; topicSlug?: string;
      options: { id: string; text: string }[]; correctAnswer: string; explanation: string;
      wrongAnswerExplanations: { optionId: string; explanation: string }[]; translationVi?: string;
    };
    const doc = JSON.parse(readFileSync(cefrFile, "utf8")) as {
      questions: CefrQuestion[];
      groups: { id: string; kind: string; level: string; title: string; body: string; questions: CefrQuestion[] }[];
    };
    const topicBySlug = new Map(curriculum.map((topic) => [topic.slug, topic]));
    const source = cefrName === "ai-generated.json" ? "ai" : "authored";
    const upsertQuestion = async (item: CefrQuestion, topic: { id: string; gradeFrom: number }, stimulusId: string | null) => {
      if (!isCefrLevel(item.level)) throw new Error(`CEFR không hợp lệ: ${item.id}`);
      const row = {
        id: item.id,
        type: "single_choice",
        stimulusId,
        stem: item.stem,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        wrongAnswerExplanations: item.wrongAnswerExplanations,
        translationVi: item.translationVi ?? null,
        difficulty: item.difficulty,
        cefr: item.level,
        cefrSource: source,
        topicId: topic.id,
        grade: topic.gradeFrom,
        status: "published",
        provenance: "ai_generated",
        contentHash: contentHash(`${stimulusId ?? ""}\n${item.stem}`),
        duplicateOfId: null,
      };
      await db.insert(questions).values(row).onConflictDoUpdate({ target: questions.id, set: row });
    };
    for (const item of doc.questions) {
      const topic = topicBySlug.get(item.topicSlug ?? "");
      if (!topic) throw new Error(`Không có chủ đề ${item.topicSlug} cho ${item.id}`);
      await upsertQuestion(item, topic, null);
    }
    for (const group of doc.groups) {
      const wordCount = group.body.split(/\s+/).filter(Boolean).length;
      await db
        .insert(stimuli)
        .values({ id: group.id, kind: group.kind, title: group.title, body: group.body, topicId: readingTopic.id, wordCount })
        .onConflictDoUpdate({
          target: stimuli.id,
          set: { kind: group.kind, title: group.title, body: group.body, topicId: readingTopic.id, wordCount },
        });
      for (const item of group.questions) await upsertQuestion(item, readingTopic, group.id);
    }
    console.log(`Câu theo trình độ CEFR: ${doc.questions.length + doc.groups.reduce((n, g) => n + g.questions.length, 0)} câu`);
  }

  // Câu chưa có nhãn CEFR (câu THPT cũ, câu AI): ước lượng thô từ độ khó. Chỉ điền khi còn trống.
  await db.execute(dsql`
    update question set cefr = case difficulty when 'hard' then 'B2' when 'medium' then 'B1' else 'A2' end,
      cefr_source = 'heuristic'
    where cefr is null
  `);
  // Câu đã có cefr từ lần seed trước nhưng chưa ghi nguồn: đều là ước lượng thô.
  await db.execute(dsql`update question set cefr_source = 'heuristic' where cefr is not null and cefr_source is null`);

console.log(
    `Seeded ${curriculum.length} topics and ${stored.length} published questions.`,
  );
  await sql.end();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
