import { articles } from "./grammar/articles";
import { comparativesSuperlatives } from "./grammar/comparatives-superlatives";
import { conditionalType1 } from "./grammar/conditional-type-1";
import { conditionalType2 } from "./grammar/conditional-type-2";
import { conjunctionsLinkingWords } from "./grammar/conjunctions-linking-words";
import { countableUncountableNouns } from "./grammar/countable-uncountable-nouns";
import { futureForms } from "./grammar/future-forms";
import { gerundInfinitive } from "./grammar/gerund-infinitive";
import { modalsCanCouldShould } from "./grammar/modals-can-could-should";
import { modalsObligationPossibility } from "./grammar/modals-obligation-possibility";
import { passiveVoice } from "./grammar/passive-voice";
import { pastContinuous } from "./grammar/past-continuous";
import { pastPerfect } from "./grammar/past-perfect";
import { pastSimple } from "./grammar/past-simple";
import { pastSimpleVsPresentPerfect } from "./grammar/past-simple-vs-present-perfect";
import { prepositionsTimePlace } from "./grammar/prepositions-time-place";
import { presentContinuous } from "./grammar/present-continuous";
import { presentPerfect } from "./grammar/present-perfect";
import { presentSimple } from "./grammar/present-simple";
import { quantifiers } from "./grammar/quantifiers";
import { relativeClauses } from "./grammar/relative-clauses";
import { reportedSpeech } from "./grammar/reported-speech";
import { wishIfOnly } from "./grammar/wish-if-only";
import { wordFormation } from "./grammar/word-formation";
import { careers } from "./vocabulary/careers";
import { collocations } from "./vocabulary/collocations";
import { community } from "./vocabulary/community";
import { culture } from "./vocabulary/culture";
import { dependentPrepositions } from "./vocabulary/dependent-prepositions";
import { education } from "./vocabulary/education";
import { environment } from "./vocabulary/environment";
import { health } from "./vocabulary/health";
import { media } from "./vocabulary/media";
import { phrasalVerbs } from "./vocabulary/phrasal-verbs";
import { subjectVerbAgreement } from "./vocabulary/subject-verb-agreement";
import { technology } from "./vocabulary/technology";
import type { CurriculumTopic } from "./types";

export const curriculum: CurriculumTopic[] = [
  presentSimple,
  presentContinuous,
  pastSimple,
  pastContinuous,
  presentPerfect,
  pastSimpleVsPresentPerfect,
  futureForms,
  pastPerfect,
  articles,
  countableUncountableNouns,
  quantifiers,
  comparativesSuperlatives,
  prepositionsTimePlace,
  modalsCanCouldShould,
  modalsObligationPossibility,
  conditionalType1,
  conditionalType2,
  passiveVoice,
  relativeClauses,
  gerundInfinitive,
  reportedSpeech,
  wishIfOnly,
  wordFormation,
  conjunctionsLinkingWords,
  education,
  environment,
  technology,
  health,
  culture,
  careers,
  community,
  media,
  collocations,
  phrasalVerbs,
  dependentPrepositions,
  subjectVerbAgreement,
];

export const TOPIC_ORDER = curriculum.map((topic) => topic.slug);
