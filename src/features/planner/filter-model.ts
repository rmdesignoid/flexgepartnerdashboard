export type CalendarFilters = { group: string[]; teacher: string[]; student: string[]; classStatus: string[]; planningStatus: string[] };
export type FilterOptions = { group: string[]; teacher: string[]; student: string[] };
type FilterableClass = { title: string; status: string; classStatus?: string; groupName?: string; studentName?: string; teacherNames?: string[] };
export const defaultFilterOptions: FilterOptions = { group: ['B1 Group', 'A2 Group', 'Conversation Club'], teacher: ['Mariana Costa', 'Lucas Almeida'], student: ['Ana Beatriz Costa', 'Camila Pereira', 'Gabriel Santos', 'Mariana Silva'] };
export function optionsFromClasses(classes: FilterableClass[]): FilterOptions {
  const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return { group: unique(classes.map(item => item.groupName ?? '')), teacher: unique(classes.flatMap(item => item.teacherNames ?? [])), student: unique(classes.map(item => item.studentName ?? '')) };
}
export function matchesCalendarFilters(item: FilterableClass, filters: CalendarFilters) {
  return (!filters.classStatus.length || filters.classStatus.includes(item.classStatus ?? ''))
    && (!filters.planningStatus.length || filters.planningStatus.includes(item.status))
    && (!filters.student.length || filters.student.includes(item.studentName ?? ''))
    && (!filters.teacher.length || filters.teacher.some(name => item.teacherNames?.includes(name)))
    && (!filters.group.length || filters.group.includes(item.groupName ?? item.title));
}
