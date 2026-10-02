# Kế hoạch làm app

Nền tảng ôn tiếng Anh cho kỳ thi tốt nghiệp THPT, dành cho học sinh Việt Nam. File này là thứ tự làm việc sau khi đã đọc `readme.md` và cắt những phần chưa cần. Làm từ Pha 1 đến Pha 5. Không nhảy pha, không mở lại các mục trong phần "Không làm".

Nguyên tắc sản phẩm:

```text
tri thức có cấu trúc
+ ngân hàng câu đã kiểm tra
+ AI sinh câu và giải thích, kiểm tra bằng code rồi dùng ngay
+ hồ sơ học tính bằng code
```

AI không phải cơ sở dữ liệu. App vẫn học, luyện, chấm, ôn lỗi khi nhà cung cấp AI tắt.

App này cho một người dùng. Không có trang duyệt câu và không có vai admin. Câu AI chỉ vào phiên luyện sau khi code kiểm tra đủ 4 phương án, một đáp án đúng, có lời giải và không trùng câu đã có.

## Cách dùng file này

Mỗi pha có việc cần làm, file chính, và việc kiểm tra trước khi sang pha sau. Khi code một pha, chỉ tạo bảng và trang của pha đó. Cột để dành cho pha sau thì thêm nullable từ Pha 1 nếu kế hoạch đã ghi, không tạo cả cụm bảng cho vui.

## Đã khóa

| Việc | Chọn |
| --- | --- |
| App | Một Next.js: App Router, TypeScript, Tailwind, shadcn/ui |
| Dữ liệu | PostgreSQL 16, Drizzle, Zod |
| Thư mục | `src/app` render, `src/modules` chứa logic, `src/db` chứa schema |
| Giao diện | Tiếng Việt. Câu hỏi, ví dụ, đoạn văn bằng tiếng Anh |
| Chấm điểm, mastery, chọn câu, giờ thi | Code thường, không gọi AI |
| AI | Interface `AIProvider`. Pha 2 chỉ Gemini và mock. Groq, Ollama ở Pha 5 |
| Bí mật | Chỉ biến server. Cấm `NEXT_PUBLIC_` cho API key |
| Câu học sinh thấy | Chỉ `published`. Câu AI vào `draft` |
| Độ thành thạo trên UI | Ba mức: yếu, đang học, vững. Không hiện số kiểu 72.38% |
| Đề thi | Bản dữ liệu có version. Chưa có văn bản 2027 riêng thì `status = provisional` |
| Người dùng Pha 1–4 | Một học sinh seed, cookie session |
| Hàng đợi | Không Redis. Sinh câu đồng bộ, giới hạn số lượng |

## Không làm

Những mục này không có trong năm pha. Không thêm vì spec gốc có nhắc.

- Monorepo nhiều package
- Redis, BullMQ, vector database riêng (Pinecone, Qdrant)
- Gọi AI lần hai để duyệt mọi câu
- OAuth, nhiều vai, tài khoản giáo viên
- Nghe, nói, viết như sản phẩm riêng
- Chép ngân hàng đề của bên thứ ba
- Ghi một giả định thành "quy chế 2027 đã chốt"
- Tỉ lệ trộn 60/25/15 trước Pha 5

## Việc đã biết về đề

Ghi vào `exam_specification`, kèm mức chắc chắn. Không trộn các mức này trong UI.

| Nội dung | Mức | Nguồn |
| --- | --- | --- |
| Từ năm 2025 có cấu trúc định dạng đề chính thức | Đã có văn bản | Quyết định 764/QĐ-BGDĐT, 08/03/2024 |
| Ngoại ngữ chỉ dùng trắc nghiệm 4 phương án, một đáp án. Không dùng đúng/sai và trả lời ngắn như môn Toán | Theo mô tả format 2025 của Bộ | Công bố đề minh họa từ 2025 |
| Tiếng Anh 2025: 40 câu, 50 phút, 0.25 điểm mỗi câu | Theo đề đã thi và bài phân tích đề | Đề tốt nghiệp 2025, chương trình 2018 |
| Bốn dạng: điền từ/cụm ngắn (12), sắp xếp câu (5), điền câu/cụm dài (5), đọc hiểu (18) | Theo đề 2025 và các bài tổng hợp ma trận | Chưa nhét nguyên văn phụ lục QĐ 764 vào repo |
| Năm 2027 có bản sửa riêng | Chưa thấy | Để `provisional` đến khi có văn bản |

Trang thi thử phải hiện dòng: cấu trúc đang theo định dạng từ 2025, chưa phải bản 2027 đã ban hành.

## Bản đồ pha

Pha 1 đã xong: app chạy, 8 chủ đề, 48 câu. Kho này chỉ để thử vòng học, chưa đủ để ôn thi.

| Pha | Học sinh làm được thêm | Chưa có |
| --- | --- | --- |
| 1 | Học ngữ pháp, luyện trắc nghiệm, xem lời giải có sẵn, thấy điểm yếu | Mọi cuộc gọi AI |
| 1B | Kho ngữ pháp và từ vựng đủ để luyện nhiều vòng, bài học dày hơn | AI, bài đọc, đề thi thử |
| 2 | Bắt đầu luyện là sinh câu mới, kiểm tra rồi làm ngay. Sai thì đọc giải thích kiểu giáo viên | Đề thi thử, đọc hiểu nhiều câu |
| 3 | Làm bài đọc, sắp xếp câu, thi thử, làm bài chẩn đoán | RAG, Groq, Ollama |
| 4 | Giải thích và câu sinh ra bám đoạn tri thức đã nhập | Groq, Ollama, luyện trộn |
| 5 | Đổi provider bằng env, luyện trộn điểm yếu | — |

## Cây thư mục lúc xong Pha 5

Tạo thư mục khi tới pha ghi bên cạnh. Pha 1 không tạo `ai/`, `exam/`, `knowledge/`, `admin/`.

```text
docker-compose.yml
drizzle.config.ts
PLAN.md
src/
  app/
    layout.tsx
    page.tsx                         Pha 1 dashboard
    learn/page.tsx
    learn/[slug]/page.tsx
    practice/page.tsx
    practice/[sessionId]/page.tsx
    review/page.tsx
    progress/page.tsx
    diagnostic/page.tsx              Pha 3
    mock-exam/page.tsx               Pha 3
    mock-exam/[sessionId]/page.tsx   Pha 3
  db/
    client.ts
    schema.ts
    seed.ts
  modules/
    curriculum/                      Pha 1
    questions/                       Pha 1, mở rộng Pha 2–3
    practice/                        Pha 1
    learning/                        Pha 1, mở rộng Pha 3 và 5
    ai/                              Pha 2
      providers/
      prompts/
    exam/                            Pha 3
    knowledge/                       Pha 4
  components/
```

## Schema

Kiểu JSON để trong cột `jsonb`. Zod kiểm ở biên ghi.

### Pha 1

**user** — `id`, `name`, `createdAt`

**topic** — `id`, `slug`, `name`, `skill` (`grammar` \| `vocabulary` \| `reading`), `gradeFrom`, `gradeTo`, `summary`

**grammar_topic** — một-một với topic ngữ pháp. `topicId`, `purpose`, `usage`, `structure`, `affirmativePattern`, `negativePattern`, `questionPattern`, `signalWords`, `examples`, `commonMistakes`, `comparisons`, `prerequisiteSlugs`

**question** — `id`, `type`, `stimulusId` nullable, `stem`, `options`, `correctAnswer`, `explanation`, `wrongAnswerExplanations`, `difficulty` (`easy` \| `medium` \| `hard`), `topicId`, `grade`, `status` (`draft` \| `published` \| `archived`), `provenance` (`original` \| `ai_generated`), `contentHash`, `duplicateOfId` nullable, `createdAt`

Pha 1 chỉ ghi `type = single_choice`. `stimulusId` để trống.

**practice_session** — `id`, `userId`, `topicId` nullable, `mode` (`topic` \| `weakness` \| `quick`), `questionIds`, `startedAt`, `finishedAt`

**attempt** — `id`, `sessionId`, `userId`, `questionId`, `topicId`, `selectedAnswer`, `isCorrect`, `errorType`, `responseTimeMs`, `createdAt`

Pha 1 gán `errorType`: câu sai trong phiên theo chủ đề thì `GRAMMAR_RULE`, còn lại `UNKNOWN`.

**topic_mastery** — `userId`, `topicId`, `attempts`, `correct`, `masteryScore` từ 0 đến 1, `level` (`weak` \| `learning` \| `solid`), `lastPracticedAt`

```text
mastery = recentAccuracy * 0.40
        + historicalAccuracy * 0.25
        + difficultyPerformance * 0.20
        + consistency * 0.15
```

Trọng số nằm một object trong `src/modules/learning/mastery.ts`. Ngưỡng: dưới 0.45 yếu, từ 0.45 đến dưới 0.75 đang học, từ 0.75 vững.

`recentAccuracy` là 5 lần gần nhất. `historicalAccuracy` là toàn bộ. `difficultyPerformance` cộng thêm khi đúng câu vừa và khó. `consistency` giảm khi đúng sai xen kẽ liên tiếp.

**exam_specification** — `id`, `yearLabel` (`2025+`), `version` (`1`), `status` (`provisional`), `source`, `questionCount` (`40`), `durationMinutes` (`50`), `sections` jsonb, `notes`

Seed một dòng. `sections` mô tả bốn dạng ở bảng nguồn bên trên, mỗi dạng có `questionType` và `count`. Chưa có màn thi.

### Pha 2

**ai_request_log** — `id`, `provider`, `model`, `operation`, `promptVersion`, `inputTokens`, `outputTokens`, `latencyMs`, `status`, `error`, `createdAt`

Token không có thì `null`. Không lưu prompt thô chứa đoạn học sinh nếu không cần debug. Không lưu API key.

**question** thêm `generationModel`, `promptVersion`, `validationNotes`

**attempt** thêm `explanationId` nullable

**teacher_explanation** — `id`, `attemptId`, `questionId`, `body` jsonb theo 10 mục dạy, `promptVersion`, `createdAt`

Giải thích sai được lưu để lần sau không gọi lại cùng một attempt.

### Pha 3

**stimulus** — `id`, `kind` (`passage` \| `ordering_prompt` \| `gap_text`), `title`, `body`, `topicId` nullable, `wordCount`

**question** dùng `type`:

| type | Cách trả lời | correctAnswer |
| --- | --- | --- |
| `single_choice` | Một trong bốn lựa chọn | id phương án |
| `ordering` | Sắp xếp các câu | chuỗi id đúng thứ tự, ví dụ `b,a,d,c` |

Câu đọc hiểu vẫn là `single_choice`, nhiều câu chung một `stimulusId`.

**exam_session** — `id`, `userId`, `specificationId`, `questionIds`, `startedAt`, `endsAt`, `submittedAt`, `score` nullable

**diagnostic_session** — cùng hình dạng phiên luyện, `mode` cố định `diagnostic`, cộng `estimatedLevel` và `summary` khi nộp xong.

Không bảng mới cho chẩn đoán nếu phiên luyện đã chứa được `mode`. Thêm giá trị `diagnostic` vào `practice_session.mode`.

### Pha 4

**knowledge_source** — `id`, `title`, `publisher`, `sourceType`, `url`, `retrievedAt`, `trustLevel` (`official` \| `textbook` \| `teacher` \| `reference`), `license`, `contentHash`

**knowledge_document** — `id`, `sourceId`, `title`, `content`, `language`, `grade`, `topicId` nullable

**knowledge_chunk** — `id`, `documentId`, `content`, `topicId` nullable, `section`, `embedding` vector khi bật pgvector

Pha 4 bắt đầu bằng truy xuất theo `topicId` và từ khóa. Bật pgvector khi số chunk vượt khoảng 200 và truy xuất từ khóa bỏ sót bài liên quan. Không thêm database thứ hai.

### Pha 5

Không thêm `role` và không có trang duyệt. App một người dùng.

Không bảng mới cho Groq và Ollama.

## Seed Pha 1

Nội dung tự soạn. Không chép đề thi, sách giáo khoa, hay ngân hàng câu thương mại.

Tám chủ đề, mỗi chủ đề 6 câu `published` (2 dễ, 2 vừa, 2 khó):

1. Present Simple
2. Past Simple
3. Present Perfect
4. Past Simple và Present Perfect
5. Conditional Type 1
6. Conditional Type 2
7. Passive Voice
8. Relative Clauses

Một user tên `Học sinh`. Một `exam_specification` provisional.

`contentHash` = SHA-256 của stem đã đưa về chữ thường và gộp khoảng trắng.

## Pha 1 — Vòng học

App dùng được khi không có API key.

### Trang

| Route | Việc |
| --- | --- |
| `/` | Mức tổng quát, ba chủ đề cần ôn, bài học kế tiếp, lượt luyện kế tiếp |
| `/learn` | Danh sách chủ đề và mức |
| `/learn/[slug]` | Khái niệm, cách dùng, cấu trúc, từ tín hiệu, lỗi hay gặp, so sánh, nút luyện |
| `/practice` | Luyện một chủ đề, luyện điểm yếu, hoặc 5 câu nhanh |
| `/practice/[sessionId]` | Một câu một màn. Nộp thì chấm ngay và hiện lời giải đã lưu |
| `/review` | Lần sai gần đây, nhóm theo chủ đề |
| `/progress` | Số lần làm và mức từng chủ đề |

### Việc

1. `create-next-app` với TypeScript, Tailwind, App Router, thư mục `src/`. shadcn: button, card, badge. `docker-compose.yml` cho Postgres 16. Drizzle, script `db:push`, `db:seed`.
2. Schema Pha 1 và seed.
3. `listTopics()`, `getLesson(slug)`. Trang học.
4. `startSession`, `submitAnswer`, `finishSession`. Chấm bằng so khớp đáp án. Câu lấy từ `published`, khóa danh sách lúc tạo phiên.
5. Sau mỗi attempt, tính lại mastery của chủ đề đó. Dashboard, ôn lỗi, tiến độ.
6. Cookie gắn user seed.

Luyện điểm yếu: chủ đề mức yếu; nếu chưa có thì chủ đề ít lần làm nhất. Chưa trộn 60/25/15.

Lời giải trên màn lấy từ `explanation` và `wrongAnswerExplanations`.

### Xong pha khi

- Bài học hiện cấu trúc và lỗi hay gặp từ seed.
- Làm 5 câu, đáp án sai ra lời giải đúng chủ đề.
- Dashboard đổi mức sau khi làm.
- Xóa mọi key AI, luyện tập vẫn nộp được.

Pha 1 đã đạt các mục này. Không viết thêm tính năng vòng học. Việc kế tiếp là Pha 1B.

## Pha 1B — Kho nội dung

Làm trước Pha 2. AI sinh câu khi ngân hàng còn 48 câu sẽ bịa phần kiến thức đang thiếu.

Không chép sách giáo khoa, đề thi, hay ngân hàng câu thương mại. Nội dung tự soạn. Mỗi câu có đúng một đáp án. Lời giải tiếng Việt, ví dụ tiếng Anh.

**Trạng thái:** Đợt 1 đã hoàn thành ngày 02/10/2026: 24 chủ đề ngữ pháp, 288 câu.
Đợt 2 đã hoàn thành ngày 02/10/2026: thêm 12 chủ đề từ vựng và cụm, tổng 36 chủ đề, 432 câu published.
Bài từ vựng dùng `vocabulary_topic`, không dùng mẫu thì động từ.

### Vì sao tách khỏi Pha 2

Trang học đang chỉ đọc `grammar_topic`. Chủ đề từ vựng không nhét vào các trường ngữ pháp. Câu vẫn là `single_choice`. Chưa mở bài đọc và sắp xếp câu. Đó là Pha 3.

`src/db/seed-data.ts` đang chứa cả chương trình. Tách trước khi thêm câu, nếu không file không sửa được.

### Tách file

```text
src/db/content/
  types.ts
  index.ts
  grammar/
    present-simple.ts
    ...
  vocabulary/
    education.ts
    ...
```

`seed.ts` đọc `index.ts`. Mỗi file một chủ đề: bài học và câu của chủ đề đó. `TOPIC_ORDER` lấy từ thứ tự trong `index.ts`, không khai báo thêm một danh sách lệch.

Seed từ chối nếu:

- chủ đề không đủ số câu của đợt đang làm
- một mức khó lệch quá 1 câu so với các mức kia
- stem trùng hash
- thiếu lời giải cho phương án sai
- `prerequisiteSlugs` trỏ tới slug không có

### Bài học

Trang `/learn` nhóm theo khối, không đổ một danh sách dài.

Ngữ pháp giữ layout hiện tại. Mỗi bài phải có đủ: khái niệm, khi nào dùng, ba mẫu câu, ít nhất 3 ví dụ, ít nhất 4 từ tín hiệu, 3 lỗi hay gặp, 1 bài so sánh.

Từ vựng dùng bảng mới `vocabulary_topic`, một-một với `topic` khi `skill = vocabulary`:

```text
topicId
overview
items       jsonb: word, meaningVi, wordClass, example, note
collocations
commonMistakes
```

Trang bài từ vựng hiện các mục đó, rồi nút luyện. Không hiện mẫu khẳng định / phủ định / nghi vấn.

### Đợt 1 — Ngữ pháp

Nâng 8 chủ đề hiện có từ 6 lên 12 câu: 4 dễ, 4 vừa, 4 khó.

Thêm 16 chủ đề, mỗi chủ đề 12 câu. Tổng đợt 1: 24 chủ đề, 288 câu.

Nền, học trước các thì đã có:

1. Present Continuous
2. Past Continuous
3. Articles
4. Countable và uncountable nouns
5. Comparatives và superlatives
6. Prepositions of time và place
7. Modals: can, could, should
8. Quantifiers: some, any, much, many, a lot of

Hay gặp trong chỗ trống của đề:

9. Future forms: will, be going to, lịch hiện tại tiếp diễn
10. Past Perfect
11. Modals: must, have to, might
12. Gerund và infinitive
13. Reported speech
14. Wish và if only
15. Word formation
16. Conjunctions và linking words

`prerequisiteSlugs` nối thì mới với thì đã có. Present Continuous đứng trước Past Continuous. Past Simple đứng trước Past Perfect. Conditional Type 1 đứng trước Wish.

### Đợt 2 — Từ vựng và cụm

Chỉ mở khi đợt 1 đã seed và luyện được. Mỗi mục 12 câu. Thêm 144 câu. Tổng hai đợt: 432 câu published.

Tám chủ đề từ vựng theo nhóm nghĩa, không theo bài sách:

1. Education
2. Environment
3. Technology
4. Health
5. Culture
6. Careers
7. Community
8. Media

Bốn chủ đề dạng chỗ trống còn lại:

9. Collocations
10. Phrasal verbs
11. Dependent prepositions
12. Subject-verb agreement

Câu từ vựng kiểm tra nghĩa trong câu, không hỏi kiểu "từ này nghĩa là gì" tách khỏi ngữ cảnh. Word formation ở đợt 1: cho gốc từ, chọn dạng đúng trong câu.

### Không nhét vào 1B

- Gọi Gemini để viết hộ 288 câu
- Bài đọc nhiều câu, sắp xếp câu, thi thử
- Sửa công thức mastery
- Trang admin

### Xong đợt 1 khi

- `/learn` có 24 chủ đề, chia nhóm, bài mới mở được.
- Mỗi chủ đề có 12 câu published. Seed fail nếu thiếu.
- Luyện một chủ đề mới chấm được và lời giải đúng chủ đề đó.
- 15 test cũ vẫn xanh. Thêm một test: seed kiểm tra đủ câu thì hàm kiểm tra trả lỗi khi thiếu.

### Xong đợt 2 khi

- Có 12 chủ đề từ vựng và dạng chỗ trống ở trên.
- Bài Education không dùng layout thì động từ.
- Tổng published là 432. Dashboard và luyện điểm yếu vẫn chạy với chủ đề từ vựng.

## Pha 2 — AI sinh câu và giải thích

Chỉ bắt đầu khi Pha 1B đợt 1 đã qua mục kiểm tra. Đợt 2 nên xong trước khi sinh câu từ vựng.

### Provider

`src/modules/ai/provider.ts`

```ts
interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
  generateStructured<T>(input: GenerateStructuredInput<T>): Promise<T>;
}
```

Phần còn lại của app chỉ import `getAIProvider()`. Không import `GeminiProvider` từ nghiệp vụ.

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=
```

`AI_PROVIDER=mock` dùng trong test và khi muốn chạy không mạng. Mock trả JSON hợp lệ đã viết sẵn.

Gemini là provider mây duy nhất của pha này. `generateStructured` parse JSON, đưa qua Zod. Sai thì sửa một lần bằng prompt repair. Vẫn sai thì đánh dấu thất bại, không ghi câu hỏng.

Mỗi cuộc gọi ghi `ai_request_log`.

### Prompt

Một thư mục `src/modules/ai/prompts/`, mỗi việc một file:

- `question-generation.ts`
- `teacher-explanation.ts`

Mỗi file xuất `PROMPT_VERSION`. Câu và lời giải lưu version đã dùng.

Prompt sinh câu nhận chủ đề, độ khó, và bản ghi `grammar_topic`. Prompt cấm bịa dạng đề chính thức. Câu sinh ra `provenance = ai_generated`.

Prompt giải thích đóng vai giáo viên THPT, giải thích bằng tiếng Việt, bám `grammar_topic` và phương án học sinh đã chọn. Các mục trong `body`:

1. Đáp án đúng
2. Vì sao đúng
3. Vì sao phương án đã chọn sai
4. Quy tắc
5. Cấu trúc câu
6. Từ tín hiệu
7. Lỗi hay gặp
8. So với điểm ngữ pháp gần
9. Một ví dụ ngắn
10. Một câu luyện ngắn

Câu luyện ngắn trong lời giải không tự động vào ngân hàng.

### Sinh câu

Khi bấm bắt đầu luyện một chủ đề, hoặc luyện điểm yếu, hoặc 5 câu nhanh:

```text
chọn chủ đề
→ Gemini, tối đa 5 câu một lần gọi. Phiên 10 câu thì gọi hai lần
→ Zod
→ kiểm tra code: đủ 4 phương án, đúng một đáp án, có explanation cho từng phương án sai
→ hash, trùng hash thì bỏ
→ câu đạt thì lưu published, provenance = ai_generated, khóa vào phiên
→ thiếu câu hoặc AI lỗi, hết hạn, không có khóa: lấy phần còn lại từ kho published
```

Không có trạng thái chờ người duyệt. Câu không đạt thì không ghi. Câu đã ghi được dùng lại khi lần sau AI không tạo đủ. Tải lại phiên không sinh lại, vì `questionIds` đã khóa lúc bắt đầu.

Nút bắt đầu hiện "Đang tạo bài luyện…" trong lúc chờ. Không gắn nhãn câu AI là đề chính thức.

5 câu nhanh cũng sinh theo chủ đề cần luyện nhất. Không tạo được thì trộn câu published như trước.

### Giải thích khi sai

Đáp án đúng: hiện lời giải có sẵn, không gọi AI.

Đáp án sai: nếu attempt đã có `teacher_explanation` thì hiện bản lưu. Chưa có thì gọi AI một lần, lưu, rồi hiện. AI lỗi thì vẫn hiện lời giải có sẵn trong câu hỏi. Phiên luyện không vỡ.

`errorType` khi có giải thích: map từ một trường Zod `errorType` thuộc tập

```text
GRAMMAR_RULE, TENSE_CONFUSION, VOCABULARY, COLLOCATION,
PREPOSITION, WORD_FORM, SIGNAL_WORD_MISSED, NEGATION,
SUBJECT_VERB_AGREEMENT, UNKNOWN
```

Zod từ chối giá trị lạ và gán `UNKNOWN`.

### Test

Vitest, không gọi mạng:

- JSON hỏng rồi repair được
- JSON hỏng hai lần thì không insert
- Hai đáp án đúng thì không insert
- Hash trùng thì không insert
- Provider mock tắt: `submitAnswer` vẫn chấm đúng

### Xong pha khi

- `AI_PROVIDER=mock` sinh một câu Present Perfect, trạng thái `published`, không phải `draft`.
- `AI_PROVIDER=gemini` với `GEMINI_API_KEY` của người dùng sinh được một câu, có dòng log latency. Không có khóa thì không gọi mạng.
- Trả lời sai một câu published thì có giải thích tiếng Việt, tải lại trang không gọi thêm.
- Rút key: luyện tập và chấm điểm vẫn chạy, chỗ giải thích AI hiện lời giải có sẵn.

## Pha 3 — Đọc, sắp xếp, thi thử, chẩn đoán

### Dạng câu

Seed thêm, vẫn nội dung tự soạn:

- 2 đoạn đọc, mỗi đoạn 4 câu `single_choice`
- 4 câu `ordering`
- Giữ 48 câu ngữ pháp Pha 1

Màn luyện đọc hiện đoạn một lần, câu hỏi nằm dưới. Màn sắp xếp kéo thứ tự hoặc chọn thứ tự, chấm bằng chuỗi id.

### Đề thi thử

`/mock-exam` tạo `exam_session` từ `exam_specification` version mới nhất có status provisional hoặc confirmed.

Cơ cấu phiên bám `sections`. Thiếu câu published đúng loại thì báo thiếu, không bịa câu bằng AI giữa giờ thi.

Đồng hồ đếm ngược `durationMinutes`. Hết giờ hoặc nộp bài thì chấm: mỗi câu đúng cộng `10 / questionCount`. Với bản seed là 0.25 nếu đủ 40 câu. Chưa đủ 40 câu published đúng cơ cấu thì thi thử bị khóa và nói rõ còn thiếu loại nào.

Kết quả ghi điểm trên thang 10 và liệt kê câu sai. Không ghi câu "bạn sẽ được 8.0 ngày thi".

### Chẩn đoán

`/diagnostic` là một phiên 16 câu published, rải đều chủ đề đang có, trộn độ khó. Nộp xong chạy mastery và viết `summary` từ số liệu: mức ước lượng, ba chủ đề yếu nhất, chủ đề nên học trước.

Từ ngữ trên UI: "mức sẵn sàng ước lượng". Không quy đổi thành điểm thi chính thức.

Chủ đề nên học trước: chủ đề yếu có `gradeFrom` thấp nhất, để học từ nền.

### Xong pha khi

- Làm một bài đọc bốn câu, chấm đúng từng câu, đoạn văn không lặp bốn lần.
- Sắp xếp đúng một câu ordering.
- Thi thử không mở khi chưa đủ câu theo `sections`.
- Khi đã seed đủ cơ cấu tối thiểu để thử (có thể một đề rút gọn ghi trong `notes` là bản luyện, `questionCount` nhỏ hơn 40, `version` riêng `practice-1`), điểm cộng đúng và đồng hồ dừng lúc nộp.
- Bản `2025+` version 1 vẫn provisional. Bản luyện không đè lên bản đó.

Bản luyện rút gọn là dữ liệu thứ hai, `yearLabel = practice`, để phát triển màn thi trước khi đủ 40 câu. UI ghi đây là đề luyện trong app, không phải đề minh họa của Bộ.

## Pha 4 — Kho tri thức

Chỉ làm khi bài học soạn tay không còn đủ để sinh câu và giải thích, hoặc đã có tài liệu được phép dùng.

### Nhập

Script `db:ingest` nhận markdown đã tự soạn hoặc tài liệu có license rõ. Tạo source, document, chunk theo heading. Chunk gắn `topicId` nếu heading khớp slug.

Không có trang upload ở pha này.

### Truy xuất

`searchKnowledge({ topicSlug, query })` xếp hạng:

```text
finalScore = keywordScore * 0.55 + topicScore * 0.30 + trustScore * 0.15
```

Trọng số một object cấu hình. Chưa có embedding thì bỏ semantic. Khi bật pgvector, thêm `semanticScore` và đổi về công thức:

```text
finalScore = semanticScore * 0.45
            + keywordScore * 0.20
            + topicScore * 0.20
            + trustScore * 0.15
```

Prompt Pha 2 đổi sang nhận các chunk này cùng `grammar_topic`. Không có chunk thì vẫn dùng `grammar_topic` như Pha 2.

### Xong pha khi

- Ingest một file markdown Present Perfect tạo được chunk gắn đúng topic.
- Sinh câu mock nhận đúng đoạn đó trong input đã log ở mức operation, không log nguyên prompt nếu prompt chứa nội dung dài. Test kiểm hàm dựng prompt có chứa đoạn chunk.
- Source không có license thì script từ chối.

## Pha 5 — Provider còn lại và luyện thích nghi

### Provider

Thêm `GroqProvider` và `OllamaProvider`, cùng interface. Đổi env là đổi provider:

```text
AI_PROVIDER=groq
GROQ_API_KEY=
GROQ_MODEL=

AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=
```

Khác biệt JSON mode xử lý trong từng provider. Nghiệp vụ không biết. Test mock không đổi. Một test cho mỗi provider dùng response giả của SDK, không cần key.

### Luyện thích nghi

`startSession({ mode: "weakness" })` chọn 20 câu theo tỉ lệ, cấu hình trong `src/modules/learning/mix.ts`:

```text
60% chủ đề yếu
25% chủ đề đang học
15% chủ đề vững
```

Thiếu nhóm nào thì phần đó đổ sang nhóm yếu hơn kế bên. Không lặp cùng một câu trong phiên.

Không làm trang duyệt câu. Một người dùng, câu đã qua kiểm tra code thì dùng luôn.

### Xong pha khi

- `AI_PROVIDER=mock` vẫn xanh test cũ.
- Factory với `groq` trả đúng class. Test không cần khóa thật. Ollama không dùng.
- Phiên điểm yếu 20 câu tôn tỉ lệ 12/5/3 khi cả ba nhóm đều có câu.

## Quy tắc lúc code

- Page không viết SQL. Page gọi hàm module.
- Ghi dữ liệu qua Server Action. Zod ở input action.
- Câu `draft` và `archived` không vào luyện, chẩn đoán, thi thử. Câu AI của Pha 2 chỉ được ghi `published` sau khi kiểm tra code.
- Không gắn nhãn câu AI là đề chính thức.
- Log có `provider`, `operation`, `latency`, `status`. Log không có API key, không có tên học sinh.
- Sửa trọng số mastery hoặc tỉ lệ luyện trong một file, không rải số trong UI.
- Pha sau không đổi nghĩa các mức yếu / đang học / vững.

## Kiểm thử

Vitest cho hàm thuần. Ưu tiên:

| Hàm | Pha | Ca cần có |
| --- | --- | --- |
| `scoreAnswer` | 1 | đúng, sai, đáp án lạ |
| `mastery` | 1 | ít lần làm, chuỗi sai, đúng câu khó |
| `pickQuestions` | 1 | không lấy draft, không trùng trong phiên |
| `generateStructured` | 2 | hỏng JSON, hai đáp án, hash trùng, provider lỗi |
| `examScore` | 3 | đủ câu, thiếu loại câu, nộp khi hết giờ |
| `searchKnowledge` | 4 | đúng topic, source trust thấp hơn, không có embedding |
| `mixSession` | 5 | đủ ba nhóm, thiếu nhóm vững |

Chạy test của pha hiện tại trước khi sang pha sau. Test đỏ thì sửa, không bỏ qua.

## Việc kiểm tra bằng tay

Sau mỗi pha, chạy:

```text
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Đi đúng đường học sinh của pha đó. Pha 2 thêm một lần với khóa Gemini và một lần rút khóa. Pha 3 xem đồng hồ và một bài đọc.

## Thứ tự làm khi code tiếp

Pha 1 đến Pha 5 đã xong. Mã đề A là 40 câu tự soạn. Luyện điểm yếu 20 câu theo 12/5/3. Trang tài khoản chọn Gemini hoặc Groq. Không dùng Ollama vì app sẽ chạy trên Vercel và điện thoại. Pha 4 chỉ làm khi bài học soạn tay không còn đủ.
