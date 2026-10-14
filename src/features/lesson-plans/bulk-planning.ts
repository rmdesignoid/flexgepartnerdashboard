import type { LessonPlan } from './data';

export type PlanSnapshot = { id: string; title: string; classGoal: string; grammarTopics: string[]; resourceTitles: string[]; procedures: string; sourceId: string; sourceVersion: string };
export type PlannerClass = { groupName?: string; studentName?: string; teacherNames?: string[]; id: string; title: string; date: string; startMinutes: number; duration: number; status: string; classStatus?: string; planTitle?: string; planId?: string; version: string; sourceId?: string; sourceVersion?: string };
export type Application = { id: string; batchId: string; eventId: string; eventVersion: string; classTitle: string; date: string; startMinutes: number; appliedAt: string; snapshot: PlanSnapshot };
export type ApplicationRequest = { id: string; fingerprint: string };
export type ApplicationResult = { id: string; title: string; date: string; success: boolean; message: string };
export const applicationStorageKey = 'flexge-lesson-plan-applications-v1';

const content: Record<string, { resources: string[]; procedures: string }> = {
  sports: { resources: ['Sports vocabulary cards', 'Abilities interview worksheet'], procedures: 'Warm-up: name familiar sports. Model can / can’t and like / dislike. Students interview a partner about abilities and preferences, then share their findings. Finish with feedback and an exit question.' },
  zoo: { resources: ['Animal picture cards', 'Habitat comparison worksheet'], procedures: 'Introduce animal vocabulary, describe habitats using there is / are, and compare animals in pairs. Finish with a short description of a favorite animal.' },
  trip: { resources: ['Weekend destination cards', 'Travel role-play worksheet'], procedures: 'Discuss weekend destinations. Model questions for recommendations and going to for future plans. Students plan a trip in pairs and present their itinerary. Close with language feedback.' },
};

export function snapshotForPlan(plan: LessonPlan): PlanSnapshot {
  return { id: `library:${plan.id}:${plan.updatedAt}`, title: plan.title, classGoal: plan.goal, grammarTopics: [...plan.grammars], resourceTitles: [...(content[plan.id]?.resources ?? [])], procedures: content[plan.id]?.procedures ?? '', sourceId: plan.id, sourceVersion: plan.updatedAt };
}
export function classFingerprint(item: PlannerClass) {
  return JSON.stringify([item.id, item.date, item.startMinutes, item.duration, item.status, item.classStatus, item.planId, item.version]);
}
export function unavailableReason(item: PlannerClass, plan: LessonPlan, now = new Date()) {
  if (plan.status !== 'Published') return 'Publish this plan before applying it.';
  if (item.status === 'Taught') return 'This class has already been taught.';
  if (['Canceled', 'Student no-show', 'Reschedule pending'].includes(item.classStatus ?? '')) return `Class status: ${item.classStatus}.`;
  const starts = new Date(`${item.date}T00:00:00`);
  starts.setMinutes(item.startMinutes);
  if (!Number.isFinite(starts.getTime()) || starts < now) return 'This class is in the past.';
  if (item.sourceId === plan.id && item.sourceVersion === plan.updatedAt) return 'This version is already applied.';
  return '';
}
export function needsReplacement(item: PlannerClass) {
  return Boolean(item.planId || item.planTitle || ['Planning', 'Planned'].includes(item.status));
}
export function currentPlanLabel(item: PlannerClass) {
  if (item.sourceId) return `Lesson plan: ${item.planTitle ?? 'Applied plan'}`;
  if (item.planTitle) return `Custom lesson plan: ${item.planTitle}`;
  return needsReplacement(item) ? 'Custom lesson plan' : 'No lesson plan assigned';
}
export function levelWarning(item: PlannerClass, plan: LessonPlan) {
  const level = item.title.match(/\b[ABC][12]\b/i)?.[0].toUpperCase();
  return level && !plan.levels.includes(level) ? `${level} differs from this plan’s levels.` : '';
}
export function reviewApplications(classes: PlannerClass[], plan: LessonPlan, requests: ApplicationRequest[], now = new Date()): ApplicationResult[] {
  return [...new Map(requests.map(request => [request.id, request])).values()].map(request => {
    const item = classes.find(candidate => candidate.id === request.id);
    const message = !item ? 'Class no longer available.' : unavailableReason(item, plan, now) || (classFingerprint(item) !== request.fingerprint ? 'Class changed. Select it again.' : 'Applied');
    return { id: request.id, title: item?.title ?? 'Unavailable class', date: item?.date ?? '', success: message === 'Applied', message };
  });
}
export function readApplications(): Application[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(applicationStorageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is Application => item && typeof item.id === 'string' && typeof item.eventId === 'string' && typeof item.eventVersion === 'string' && typeof item.appliedAt === 'string' && typeof item.classTitle === 'string' && typeof item.date === 'string' && typeof item.snapshot?.sourceId === 'string' && typeof item.snapshot?.sourceVersion === 'string' && typeof item.snapshot?.procedures === 'string' && Array.isArray(item.snapshot?.grammarTopics) && Array.isArray(item.snapshot?.resourceTitles));
  } catch { return []; }
}
