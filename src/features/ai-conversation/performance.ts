import { SKILL_LABELS, type Attempt, type ConversationState, type Practice } from "./types";

export type PerformanceEntry = { attempt: Attempt; practice: Practice; time: number };
export function studentHistory(state: ConversationState, student: string): PerformanceEntry[] {
  const practices = new Map(state.practices.filter((p) => p.practiceType !== "ai-exercise").map((p) => [p.id, p]));
  return state.attempts.flatMap((attempt) => {
    const practice = practices.get(attempt.practiceId);
    const time = Date.parse(attempt.completedAt);
    return practice && attempt.student === student && attempt.completed !== false
      ? [{ attempt, practice, time }] : [];
  }).sort((a, b) => (Number.isFinite(a.time) ? a.time : 0) - (Number.isFinite(b.time) ? b.time : 0) || a.attempt.id.localeCompare(b.attempt.id));
}
export function performanceSlice(history: PerformanceEntry[], start = "", end = ""): PerformanceEntry[] {
  if (!start && !end) return history.slice(-10);
  // Calendar boundaries use the same local dates displayed in the UI.
  const lower = start ? new Date(`${start}T00:00:00`).getTime() : -Infinity;
  const upper = end ? new Date(`${end}T00:00:00`).getTime() : Infinity;
  const exclusiveEnd = Number.isFinite(upper) ? new Date(`${end}T00:00:00`) : null;
  exclusiveEnd?.setDate(exclusiveEnd.getDate() + 1);
  return history.filter((entry) => Number.isFinite(entry.time) && entry.time >= lower && entry.time < (exclusiveEnd?.getTime() ?? upper));
}
export function effectiveSkills(attempt: Attempt) {
  return SKILL_LABELS.map((label) => attempt.teacherCorrections?.find((s) => s.label === label) ?? attempt.evaluation?.dimensions.find((s) => s.label === label)).filter((s): s is { label: string; score: number; evidence?: string } => !!s);
}
export function hasEvaluation(entry: PerformanceEntry) {
  const overall = entry.attempt.evaluation?.overall;
  return typeof overall === "number" && Number.isFinite(overall) && overall >= 0 && overall <= 100;
}
// Text evidence is deliberately independent of scores. A score-only edit keeps
// its narrative; edited teacher evidence replaces the old interpretation.
export function qualitativeText(value = "") {
  return value.split(/(?<=[.!?])\s+/).filter((sentence) =>
    !/\b(score|scores|scored|points?|percent|percentage|average|confiden\w*|anxious|nervous)\b|\d/i.test(sentence)
  ).join(" ").trim();
}
function evidenceChanged(attempt: Attempt) {
  return attempt.teacherCorrections?.some((skill) =>
    (skill.evidence ?? "") !== (attempt.evaluation?.dimensions.find((s) => s.label === skill.label)?.evidence ?? "")
  ) ?? false;
}
function currentEvidence(entry: PerformanceEntry) {
  const { attempt } = entry;
  const revised = evidenceChanged(attempt);
  return {
    observations: (revised
      ? effectiveSkills(attempt).map((skill) => skill.evidence ?? "")
      : [attempt.evaluation?.summary ?? "", ...(attempt.evaluation?.strengths ?? []), ...(attempt.evaluation?.howYouDid ?? [])]
    ).map(qualitativeText).filter(Boolean),
    difficulties: (revised
      ? (attempt.teacherCorrections ?? []).map((skill) => skill.evidence ?? "")
      : attempt.evaluation?.growthAreas ?? []
    ).map(qualitativeText).filter((text) => !!text && (!revised || DIFFICULTY.test(text))),
  };
}
const COMMUNICATION_PATTERNS = [
  {
    key: "reasons", match: /reason|justif|support.*(choice|opinion|claim)|sustain.*(choice|opinion)/i,
    text: "When explaining choices or opinions, the reasons are not developed enough for the listener to follow the thinking.",
    recommendation: "Present two options suited to the learner's activity level. Ask the learner to explain a preference to a partner, give reasons and respond to an objection. Observe whether the partner can understand the reasons for the choice.",
    improvement: "Later productions develop reasons more clearly when explaining choices or opinions.",
  },
  {
    key: "sequence", match: /sequence|chronolog|timeline|order of events|before.*after|past.*(present|routine)|connect.*events/i,
    text: "When recounting experiences, the sequence of events is not always clear to the listener.",
    recommendation: "Ask the learner to recount a personal experience to a partner, using a timeline for initial support. Have them explain what happened before, during and after, then retell it without the timeline. Observe whether the partner can follow the sequence.",
    improvement: "Later accounts connect events in a clearer sequence that the listener can follow.",
  },
  {
    key: "development", match: /develop.*(answer|response|idea|explanation)|expand.*(answer|response)|short (answer|response)|abstract|explain.*point of view/i,
    text: "When developing answers or a point of view, explanations remain brief and give the listener limited detail.",
    recommendation: "Use a concrete situation related to the activities in this selection. Ask the learner to explain a point of view to a partner, add an example and answer a follow-up question. Gradually reduce prompts and observe whether the explanation becomes easier to follow.",
    improvement: "Later productions develop answers with more detail and clearer explanations.",
  },
  {
    key: "continuity", match: /continuity|connect.*ideas|link.*(sentence|idea)|long pauses|interrupt.*(message|speech)|group short sentences/i,
    text: "When connecting ideas, breaks or disconnected phrases make the message harder to follow.",
    recommendation: "Choose a familiar situation at the learner's activity level and ask them to explain it to a partner in connected phrases. Use a short outline as initial support, then repeat without it. Observe whether the partner can follow the message through to its conclusion.",
    improvement: "Later productions connect ideas with greater continuity, making the message easier to follow.",
  },
];
const DIFFICULTY = /\b(difficult\w*|unclear|limited|little|short|not|needs?|lack\w*|harder|brief|confus\w*)\b|group short sentences/i;
const POSITIVE = /\b(clear\w*|develops?|developed|connects?|connected|supports?|supported|explains?|explained|links?|linked)\b/i;

export function recurringDifficulties(entries: PerformanceEntry[]) {
  return COMMUNICATION_PATTERNS.flatMap((pattern) => {
    const matches = entries.filter((entry) => currentEvidence(entry).difficulties.some((text) =>
      pattern.match.test(text) && (!evidenceChanged(entry.attempt) || DIFFICULTY.test(text))
    ));
    const distinct = matches.filter((entry, index) => matches.findIndex((e) => e.attempt.practiceId === entry.attempt.practiceId) === index);
    return distinct.length >= 2 ? [{ ...pattern, entries: distinct }] : [];
  });
}
export function pedagogicalSummary(entries: PerformanceEntry[]) {
  if (!entries.length) return "Analysis will be available when feedback is added.";
  if (entries.length === 1) return "There is not enough information to analyze progress yet. At least two practices with feedback are needed.";
  // A change is supported only by an earlier difficulty and later explicit
  // positive evidence in a comparable task, never by a changed score.
  const advances = COMMUNICATION_PATTERNS.flatMap((pattern) => {
    const improved = entries.some((later, index) => {
      const positive = currentEvidence(later).observations.some((text) => pattern.match.test(text) && POSITIVE.test(text) && !DIFFICULTY.test(text));
      const stillDifficult = currentEvidence(later).difficulties.some((text) => pattern.match.test(text));
      return positive && !stillDifficult && entries.slice(0, index).some((earlier) =>
        earlier.time < later.time && earlier.practice.level === later.practice.level &&
        communicativeGoal(earlier.practice) === communicativeGoal(later.practice) &&
        currentEvidence(earlier).difficulties.some((text) => pattern.match.test(text))
      );
    });
    return improved ? [pattern.improvement] : [];
  });
  if (advances.length) return advances.join(" ");
  const observed = [...new Set(entries.flatMap((entry) => currentEvidence(entry).observations))].slice(0, 2);
  return "No clear communicative progress can be established from the available evidence across these tasks." +
    (observed.length ? ` The reports describe the following observed communication: ${observed.join(" ")}` : " There is not enough qualitative evidence to describe communication across these practices.");
}
export function communicativeGoal(practice: Practice) {
  return practice.goal?.trim() || practice.activityInstructions?.trim() || practice.scenario?.trim() || "Communicative goal unavailable.";
}
export function performanceDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Curated copy for the seeded Anna demonstration, never for real assessments.
export function annaExampleInsights(entries: PerformanceEntry[], student: string) {
  if (student !== "Anna Johnson" || entries.some((entry) => entry.attempt.evaluation?.mode !== "simulated")) return null;
  const ids = {
    weekend: "example-oral-anna-weekend-v2-v1",
    hotel: "example-oral-anna-hotel-v2-v1",
    restaurant: "example-oral-anna-restaurant-v2-v1",
    project: "example-oral-anna-project-v2-v1",
    followup: "example-oral-anna-hotel-followup-v2-v1",
    dinner: "example-oral-restaurant-v1",
  };
  const samples = entries.filter((entry) => entry.practice.isExample && !evidenceChanged(entry.attempt) && entry.attempt.student === student && Object.values(ids).includes(entry.practice.id));
  if (samples.length < 2) return null;
  const definitions = [
    {
      key: "example-continuity",
      ids: [ids.weekend, ids.project, ids.followup],
      text: "Transitions and pauses need more consistency. Short phrases, missing links between events and long sentences can make parts of the message harder to follow.",
      recommendation: "Retell a familiar experience in three stages using ‘first’, ‘then’ and ‘as a result’. Mark a short pause between stages, then repeat without the outline. Check whether a partner can follow the sequence.",
    },
    {
      key: "example-requests",
      ids: [ids.hotel, ids.restaurant, ids.followup, ids.dinner],
      text: "Service requests need greater variety and precision. Anna sometimes relies on repeated request phrases and needs support when expressing a conditional backup option.",
      recommendation: "Role-play a hotel or restaurant problem. Alternate ‘Could I…?’, ‘Could you check whether…?’ and ‘Would it be possible…?’. Add a backup request with ‘If…’ and respond to one unexpected answer.",
    },
    {
      key: "example-detail",
      ids: [ids.weekend, ids.restaurant, ids.project, ids.dinner],
      text: "Reasons and descriptions can be more specific. Some answers would benefit from a clearer reason, a descriptive word or a concrete detail about the outcome.",
      recommendation: "Extend an answer with one reason and one concrete example. Describe an activity, explain a food restriction or recount a project result. Ask a partner to repeat the key detail to check that it was clear.",
    },
  ];
  const patterns = definitions.flatMap(({ ids: matchingIds, ...definition }) => {
    const evidence = samples.filter((entry) => matchingIds.includes(entry.practice.id));
    return evidence.length >= 2 ? [{ ...definition, entries: evidence }] : [];
  });
  const has = (id: string) => samples.some((entry) => entry.practice.id === id);
  const summary = has(ids.weekend) && has(ids.followup) && has(ids.project)
    ? "In this illustrative history, Anna communicates across familiar descriptions, service requests and a project account. The early weekend response uses short, repeated phrases; later examples include a concrete contribution to a project, clearer context for a hotel problem and a practical alternative. Relevant vocabulary and task focus are consistent strengths. The next priorities are smoother links between ideas, more precise requests and richer supporting details. These tasks differ in level and purpose, so the score trend alone does not establish learning progress."
    : `In the selected illustrative practices, Anna communicates the main purpose of each task and uses vocabulary suited to the situation. The examples cover ${samples.map((entry) => entry.practice.title.toLowerCase()).join("; ")}. ${patterns.length ? "The recurring priorities in this selection are clearer connections, more precise phrasing or more specific supporting details, as described below." : "This selection is too small or varied to establish a recurring difficulty; compare additional examples with similar goals."} Different task levels and goals mean that score changes alone do not establish learning progress.`;
  return { summary, patterns };
}