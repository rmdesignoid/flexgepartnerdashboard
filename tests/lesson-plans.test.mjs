import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const context = createContext({ exports: {} });
runInContext(ts.transpileModule(readFileSync(new URL('../src/features/lesson-plans/data.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const { exampleLessonPlans: plans, visibleLessonPlans } = context.exports;
const empty = { query: '', level: '', grammar: '', tag: '' };
const ids = result => Array.from(result, plan => plan.id);

test('name search ignores case and surrounding whitespace', () => {
  assert.deepEqual(ids(visibleLessonPlans(plans, { ...empty, query: '  ZOO ' })), ['zoo']);
  assert.deepEqual(ids(visibleLessonPlans(plans, { ...empty, query: 'unknown' })), []);
  assert.deepEqual(ids(visibleLessonPlans(plans, empty)), ['sports', 'zoo', 'trip']);
});

test('filters combine level, grammar and tag instead of widening results', () => {
  assert.deepEqual(ids(visibleLessonPlans(plans, { ...empty, level: 'B1' })), ['zoo', 'trip']);
  assert.deepEqual(ids(visibleLessonPlans(plans, { ...empty, level: 'B1', grammar: 'Going to', tag: 'Y2' })), ['trip']);
  assert.deepEqual(ids(visibleLessonPlans(plans, { ...empty, level: 'A1', tag: 'Wildlife' })), []);
});

test('sorting works in both directions without changing the source collection', () => {
  assert.deepEqual(ids(visibleLessonPlans(plans, empty, { key: 'title', direction: 'ascending' })), ['zoo', 'trip', 'sports']);
  assert.deepEqual(ids(visibleLessonPlans(plans, empty, { key: 'title', direction: 'descending' })), ['sports', 'trip', 'zoo']);
  assert.equal(visibleLessonPlans(plans, empty, { key: 'status', direction: 'ascending' })[0].status, 'Draft');
  assert.deepEqual(ids(plans), ['sports', 'zoo', 'trip']);
  assert.deepEqual(ids(visibleLessonPlans([], empty)), []);
});
