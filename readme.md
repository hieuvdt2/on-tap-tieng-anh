# MASTER IMPLEMENTATION PROMPT

## AI English Exam Preparation Platform – Vietnam High School Graduation Exam 2027

You are a senior full-stack architect and engineer.

Build a production-oriented English learning and exam-preparation web application for Vietnamese students preparing for the Vietnam High School Graduation Examination in English, targeting the 2027 exam.

The application should help a student rebuild English knowledge from approximately Grade 6 → Grade 12, identify weaknesses, practice by topic, receive teacher-style explanations, and gradually progress toward the target exam level.

The system MUST NOT behave like a generic chatbot.

AI is an intelligent teaching/generation layer on top of a structured curriculum, knowledge base, question bank, and student learning profile.

---

# 1. CORE PRODUCT PRINCIPLE

The product follows this architecture:

```text
                    ┌──────────────────────┐
                    │      Curriculum      │
                    │ Grade 6 → Grade 12   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Knowledge Base    │
                    │ Grammar / Vocabulary │
                    │ Reading / Exam rules │
                    │ Documents / Sources  │
                    └──────────┬───────────┘
                               │
                         RAG / Retrieval
                               │
                               ▼
                    ┌──────────────────────┐
                    │     AI Provider      │
                    │ Gemini / Groq / Ollama│
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       Question Generator  Explanation     Lesson Generator
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │      Validator       │
                    │ Grammar / Answer /   │
                    │ Difficulty / Source  │
                    └──────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │    Question Bank     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Student        │
                    │ Practice / Exam      │
                    │ Attempts / Progress  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Learning Profile     │
                    │ Weakness / Mastery   │
                    └──────────┬───────────┘
                               │
                               └──────► Adaptive Practice
```

Do NOT make AI the database.

Do NOT hard-code the entire curriculum directly into React components.

Do NOT put API keys in the browser.

Do NOT generate a new AI question every time the student clicks "Next".

Generated questions should be validated and stored so they can be reused.

---

# 2. TECHNOLOGY STACK

Use:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma or Drizzle ORM
- pgvector for embeddings
- Zod for validation
- Server-side API routes / Server Actions
- AI Provider abstraction
- Background jobs where useful

Prefer a modular architecture.

Suggested project structure:

```text
apps/
  web/

packages/
  ai/
  curriculum/
  knowledge/
  questions/
  learning/
  exam/
  database/
  shared/
```

If the existing repository already has a structure, inspect it first and adapt rather than blindly replacing it.

---

# 3. AI PROVIDER ABSTRACTION

The most important architectural requirement is provider independence.

The application must NOT directly call Gemini/Groq/Ollama from business logic.

Create:

```ts
interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;

  generateStructured<T>(input: GenerateStructuredInput<T>): Promise<T>;

  explain(input: ExplainInput): Promise<Explanation>;

  generateQuestions(
    input: GenerateQuestionsInput,
  ): Promise<GeneratedQuestion[]>;

  evaluateAnswer(input: EvaluateAnswerInput): Promise<AnswerEvaluation>;
}
```

Implement:

```text
AIProvider
├── GeminiProvider
├── GroqProvider
└── OllamaProvider
```

Provider selection:

```env
AI_PROVIDER=gemini

GEMINI_API_KEY=
GROQ_API_KEY=

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=
```

The rest of the application must only depend on:

```ts
AIProvider;
```

and never on:

```ts
GeminiProvider;
GroqProvider;
OllamaProvider;
```

directly.

---

# 4. AI PROVIDER REQUIREMENTS

## Gemini

Use Gemini as the default cloud provider when configured.

## Groq

Use Groq as another cloud provider.

The architecture must allow switching between Gemini and Groq through environment configuration.

## Ollama

Support local models through Ollama.

Example:

```text
Application
    ↓
AIProvider
    ↓
Ollama
    ↓
Local model
```

This is useful for development and zero-API-cost local experimentation.

Do not assume that all models support the same structured-output capabilities.

The provider abstraction should normalize differences.

---

# 5. STRUCTURED AI OUTPUT

Never trust raw AI output.

Use Zod schemas.

Example:

```ts
const GeneratedQuestionSchema = z.object({
  questionType: z.string(),
  stem: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  correctAnswer: z.string(),
  explanation: z.string(),
  wrongAnswerExplanations: z.array(
    z.object({
      optionId: z.string(),
      explanation: z.string(),
    }),
  ),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topics: z.array(z.string()),
  skills: z.array(z.string()),
  sourceReferences: z.array(z.string()),
});
```

If parsing fails:

1. retry once with a repair prompt;
2. validate again;
3. if still invalid, mark generation as failed;
4. never silently insert malformed data.

---

# 6. KNOWLEDGE BASE

The application must have a real knowledge layer.

Knowledge can come from:

- official curriculum documents;
- official exam-related documents;
- textbooks;
- teacher-provided documents;
- user-uploaded documents;
- grammar references;
- vocabulary references;
- exam specifications;
- other legally usable sources.

Store metadata:

```text
KnowledgeSource
- id
- title
- publisher
- sourceType
- url
- retrievedAt
- trustLevel
- license
- contentHash
- curriculumVersion
```

Documents:

```text
KnowledgeDocument
- id
- sourceId
- title
- content
- language
- grade
- subject
- chapter
- topic
- metadata
```

Chunks:

```text
KnowledgeChunk
- id
- documentId
- content
- embedding
- page
- section
- topic
- grade
- metadata
```

Use PostgreSQL + pgvector initially.

Do NOT introduce a separate vector database unless there is a concrete need.

---

# 7. RAG PIPELINE

Implement:

```text
User request
      ↓
Intent detection
      ↓
Topic / curriculum identification
      ↓
Hybrid retrieval
      ↓
Relevant knowledge chunks
      ↓
Prompt construction
      ↓
AI
```

Retrieval should combine:

- semantic similarity;
- keyword matching;
- topic;
- grade;
- curriculum relevance;
- source trust;
- document metadata.

Do not blindly retrieve the top N vectors.

Prefer a scoring model such as:

```text
finalScore =
  semanticScore * 0.45
  + keywordScore * 0.20
  + curriculumScore * 0.20
  + trustScore * 0.15
```

Make weights configurable.

---

# 8. CURRICULUM MODEL

Create a structured curriculum.

Example:

```text
English
├── Grade 6
├── Grade 7
├── Grade 8
├── Grade 9
├── Grade 10
├── Grade 11
└── Grade 12
```

Each grade contains:

```text
Unit
 ├── Grammar
 ├── Vocabulary
 ├── Reading
 ├── Communication
 ├── Writing
 └── Review
```

But also create a cross-grade skill taxonomy.

Example:

```text
Grammar
├── Present Simple
├── Present Continuous
├── Past Simple
├── Past Continuous
├── Present Perfect
├── Past Perfect
├── Future Forms
├── Modal Verbs
├── Passive Voice
├── Conditional Type 1
├── Conditional Type 2
├── Conditional Type 3
├── Mixed Conditionals
├── Reported Speech
├── Relative Clauses
├── Gerund
├── Infinitive
├── Articles
├── Prepositions
├── Comparisons
├── Quantifiers
├── Subject-Verb Agreement
├── Word Formation
├── Conjunctions
├── Phrasal Verbs
└── Collocations
```

The curriculum should be data-driven.

Do not encode all lessons directly in UI code.

---

# 9. GRAMMAR KNOWLEDGE MODEL

Every grammar topic should contain structured information.

Example:

```ts
GrammarTopic {
  id
  name
  slug
  description
  gradeRange
  difficulty
  purpose
  usage
  structure
  affirmativePattern
  negativePattern
  questionPattern
  signalWords
  examples
  commonMistakes
  comparisons
  prerequisites
}
```

For example, Present Perfect should contain:

- definition;
- when to use it;
- sentence structure;
- affirmative;
- negative;
- questions;
- irregular participles;
- signal words;
- examples;
- common mistakes;
- comparison with Past Simple;
- comparison with Present Perfect Continuous;
- prerequisites.

The AI should retrieve this knowledge rather than inventing explanations from nothing.

---

# 10. QUESTION BANK

Create a proper question lifecycle:

```text
DRAFT
  ↓
VALIDATING
  ↓
APPROVED
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Question model:

```text
Question
- id
- type
- stem
- options
- correctAnswer
- explanation
- wrongAnswerExplanations
- difficulty
- grade
- topic
- subTopic
- skills
- estimatedTime
- sourceType
- generatedBy
- generationModel
- validationStatus
- curriculumVersion
- createdAt
- updatedAt
```

Question provenance:

```text
ORIGINAL
ADAPTED
IMPORTED
AI_GENERATED
```

Never present an AI-generated question as an official exam question.

---

# 11. AI QUESTION GENERATION

Create:

```text
QuestionGeneratorService
```

Input:

```ts
{
  topic;
  grade;
  difficulty;
  questionType;
  count;
  learningObjective;
  studentWeaknesses;
  retrievedKnowledge;
}
```

The AI must generate questions based on retrieved knowledge.

Example generation pipeline:

```text
Topic
 ↓
Retrieve knowledge
 ↓
Build generation constraints
 ↓
AI generation
 ↓
Zod validation
 ↓
Grammar validation
 ↓
Answer validation
 ↓
Difficulty validation
 ↓
Duplicate detection
 ↓
Save as DRAFT
```

Do not immediately publish AI-generated questions.

---

# 12. QUESTION VALIDATION

Build multiple validation layers.

## Structural validation

Check:

- valid JSON;
- required fields;
- correct option count;
- correct answer exists;
- explanation exists.

## Logical validation

Check:

- exactly one correct answer;
- no ambiguous answer;
- options are meaningful;
- question is solvable.

## Curriculum validation

Check:

- topic matches curriculum;
- difficulty matches target;
- question does not require knowledge outside the requested level.

## AI review

Ask a second AI call:

```text
Review this question.

Determine:
1. Is the question grammatically correct?
2. Is exactly one answer correct?
3. Is the explanation correct?
4. Does it test the requested topic?
5. Is the difficulty appropriate?
6. Is there ambiguity?
7. Should this question be rejected?
```

Store the validation result.

---

# 13. DUPLICATE DETECTION

Do not generate thousands of near-identical questions.

Before inserting a question:

1. normalize text;
2. calculate hash;
3. perform semantic similarity search;
4. reject or flag highly similar questions.

Store:

```text
duplicateOf
similarityScore
```

---

# 14. TEACHER EXPLANATION ENGINE

The application should behave like a good English teacher.

When the student answers incorrectly, explain:

```text
1. Correct answer
2. Why it is correct
3. Why the student's answer is wrong
4. Grammar rule
5. Sentence structure
6. Signal words
7. Common mistake
8. Comparison with similar grammar
9. One simple example
10. One short practice question
```

Example:

Student:

```text
I have seen him yesterday.
```

Explanation should teach:

```text
"Yesterday" refers to a finished time in the past.

Therefore Past Simple is normally required:

I saw him yesterday.

Present Perfect is generally used when the time is not finished/specified in that way.
```

The goal is teaching the concept, not simply saying:

```text
Wrong. Correct answer: saw.
```

---

# 15. ERROR CLASSIFICATION

Every incorrect answer should produce an error category.

Examples:

```text
GRAMMAR_RULE
TENSE_CONFUSION
VOCABULARY
COLLOCATION
PREPOSITION
WORD_FORM
READING_COMPREHENSION
CAREFUL_READING
SIGNAL_WORD_MISSED
NEGATION
SUBJECT_VERB_AGREEMENT
UNKNOWN
```

Store:

```text
Attempt
- selectedAnswer
- correctAnswer
- isCorrect
- responseTime
- errorType
- topicId
- difficulty
```

---

# 16. STUDENT LEARNING PROFILE

Create:

```text
LearningProfile
- studentId
- overallMastery
- targetScore
- currentEstimatedLevel
```

And:

```text
TopicMastery
- studentId
- topicId
- attempts
- correct
- accuracy
- masteryScore
- lastPracticedAt
- confidence
```

Do NOT calculate mastery simply as:

```text
correct / attempts
```

Use a weighted model considering:

- recent performance;
- number of attempts;
- question difficulty;
- consistency;
- repeated mistakes.

Example:

```text
mastery =
  recentAccuracy * 0.40
  + historicalAccuracy * 0.25
  + difficultyPerformance * 0.20
  + consistency * 0.15
```

Keep the formula configurable.

---

# 17. ADAPTIVE LEARNING

The system should decide what the student should practice next.

Example:

```text
Student weak in:
- Present Perfect
- Conditional Type 2
- Word Formation

Student strong in:
- Present Simple
- Past Simple
```

The next practice session should prioritize weaknesses.

But do not endlessly repeat the same topic.

Use a balance:

```text
60% weak topics
25% medium topics
15% strong/review topics
```

Make this configurable.

---

# 18. DIAGNOSTIC TEST

Create an initial diagnostic test.

It should cover:

```text
Grammar
Vocabulary
Reading
Word Formation
Sentence Structure
Common Exam Patterns
```

The diagnostic should estimate:

```text
current level
topic mastery
weaknesses
recommended starting point
```

Do not claim an exact official exam score from a small diagnostic.

Use wording such as:

```text
Estimated readiness
```

rather than:

```text
You will score exactly 8.0.
```

---

# 19. PRACTICE MODES

Implement:

### Topic Practice

Example:

```text
Present Perfect
20 questions
```

### Mixed Grammar

Mix several grammar topics.

### Vocabulary Practice

Topic-based vocabulary.

### Reading Practice

Include:

- main idea;
- detail;
- inference;
- vocabulary in context;
- reference;
- paraphrase;
- true/false style where appropriate.

### Weakness Practice

Automatically generated from the student's LearningProfile.

### Quick Practice

5–10 questions.

### Mock Exam

Simulate the actual exam format according to the currently configured exam specification.

Do NOT hard-code the 2027 exam format without verifying the official specification.

Store exam configuration separately:

```text
ExamSpecification
- year
- version
- sections
- questionCount
- timing
- scoringRules
- source
```

---

# 20. EXAM SPECIFICATION VERSIONING

This is important.

Do not assume today's exam structure will always remain unchanged.

Create:

```text
ExamSpecification
```

with versions.

Example:

```text
Vietnam English Graduation Exam
2027
version 1
```

If official requirements change:

```text
2027 version 2
```

can be created without rewriting the application.

---

# 21. DASHBOARD

Create a student dashboard showing:

```text
Current learning level
Target score
Overall mastery
Topics mastered
Topics needing review
Recent mistakes
Study streak
Practice history
Recommended next lesson
Recommended next practice
```

Example:

```text
Your current focus

1. Present Perfect       42%
2. Conditional Type 2   51%
3. Word Formation       57%

Recommended:
→ Present Perfect lesson
→ 10 targeted questions
→ Review mistakes
```

Avoid fake precision.

Do not display:

```text
You are exactly 72.38% ready for the exam.
```

unless the metric has a defensible meaning.

---

# 22. LESSON PAGE

Each grammar lesson should have:

```text
Concept
↓
When to use
↓
Structure
↓
Examples
↓
Signal words
↓
Common mistakes
↓
Compare with similar grammar
↓
Mini exercise
↓
Review mistakes
```

Example:

```text
Present Perfect vs Past Simple
```

should explicitly explain the difference.

---

# 23. AI LESSON GENERATION

Allow AI to generate explanations from:

```text
Curriculum
+
Knowledge Base
+
Student level
+
Student mistakes
```

Prompt AI as a teacher:

```text
You are an experienced Vietnamese high-school English teacher.

Explain the topic clearly to a student who has forgotten the fundamentals.

Use simple Vietnamese explanations.

Do not assume prior knowledge.

Explain:
- what it means;
- when it is used;
- sentence structure;
- examples;
- common mistakes;
- how to recognize it in multiple-choice questions;
- comparison with similar grammar.

Do not invent curriculum facts.
Use the retrieved knowledge as the primary source.
```

---

# 24. PROMPT MANAGEMENT

Do not scatter prompts throughout the code.

Create:

```text
packages/ai/prompts/
```

Example:

```text
question-generation.ts
question-validation.ts
teacher-explanation.ts
lesson-generation.ts
answer-evaluation.ts
diagnostic-analysis.ts
```

Version prompts:

```text
PROMPT_VERSION = "1.0.0"
```

Store the prompt version used to generate important AI content.

---

# 25. COST CONTROL

The system must be designed for low AI cost.

Do NOT call AI unnecessarily.

Bad:

```text
Student answers question
→ AI call
→ next question
→ AI call
→ next question
→ AI call
```

Better:

```text
Generate 20 questions
→ validate
→ save
→ student practices locally
```

Use AI mainly for:

- generation;
- explanations;
- adaptive analysis;
- lesson generation;
- validation.

Cache reusable results.

Store generated content.

Allow regeneration only when needed.

---

# 26. AI REQUEST LOGGING

Create:

```text
AIRequestLog
```

Store:

```text
provider
model
operation
promptVersion
inputTokens
outputTokens
latency
status
error
createdAt
```

If token information is unavailable for a provider, store null.

Do not store API keys.

---

# 27. SECURITY

Absolutely never expose:

```text
GEMINI_API_KEY
GROQ_API_KEY
```

to client-side JavaScript.

Never put them in:

```text
NEXT_PUBLIC_*
```

AI calls must happen server-side.

Add:

- rate limiting;
- request validation;
- authentication;
- authorization;
- input size limits;
- AI output validation.

---

# 28. SOURCE MANAGEMENT

Create an admin interface for:

```text
Sources
Documents
Chunks
Curriculum
Questions
Validation
```

Admin should be able to see:

```text
Source
↓
Document
↓
Chunk
↓
Generated question
```

This creates traceability.

---

# 29. COPYRIGHT / CONTENT PROVENANCE

Do not blindly copy third-party question banks.

Use sources primarily for:

- concepts;
- curriculum;
- grammar knowledge;
- exam specifications;
- reference information.

Generate original questions when appropriate.

For imported content, preserve:

```text
source
license
origin
```

Never label generated content as an official exam question.

---

# 30. API DESIGN

Create APIs similar to:

```text
POST /api/ai/generate
POST /api/ai/explain

POST /api/questions/generate
POST /api/questions/validate
GET  /api/questions

POST /api/practice/start
POST /api/practice/answer
GET  /api/practice/result

GET /api/learning/profile
GET /api/learning/recommendations

POST /api/diagnostic/start
POST /api/diagnostic/answer
GET  /api/diagnostic/result

GET /api/lessons/:slug

POST /api/knowledge/sources
POST /api/knowledge/ingest
POST /api/knowledge/search

GET /api/exam-specifications
```

Adapt naming to the existing project conventions.

---

# 31. DATABASE RELATIONSHIP

At minimum:

```text
Student
  │
  ├── Attempt
  │      └── Question
  │
  ├── TopicMastery
  │      └── Topic
  │
  └── LearningProfile

Question
  ├── Topic
  ├── Curriculum
  ├── KnowledgeReferences
  └── ValidationResult

KnowledgeSource
  └── KnowledgeDocument
          └── KnowledgeChunk

ExamSpecification
  └── ExamSection
```

Keep the data model normalized enough to support future growth.

---

# 32. UX PRINCIPLE

The application should feel like:

```text
English teacher + practice platform
```

not:

```text
AI chatbot
```

The primary flow should be:

```text
Learn
 ↓
Practice
 ↓
Make mistakes
 ↓
Understand mistakes
 ↓
Review
 ↓
Practice again
 ↓
Master
```

Not:

```text
Ask AI
 ↓
Get giant answer
 ↓
Ask AI again
```

---

# 33. IMPORTANT PRODUCT RULE

AI should NOT replace deterministic application logic.

Use normal code for:

- scoring;
- answer checking;
- progress calculation;
- database operations;
- curriculum structure;
- exam timing;
- question selection where deterministic rules are sufficient.

Use AI for:

- natural-language explanation;
- question generation;
- content adaptation;
- semantic classification;
- lesson generation;
- intelligent recommendations where useful.

This keeps the system cheaper, faster, and more reliable.

---

# 34. IMPLEMENTATION STRATEGY

Do NOT attempt to build the entire platform in one giant implementation.

Build in phases.

## Phase 1 – Foundation

Implement:

```text
Next.js
PostgreSQL
ORM
Authentication
Curriculum
Topic
Question
Attempt
LearningProfile
```

Create a small seed dataset.

The app must already be usable without AI.

---

## Phase 2 – AI Provider

Implement:

```text
AIProvider
GeminiProvider
GroqProvider
OllamaProvider
```

Add:

```text
generateStructured()
explain()
```

Test each provider independently.

Create provider mocks for automated tests.

---

## Phase 3 – AI Question Generator

Implement:

```text
QuestionGenerator
QuestionValidator
DuplicateDetector
QuestionRepository
```

Pipeline:

```text
Knowledge
→ AI
→ Zod
→ validation
→ duplicate detection
→ DRAFT
```

---

## Phase 4 – Knowledge Base + RAG

Implement:

```text
Source
Document
Chunk
Embedding
Vector search
Hybrid retrieval
```

Start with PostgreSQL + pgvector.

Do not introduce unnecessary infrastructure.

---

## Phase 5 – Teacher Explanation

Implement:

```text
AnswerEvaluation
ErrorClassification
TeacherExplanation
```

When a student gets a question wrong:

```text
Wrong answer
↓
Error classification
↓
Retrieve relevant grammar knowledge
↓
AI explanation
↓
Save explanation
```

---

## Phase 6 – Adaptive Learning

Implement:

```text
TopicMastery
LearningProfile
RecommendationEngine
WeaknessPractice
```

---

## Phase 7 – Diagnostic

Implement:

```text
DiagnosticTest
DiagnosticAnalysis
StartingLevel
RecommendedCurriculum
```

---

## Phase 8 – Mock Exam

Implement:

```text
ExamSpecification
ExamSession
ExamTimer
ExamScoring
ExamResult
```

The exam specification must be configurable/versioned.

---

# 35. TESTING

Every major module must have tests.

At minimum:

```text
AIProvider
QuestionGenerator
QuestionValidator
AnswerChecker
MasteryCalculator
RecommendationEngine
RAG retrieval
Exam scoring
```

Test failure cases, not only happy paths.

Example:

```text
AI returns malformed JSON
AI returns two correct answers
AI returns no correct answer
AI generates duplicate question
Provider unavailable
Embedding unavailable
Database failure
Rate limit
```

---

# 36. OBSERVABILITY

Add structured logging.

Example:

```text
[AI]
provider=gemini
operation=question_generation
model=...
latency=...
status=success
```

and:

```text
[QUESTION]
id=...
topic=...
validation=approved
```

Do not log API keys or sensitive student information.

---

# 37. UI PAGES

Implement at least:

```text
/
  Dashboard

/diagnostic
  Diagnostic test

/learn
  Curriculum

/learn/[topic]
  Lesson

/practice
  Practice configuration

/practice/[sessionId]
  Practice session

/questions/[id]
  Question detail

/review
  Mistakes

/progress
  Learning progress

/mock-exam
  Mock exam

/settings
  AI/provider settings where appropriate
```

Admin:

```text
/admin/sources
/admin/documents
/admin/knowledge
/admin/questions
/admin/validation
/admin/curriculum
/admin/exam-specifications
```

---

# 38. FIRST MVP

Do not overbuild.

The first working MVP should contain only:

```text
1. Curriculum
2. Grammar topics
3. Question bank
4. Practice
5. Answer explanation
6. Learning profile
7. AI question generation
8. Gemini/Groq/Ollama provider abstraction
```

RAG can initially support a small number of curated documents.

Then expand.

---

# 39. DEFAULT AI STRATEGY

Recommended default:

```text
Production/development cloud:
Gemini

Alternative:
Groq

Local development:
Ollama
```

But the code must not assume Gemini.

The architecture should make this switch trivial:

```env
AI_PROVIDER=gemini
```

to:

```env
AI_PROVIDER=groq
```

or:

```env
AI_PROVIDER=ollama
```

without modifying application business logic.

---

# 40. FAILURE HANDLING

If AI is unavailable:

The application must still allow:

```text
existing questions
practice
answer checking
progress
review
```

AI is an enhancement, not a single point of failure.

Example:

```text
AI unavailable
      ↓
Show existing question bank
      ↓
Student continues learning
```

Do not make the entire application unusable because an AI provider is down.

---

# 41. DEVELOPMENT RULES

Before implementing anything:

1. Inspect the existing repository.
2. Identify existing architecture.
3. Identify existing database setup.
4. Identify existing authentication.
5. Identify reusable components.
6. Identify existing API conventions.
7. Identify existing testing setup.
8. Do not replace working infrastructure unnecessarily.

Before creating a new abstraction:

Ask:

```text
Does the project already have something equivalent?
```

Reuse existing code when appropriate.

---

# 42. CRITICAL ARCHITECTURE REVIEW

Do not blindly implement this specification.

Before coding, analyze:

1. Which parts are necessary for MVP?
2. Which parts are over-engineering?
3. Which components can be simplified?
4. Which components create unnecessary operational cost?
5. Which components should be postponed?
6. Which assumptions about the 2027 exam require official verification?

For each major architectural decision, briefly compare alternatives.

Example:

```text
Vector DB:
- Pinecone
- Qdrant
- pgvector

Recommendation:
pgvector for MVP because PostgreSQL is already required and the expected dataset is small.
```

Do this reasoning for major decisions.

Do not introduce infrastructure simply because it is popular.

---

# 43. IMPORTANT: EXAM DATA

Do not invent official 2027 exam specifications.

If information about the 2027 Vietnam High School Graduation Examination is required:

- verify it from authoritative sources;
- record the source;
- store the specification as versioned data;
- distinguish confirmed information from assumptions.

If official information is unavailable:

```text
Mark it as provisional.
```

Do not present assumptions as official requirements.

---

# 44. EXPECTED DEVELOPMENT OUTPUT

When starting implementation, do NOT immediately dump thousands of lines of code.

First produce:

```text
1. Repository analysis
2. Architecture proposal
3. Data model
4. Folder structure
5. AI provider design
6. RAG design
7. MVP scope
8. Implementation phases
9. Risks
10. Open questions
```

Then implement Phase 1.

After Phase 1 is complete:

```text
Run tests
Fix issues
Explain what was implemented
Then continue to Phase 2
```

Do not silently skip failed tests.

---

# 45. DEFINITION OF DONE

The platform is considered functional when a student can:

```text
1. Take a diagnostic test
2. Receive a learning profile
3. Study a grammar topic
4. Practice questions
5. Submit answers
6. See correct/incorrect result
7. Read teacher-style explanation
8. See why their selected answer was wrong
9. Have mistakes recorded
10. See weak topics
11. Practice weak topics
12. Generate additional questions using AI
13. Continue practicing even if AI is unavailable
```

The final architecture should remain extensible toward:

```text
Vocabulary
Reading
Writing
Listening
Speaking
Mock exams
Spaced repetition
Advanced adaptive learning
Teacher/admin accounts
```

without requiring a complete rewrite.

---

# FINAL INSTRUCTION

Treat this as a real software product, not a toy AI demo.

Prioritize:

```text
Correctness
Maintainability
Source traceability
Low cost
Provider independence
Testability
Good learning UX
```

over:

```text
Maximum AI usage
Maximum number of features
Maximum infrastructure
```

The most important principle is:

```text
STRUCTURED KNOWLEDGE
        +
RELIABLE QUESTION BANK
        +
AI TEACHING/GNERATION
        +
STUDENT PERFORMANCE DATA
        =
ADAPTIVE ENGLISH LEARNING PLATFORM
```

Start by inspecting the repository and producing the architecture assessment before making implementation changes.
# on-tap-tieng-anh
