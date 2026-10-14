import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const context = createContext({ exports: {} });
runInContext(ts.transpileModule(readFileSync(new URL('../src/features/planner/filter-model.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const { matchesCalendarFilters, optionsFromClasses } = context.exports;
const empty = { group: [], teacher: [], student: [], classStatus: [], planningStatus: [] };
const lesson = { title: 'Conversation', groupName: 'A1 Group', studentName: 'Ana', teacherNames: ['Mariana', 'Lucas'], classStatus: 'Scheduled', status: 'To Plan' };
test('all five filters intersect, including teacher assignment', () => {
  const filters = { group: ['A1 Group'], teacher: ['Lucas'], student: ['Ana'], classStatus: ['Scheduled'], planningStatus: ['To Plan'] };
  assert.equal(matchesCalendarFilters(lesson, filters), true);
  for (const key of Object.keys(filters)) assert.equal(matchesCalendarFilters(lesson, { ...filters, [key]: ['Does not match'] }), false, key);
});
test('multiple options within a filter match any selected value', () => {
  assert.equal(matchesCalendarFilters(lesson, { ...empty, planningStatus: ['Planned', 'To Plan'], teacher: ['Another teacher', 'Lucas'] }), true);
  assert.equal(matchesCalendarFilters({ ...lesson, teacherNames: [] }, { ...empty, teacher: ['Lucas'] }), false);
  assert.equal(matchesCalendarFilters(lesson, empty), true);
});
test('people options come from actual classes without duplicates or empty values', () => {
  const options = optionsFromClasses([lesson, lesson, { title: 'Empty', status: 'To Plan' }]);
  assert.deepEqual(Array.from(options.group), ['A1 Group']);
  assert.deepEqual(Array.from(options.teacher), ['Lucas', 'Mariana']);
  assert.deepEqual(Array.from(options.student), ['Ana']);
});
