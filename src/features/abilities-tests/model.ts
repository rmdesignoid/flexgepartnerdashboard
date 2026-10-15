export const SKILLS = ["listening", "reading", "writing", "speaking"] as const;
export type SkillId = typeof SKILLS[number];
export const SKILL_NAMES: Record<SkillId, string> = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking" };
export type Criterion = { id: string; label: string; max: number; aiScore: number; explanation: string; evidence?: string; dimensions?: string[] };
export type AnswerSegment = string | { answer: string; correct: string };
export type Question = {
  id: string; prompt: string; kind: "choice" | "gap" | "text-fill" | "grammar" | "guided" | "free" | "speaking";
  max: number; score: number; answer: string; correct?: string; options?: string[];
  segments?: AnswerSegment[]; correction?: string; correctedSentence?: string; explanation?: string; criteria?: Criterion[]; audio?: string;
};
export type Part = { id: string; title: string; instructions: string; passage?: string; audio?: string; questions: Question[] };
export type Skill = { id: SkillId; startedAt: string; minutes: number; parts: Part[] };
export type Assessment = { id: string; student: string; email: string; title: string; level: string; date: string; minutes: number; completed: boolean; skills: Skill[] };
export type Correction = { score: number; justification: string; savedAt: string };
export type QuestionReview = { criteria: Record<string, Correction>; validated: boolean; validatedAt?: string };
export type ReviewState = Record<string, Record<string, QuestionReview>>;
export const STORAGE_KEY = "flexge:four-abilities:reviews:v1";
export const points = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
export const questionsOf = (assessment: Assessment) => assessment.skills.flatMap(skill => skill.parts.flatMap(part => part.questions));
export const requiresReview = (question: Question) => !!question.criteria?.length;
export const isValidated = (question: Question, reviews: Record<string, QuestionReview> = {}) => !requiresReview(question) || reviews[question.id]?.validated === true;
export const criterionScore = (criterion: Criterion, review?: QuestionReview) => review?.criteria[criterion.id]?.score ?? criterion.aiScore;
export const questionScore = (question: Question, reviews: Record<string, QuestionReview> = {}) => requiresReview(question) ? sum(question.criteria!.map(c => criterionScore(c, reviews[question.id]))) : question.score;
export function scoreOf(questions: Question[], reviews: Record<string, QuestionReview> = {}) {
  const max = sum(questions.map(q => q.max));
  const score = sum(questions.map(q => questionScore(q, reviews)));
  const pending = questions.filter(q => !isValidated(q, reviews)).length;
  return { score, max, pending, percent: max ? score / max * 100 : 0 };
}
export function assessmentSummary(assessment: Assessment, reviews: Record<string, QuestionReview> = {}) {
  const questions = questionsOf(assessment);
  const pending = questions.filter(q => !isValidated(q, reviews)).length;
  const validated = assessment.completed ? questions.length - pending : 0;
  const finalGrade = assessment.completed && !pending ? sum(assessment.skills.map(skill => scoreOf(skill.parts.flatMap(p => p.questions), reviews).percent)) / assessment.skills.length : null;
  return { pending, validated, total: questions.length, progress: questions.length ? validated / questions.length * 100 : 0, finalGrade, status: !assessment.completed ? "In progress" : pending ? "Needs review" : "Reviewed" };
}
export function pendingLocations(assessment: Assessment, reviews: Record<string, QuestionReview> = {}) {
  return SKILLS.flatMap(id => assessment.skills.filter(s => s.id === id).flatMap(skill => skill.parts.flatMap(part => part.questions.filter(q => !isValidated(q, reviews)).map(question => ({ skill: id, part: part.id, question: question.id })))));
}
export function saveCorrection(reviews: Record<string, QuestionReview>, question: Question, criterionId: string, score: number, justification: string, now = new Date().toISOString()) {
  const criterion = question.criteria?.find(c => c.id === criterionId);
  if (!criterion || !Number.isFinite(score) || score < 0 || score > criterion.max) throw new Error("Score must be within the criterion range.");
  if (!justification.trim()) throw new Error("A justification is required.");
  if (score === criterionScore(criterion, reviews[question.id])) throw new Error("Change the score before saving.");
  const previous = reviews[question.id];
  return { ...reviews, [question.id]: { criteria: { ...previous?.criteria, [criterionId]: { score, justification: justification.trim(), savedAt: now } }, validated: false } };
}
export function validateQuestion(reviews: Record<string, QuestionReview>, question: Question, now = new Date().toISOString()) {
  if (!requiresReview(question)) return reviews;
  return { ...reviews, [question.id]: { criteria: reviews[question.id]?.criteria ?? {}, validated: true, validatedAt: now } };
}
// Persist only known question/criterion IDs and valid ranges; never trust browser storage.
export function parseReviews(raw: string | null, assessments: Assessment[]): ReviewState {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !parsed.reviews || typeof parsed.reviews !== "object") return {};
    const result: ReviewState = {};
    for (const assessment of assessments) {
      const saved = parsed.reviews[assessment.id];
      if (!saved || typeof saved !== "object") continue;
      result[assessment.id] = {};
      for (const question of questionsOf(assessment).filter(requiresReview)) {
        const review = saved[question.id];
        if (!review || typeof review !== "object") continue;
        const criteria: Record<string, Correction> = {};
        let invalid = false;
        for (const criterion of question.criteria!) {
          const item = review.criteria?.[criterion.id];
          if (item === undefined) continue;
          if (!item || typeof item.score !== "number" || !Number.isFinite(item.score) || item.score < 0 || item.score > criterion.max || typeof item.justification !== "string" || !item.justification.trim() || typeof item.savedAt !== "string") { invalid = true; continue; }
          criteria[criterion.id] = { score: item.score, justification: item.justification, savedAt: item.savedAt };
        }
        result[assessment.id][question.id] = { criteria, validated: !invalid && review.validated === true, validatedAt: typeof review.validatedAt === "string" ? review.validatedAt : undefined };
      }
    }
    return result;
  } catch { return {}; }
}
