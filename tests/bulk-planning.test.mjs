import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const context = createContext({ exports: {} });
runInContext(ts.transpileModule(readFileSync(new URL('../src/features/lesson-plans/bulk-planning.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const { classFingerprint, unavailableReason, reviewApplications, snapshotForPlan, levelWarning, currentPlanLabel } = context.exports;
const now = new Date('2026-10-14T12:00:00');
const plan = { id: 'sports', title: 'Sports', goal: 'Talk about sports', levels: ['A1', 'A2'], grammars: ['Can'], tags: [], status: 'Published', updatedAt: '2025-11-17' };
const lesson = { id: 'a', title: 'A1 Group', date: '2026-10-16', startMinutes: 600, duration: 60, status: 'To Plan', classStatus: 'Scheduled', version: '1' };
const request = item => ({ id: item.id, fingerprint: classFingerprint(item) });

test('past, taught, canceled and draft destinations cannot be applied', () => {
  assert.equal(unavailableReason(lesson, plan, now), '');
  for (const item of [{ ...lesson, date: '2026-10-13' }, { ...lesson, status: 'Taught' }, { ...lesson, classStatus: 'Canceled' }, { ...lesson, classStatus: 'Reschedule pending' }]) assert.ok(unavailableReason(item, plan, now));
  assert.ok(unavailableReason(lesson, { ...plan, status: 'Draft' }, now));
});
test('existing planning can be replaced without additional confirmation', () => {
  const planned = { ...lesson, status: 'Planning', planId: 'existing' };
    assert.equal(reviewApplications([planned], plan, [request(planned)], now)[0].success, true);
});
test('changes after selection and deleted classes return per-class failures', () => {
  const results = reviewApplications([{ ...lesson, startMinutes: 660 }], plan, [request(lesson), { id: 'deleted', fingerprint: '' }], now);
  assert.equal(results.length, 2);
  assert.equal(results.every(result => !result.success), true);
});
test('duplicate requests and already applied versions do not reapply', () => {
  assert.equal(reviewApplications([lesson], plan, [request(lesson), request(lesson)], now).length, 1);
  const applied = { ...lesson, sourceId: plan.id, sourceVersion: plan.updatedAt };
  assert.equal(reviewApplications([applied], plan, [request(applied)], now)[0].success, false);
});
test('snapshots keep independent arrays and level mismatches remain advisory', () => {
  const snapshot = snapshotForPlan(plan);
  snapshot.grammarTopics.push('Extra topic');
  assert.equal(plan.grammars.length, 1);
  assert.equal(levelWarning(lesson, plan), '');
  assert.ok(levelWarning({ ...lesson, title: 'B1 Group' }, plan));
  assert.equal(snapshot.sourceVersion, plan.updatedAt);
  assert.ok(snapshot.procedures);
});

test('existing plans identify library applications and personalized planning', () => {
  assert.equal(currentPlanLabel({ ...lesson, sourceId: 'sports', planTitle: 'Sports' }), 'Lesson plan: Sports');
  assert.equal(currentPlanLabel({ ...lesson, planId: 'custom', planTitle: 'Daily routines' }), 'Custom lesson plan: Daily routines');
  assert.equal(currentPlanLabel({ ...lesson, status: 'Planning' }), 'Custom lesson plan');
  assert.equal(currentPlanLabel(lesson), 'No lesson plan assigned');
});
