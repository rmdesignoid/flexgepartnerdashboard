export type LessonPlan = {
  id: string;
  title: string;
  goal: string;
  levels: string[];
  grammars: string[];
  tags: string[];
  status: "Published" | "Draft";
  updatedAt: string;
};

// Illustrative records from the supplied list design.
export const exampleLessonPlans: LessonPlan[] = [
  { id: "sports", title: "Talking About Sports", goal: "Talk about favorite sports and describe what you can do", levels: ["A1", "A2"], grammars: ["Can / can't", "Like / dislike"], tags: ["Sports", "Speaking", "Y2", "L37"], status: "Published", updatedAt: "2025-11-17" },
  { id: "zoo", title: "A Day at the Zoo", goal: "Name animals and compare their habitats", levels: ["A2", "B1"], grammars: ["Can", "Present Simple", "There is / are"], tags: ["Vocabulary", "Wildlife", "Y3", "L42"], status: "Draft", updatedAt: "2025-11-22" },
  { id: "trip", title: "Planning a Weekend Trip", goal: "Ask for recommendations and make plans for the weekend", levels: ["A1", "B1"], grammars: ["Going to", "Future plans", "Questions"], tags: ["Role-play", "Travel", "Y2", "L18"], status: "Published", updatedAt: "2025-11-20" },
];

export type PlanFilters = { query: string; level: string; grammar: string; tag: string };
export type PlanSort = { key: "title" | "status"; direction: "ascending" | "descending" };
export function visibleLessonPlans(plans: LessonPlan[], filters: PlanFilters, sort?: PlanSort) {
  const query = filters.query.trim().toLocaleLowerCase("en");
  const result = plans.filter(plan => (!query || plan.title.toLocaleLowerCase("en").includes(query)) && (!filters.level || plan.levels.includes(filters.level)) && (!filters.grammar || plan.grammars.includes(filters.grammar)) && (!filters.tag || plan.tags.includes(filters.tag)));
  return sort ? result.sort((a, b) => a[sort.key].localeCompare(b[sort.key], "en") * (sort.direction === "ascending" ? 1 : -1)) : result;
}
