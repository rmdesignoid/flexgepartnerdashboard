import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function load(name, dependencies = {}) {
  const source = readFileSync(new URL(`../src/features/abilities-tests/${name}.ts`, import.meta.url), 'utf8');
  const context = createContext({ exports: {}, Intl, Date, require: id => {
    if (!(id in dependencies)) throw new Error(`Unexpected import ${id}`);
    return dependencies[id];
  } });
  runInContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return context.exports;
}
const model = load('model');
const { ASSESSMENTS, initialReviews } = load('data', { './model': model });
const assessment = ASSESSMENTS[0];
const manual = model.questionsOf(assessment).filter(model.requiresReview);
const question = manual[0];
const criterion = question.criteria[0];

test('demo fixtures have unique IDs and consistent raw totals and criterion ranges', () => {
  for (const a of ASSESSMENTS) {
    assert.equal(a.skills.length, 4);
    const qs = model.questionsOf(a);
    assert.equal(new Set(qs.map(q => q.id)).size, qs.length);
    for (const q of qs) {
      assert.ok(q.score >= 0 && q.score <= q.max);
      if (q.criteria) {
        assert.ok(Math.abs(q.criteria.reduce((sum, c) => sum + c.max, 0) - q.max) < 0.000001);
        for (const c of q.criteria) assert.ok(c.aiScore >= 0 && c.aiScore <= c.max);
      }
    }
  }
});
test('final grade is withheld until all questions are validated', () => {
  const summary = model.assessmentSummary(assessment);
  assert.equal(summary.pending, 4);
  assert.equal(summary.finalGrade, null);
  assert.equal(summary.total, 28);
  assert.equal(summary.validated, 24);
});
test('next pending respects skill and part order, then advances after validation', () => {
  let reviews = {};
  const locations = model.pendingLocations(assessment, reviews);
  assert.equal(locations[0].skill, 'writing');
  assert.equal(locations[0].part, '3');
  assert.equal(locations[1].part, '4');
  assert.equal(locations[2].skill, 'speaking');
  reviews = model.validateQuestion(reviews, question);
  assert.equal(model.pendingLocations(assessment, reviews)[0].part, '4');
  assert.equal(model.assessmentSummary(assessment, reviews).validated, 25);
});
test('mean normalizes skills independently and uses unrounded values', () => {
  let reviews = {};
  for (const q of manual) reviews = model.validateQuestion(reviews, q);
  const expected = assessment.skills.reduce((sum, skill) => {
    const qs = skill.parts.flatMap(p => p.questions);
    return sum + qs.reduce((n, q) => n + model.questionScore(q, reviews), 0) / qs.reduce((n, q) => n + q.max, 0) * 100;
  }, 0) / 4;
  assert.ok(Math.abs(model.assessmentSummary(assessment, reviews).finalGrade - expected) < 0.0000001);
  assert.equal(model.assessmentSummary(assessment, reviews).progress, 100);
});
test('correction requires a changed finite score in range and justification', () => {
  for (const score of [-1, NaN, Infinity, criterion.max + 1]) assert.throws(() => model.saveCorrection({}, question, criterion.id, score, 'Reason'));
  assert.throws(() => model.saveCorrection({}, question, criterion.id, criterion.aiScore, 'Reason'));
  assert.throws(() => model.saveCorrection({}, question, criterion.id, criterion.max, '  '));
  assert.throws(() => model.saveCorrection({}, question, 'unknown', 0, 'Reason'));
});
test('saving a new correction invalidates previous validation and retains AI suggestion', () => {
  const validated = model.validateQuestion({}, question);
  const next = model.saveCorrection(validated, question, criterion.id, criterion.max, 'Clear evidence supports full credit.');
  assert.equal(next[question.id].validated, false);
  assert.equal(validated[question.id].validated, true);
  assert.equal(model.criterionScore(criterion, next[question.id]), criterion.max);
  assert.notEqual(criterion.aiScore, criterion.max);
  assert.equal(model.assessmentSummary(assessment, next).pending, 4);
});
test('browser persistence round-trips corrections and isolates assessments', () => {
  const correction = model.saveCorrection({}, question, criterion.id, criterion.max, 'Evidence supports this change.');
  const saved = { ...initialReviews(), [assessment.id]: model.validateQuestion(correction, question) };
  const parsed = model.parseReviews(JSON.stringify({ version: 1, reviews: saved }), ASSESSMENTS);
  assert.equal(parsed[assessment.id][question.id].criteria[criterion.id].score, criterion.max);
  assert.equal(parsed[assessment.id][question.id].validated, true);
  assert.equal(parsed[ASSESSMENTS[3].id], undefined);
});
test('malformed or incompatible saved data does not crash, and invalid corrections cannot validate', () => {
  for (const raw of [null, 'broken json', 'null', '{"version":2}', '[]']) assert.equal(Object.keys(model.parseReviews(raw, ASSESSMENTS)).length, 0);
  const raw = JSON.stringify({ version: 1, reviews: { [assessment.id]: { [question.id]: { validated: true, criteria: { [criterion.id]: { score: 999, justification: 'Invalid', savedAt: '' } } } } } });
  const parsed = model.parseReviews(raw, ASSESSMENTS);
  assert.equal(parsed[assessment.id][question.id].validated, false);
  assert.equal(Object.keys(parsed[assessment.id][question.id].criteria).length, 0);
});
test('an assessment in progress never receives a final grade', () => {
  const inProgress = ASSESSMENTS.find(a => !a.completed);
  let reviews = {};
  for (const q of model.questionsOf(inProgress).filter(model.requiresReview)) reviews = model.validateQuestion(reviews, q);
  assert.equal(model.assessmentSummary(inProgress, reviews).finalGrade, null);
  assert.equal(model.assessmentSummary(inProgress, reviews).status, 'In progress');
});
